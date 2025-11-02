import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export type FrostScratchPanelProps = {
  revealThreshold?: number
  brushRadius?: number
  brushHardness?: number
  eraseStrength?: number
  tintColor?: string // например '#ffffff' или 'rgb(255,255,255)'
  tintOpacity?: number // 0..1
  className?: string
  style?: React.CSSProperties
  onProgress?: (p: number) => void
  onReveal?: () => void
  defaultRevealed?: boolean
  revealed?: boolean
  onRevealedChange?: (r: boolean) => void
  children?: React.ReactNode

  // ★ NEW: фон, который тоже будет стираться (рисуется внутрь canvas)
  backgroundImage?: string | HTMLImageElement
  backgroundFit?: 'cover' | 'contain' | 'fill'
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function toRGBA(color: string, a: number) {
  if (!color) return `rgba(255,255,255,${a})`
  if (color.startsWith('rgba'))
    return color.replace(/rgba\(([^)]+)\)/, (_, inner) => {
      const parts = inner.split(',').map((s: string) => s.trim())
      parts[3] = String(a)
      return `rgba(${parts.join(', ')})`
    })
  if (color.startsWith('rgb('))
    return color.replace(/rgb\(([^)]+)\)/, (_, inner) => `rgba(${inner}, ${a})`)
  // hex
  let c = color.replace('#', '')
  if (c.length === 3)
    c = c
      .split('')
      .map((x) => x + x)
      .join('')
  if (c.length !== 6) return `rgba(255,255,255,${a})`
  const n = parseInt(c, 16)
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255
  return `rgba(${r},${g},${b},${a})`
}

// ★ NEW: helper для вписывания картинки
function coverRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  fit: 'cover' | 'contain' | 'fill',
) {
  if (fit === 'fill') {
    return { dx: 0, dy: 0, dw: dstW, dh: dstH }
  }
  const sr = srcW / srcH
  const dr = dstW / dstH
  if ((fit === 'cover' && sr > dr) || (fit === 'contain' && sr < dr)) {
    const dw = dstH * sr
    const dx = (dstW - dw) / 2
    return { dx, dy: 0, dw, dh: dstH }
  } else {
    const dh = dstW / sr
    const dy = (dstH - dh) / 2
    return { dx: 0, dy, dw: dstW, dh }
  }
}

const FrostScratchPanel: React.FC<FrostScratchPanelProps> = ({
  revealThreshold = 0.4,
  brushRadius = 28,
  brushHardness = 0.75,
  eraseStrength = 1,
  tintColor = '#ffffff',
  tintOpacity = 0.18,
  className,
  style,
  onProgress,
  onReveal,
  defaultRevealed = false,
  revealed: revealedControlled,
  onRevealedChange,
  children,

  // ★ NEW: фоновые пропсы с дефолтами
  backgroundImage,
  backgroundFit = 'cover',
  backgroundPosition = 'center',
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const progressCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawingRef = useRef(false)
  const [revealedUncontrolled, setRevealedUncontrolled] =
    useState(defaultRevealed)
  const revealed = revealedControlled ?? revealedUncontrolled

  const dprRef = useRef<number>(Math.max(1, window.devicePixelRatio || 1))

  // ★ NEW: загрузка фоновой картинки (если передана строка)
  const bgRef = useRef<HTMLImageElement | null>(null)
  const [bgReady, setBgReady] = useState(false)
  useEffect(() => {
    setBgReady(false)
    if (!backgroundImage) {
      bgRef.current = null
      setBgReady(true)
      return
    }
    if (typeof backgroundImage !== 'string') {
      bgRef.current = backgroundImage
      setBgReady(true)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      bgRef.current = img
      setBgReady(true)
    }
    img.onerror = () => {
      bgRef.current = null
      setBgReady(true)
    }
    img.src = backgroundImage
  }, [backgroundImage])

  useLayoutEffect(() => {
    if (!rootRef.current) return
    const el = rootRef.current
    const ro = new ResizeObserver(() => {
      setupCanvases()
      if (!revealed) fillCover()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [
    revealed,
    brushRadius,
    brushHardness,
    eraseStrength,
    tintColor,
    tintOpacity,
    bgReady,
    backgroundFit,
    backgroundPosition,
  ]) // ★ NEW: зависимости

  const setupCanvases = useCallback(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const rect = root.getBoundingClientRect()
    const dpr = (dprRef.current = Math.max(1, window.devicePixelRatio || 1))
    const w = Math.max(1, Math.floor(rect.width * dpr))
    const h = Math.max(1, Math.floor(rect.height * dpr))

    canvas.width = w
    canvas.height = h
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    let pc = progressCanvasRef.current
    if (!pc) {
      pc = document.createElement('canvas')
      progressCanvasRef.current = pc
    }
    const scale = 0.2
    pc.width = Math.max(1, Math.floor(w * scale))
    pc.height = Math.max(1, Math.floor(h * scale))
  }, [])

  // Заливка «покрытия»: теперь (если есть картинка) сначала рисуем её, потом — тинт
  const fillCover = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ★ NEW: фон-картинка внутрь canvas (будет стираться вместе с тинтом)
    const img = bgRef.current
    if (img && img.naturalWidth && img.naturalHeight) {
      let { dx, dy, dw, dh } = coverRect(
        img.naturalWidth,
        img.naturalHeight,
        canvas.width,
        canvas.height,
        backgroundFit,
      )
      // простая позиция
      if (backgroundFit === 'fill') {
        dx = 0
        dy = 0
        dw = canvas.width
        dh = canvas.height
      }
      if (backgroundPosition === 'top') dy = 0
      if (backgroundPosition === 'bottom') dy = canvas.height - dh
      if (backgroundPosition === 'left') dx = 0
      if (backgroundPosition === 'right') dx = canvas.width - dw
      // center — по умолчанию
      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        dx,
        dy,
        dw,
        dh,
      )
    }

    // базовый полупрозрачный тинт
    ctx.fillStyle = toRGBA(tintColor, clamp(tintOpacity, 0, 1))
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    notifyProgress(0)
  }, [tintColor, tintOpacity, backgroundFit, backgroundPosition]) // ★ NEW: зависимости

  const computeProgress = useCallback(() => {
    const canvas = canvasRef.current
    const pc = progressCanvasRef.current
    if (!canvas || !pc) return 0

    const pctx = pc.getContext('2d', { willReadFrequently: true })
    if (!pctx) return 0

    pctx.clearRect(0, 0, pc.width, pc.height)
    pctx.drawImage(canvas, 0, 0, pc.width, pc.height)
    const { data } = pctx.getImageData(0, 0, pc.width, pc.height)

    // считаем прозрачные пиксели (alpha ~ 0) как стёртые
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 8) transparent++
    }
    const total = pc.width * pc.height
    return total > 0 ? transparent / total : 0
  }, [])

  const notifyProgress = useCallback(
    (forceVal?: number) => {
      const p = forceVal ?? computeProgress()
      onProgress?.(p)
      if (p >= revealThreshold) {
        if (revealedControlled === undefined) setRevealedUncontrolled(true)
        onRevealedChange?.(true)
        onReveal?.()
      }
    },
    [
      computeProgress,
      onProgress,
      onReveal,
      revealThreshold,
      revealedControlled,
      onRevealedChange,
    ],
  )

  useEffect(() => {
    setupCanvases()
    if (!revealed) fillCover()
  }, [setupCanvases, fillCover, revealed])

  useEffect(() => {
    if (!revealed) fillCover()
  }, [revealed, fillCover])

  // ★ NEW: когда фон загрузился — перерисуем покрытие
  useEffect(() => {
    if (!revealed && bgReady) fillCover()
  }, [bgReady, revealed, fillCover])

  const getLocalPoint = (e: PointerEvent | React.PointerEvent) => {
    const root = rootRef.current!
    const rect = root.getBoundingClientRect()
    const x = (e.clientX - rect.left) * dprRef.current
    const y = (e.clientY - rect.top) * dprRef.current
    return { x, y }
  }

  const eraseAt = useCallback(
    (x: number, y: number) => {
      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) return
      const r = Math.max(1, brushRadius * dprRef.current)
      const h = clamp(brushHardness, 0, 1)

      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = clamp(eraseStrength, 0.02, 1)

      const grd = ctx.createRadialGradient(x, y, r * h, x, y, r)
      grd.addColorStop(0, 'rgba(0,0,0,1)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd as unknown as CanvasPattern

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    },
    [brushRadius, brushHardness, eraseStrength],
  )

  const onPointerDown = (e: React.PointerEvent) => {
    if (revealed) return
    ;(e.target as Element).setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    const { x, y } = getLocalPoint(e)
    eraseAt(x, y)
    notifyProgress()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || revealed) return
    const { x, y } = getLocalPoint(e)
    eraseAt(x, y)
  }

  const onPointerUp = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    notifyProgress()
  }

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    touchAction: 'none',
    // Важно: никаких backdrop-filter/opacity у контейнера — весь визуал только в canvas
    pointerEvents: revealed ? 'none' : 'auto',
    borderRadius: 16,
  }

  return (
    <div ref={rootRef} className={className} style={style}>
      {/* Контент под оверлеем (виден через стёртые области) */}
      <div className="absolute inset-0">{children}</div>

      {/* Единственный слой-оверлей: фон-картинка + тинт, всё стирается в прозрачность */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          style={canvasStyle}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      )}
    </div>
  )
}

export default FrostScratchPanel
