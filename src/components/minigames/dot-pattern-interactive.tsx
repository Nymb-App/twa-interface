/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { cn } from '@/utils'

/* --------------------------------------------------
 * 1. DotPatternInteractive — configurable canvas background
 *    (container‑aware ResizeObserver implementation)
 * -------------------------------------------------- */
export interface DotPatternHandle {
  triggerWave: (pointer: { x: number; y: number }) => void
  setWaveParams?: (params: {
    waveStrength?: number
    waveThickness?: number
    waveDuration?: number
    waveReach?: number
    waveColor?: string
  }) => void
  /** Programmatically draw a short trailing gesture (random start/curve). */
  spawnRandomTrail?: (options?: {
    durationMs?: number
    speed?: number
    wave?: boolean
  }) => void
}
export interface DotPatternProps {
  gap?: number
  baseRadius?: number
  maxRadius?: number
  reach?: number
  blur?: number
  staticColor?: string
  activeColor?: string
  trailing?: boolean
  trailLength?: number
  minTrailLength?: number
  trailingLifetime?: number
  trailingRadius?: number
  trailingColor?: string
  trailingGradient?: { from: string; to: string }
  animate?: 'on-hover' | 'on-action'
  drawEffect?: 'normal' | 'fish-eye' | 'wave'
  waveOnPointerUp?: boolean
  waveStrength?: number
  waveThickness?: number
  waveDuration?: number
  waveReach?: number
  waveColor?: string
  className?: string
  /** Новый пропс: сколько одновременных указателей разрешить */
  maxPointers?: number

  onPointerUp?: () => void
}

export const DotPatternInteractive = forwardRef<
  DotPatternHandle,
  DotPatternProps
>(
  (
    {
      className,
      gap = 40,
      baseRadius = 2,
      maxRadius = 4,
      reach = 80,
      blur = 0,
      staticColor = '#969695',
      activeColor = '#B6FF00',
      trailing = true,
      trailLength = 30,
      minTrailLength = 1,
      trailingLifetime = 50,
      trailingRadius = 8,
      trailingColor = '#B6FF00',
      trailingGradient,
      animate = 'on-hover',
      drawEffect = 'normal',
      waveOnPointerUp = false,
      waveStrength = 0.15,
      waveThickness = 0.3,
      waveDuration = 1,
      waveReach = reach,
      waveColor = activeColor,
      maxPointers = 1,

      onPointerUp,
    },
    ref,
  ) => {
    const MAX_TOUCH_SUPPORT = 5 // внутренний абсолютный максимум

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [dpr, setDpr] = useState(1)

    // Maps для работы с несколькими указателями
    const pointerMap = useRef<Map<number, { x: number; y: number }>>(new Map())
    const trailMap = useRef<Map<number, Array<{ x: number; y: number }>>>(
      new Map(),
    )
    const lastMoveMap = useRef<Map<number, number>>(new Map())

    // Волны для эффекта "wave"
    const waves = useRef<Array<{ x: number; y: number; start: number }>>([])
    const active = useRef<boolean>(animate === 'on-hover')

    // Allow rendering trails even if trailing is disabled via props
    const forceTrailRef = useRef<boolean>(false)
    const synthAnimRef = useRef<number | null>(null)

    const lerpColor = useCallback((a: string, b: string, t: number) => {
      const ca = parseInt(a.slice(1), 16),
        cb = parseInt(b.slice(1), 16)
      const ar = (ca >> 16) & 255,
        ag = (ca >> 8) & 255,
        ab = ca & 255
      const br = (cb >> 16) & 255,
        bg = (cb >> 8) & 255,
        bb = cb & 255
      return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(
        ag + (bg - ag) * t,
      )},${Math.round(ab + (bb - ab) * t)})`
    }, [])

    // Wave parameter states with default values
    const [currentWaveStrength, setCurrentWaveStrength] = useState(waveStrength)
    const [currentWaveThickness, setCurrentWaveThickness] =
      useState(waveThickness)
    const [currentWaveDuration, setCurrentWaveDuration] = useState(waveDuration)
    const [currentWaveReach, setCurrentWaveReach] = useState(waveReach)
    const [currentWaveColor, setCurrentWaveColor] = useState(waveColor)

    // Update states when props change
    useEffect(() => {
      setCurrentWaveStrength(waveStrength)
      setCurrentWaveThickness(waveThickness)
      setCurrentWaveDuration(waveDuration)
      setCurrentWaveReach(waveReach)
      setCurrentWaveColor(waveColor)
    }, [waveStrength, waveThickness, waveDuration, waveReach, waveColor])

    // Рисование
    const draw = useCallback(() => {
      const cvs = canvasRef.current
      if (!cvs) return
      const ctx = cvs.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, cvs.width, cvs.height)
      ctx.filter = blur ? `blur(${blur * dpr}px)` : 'none'

      const rBase = baseRadius * dpr
      const rHover = maxRadius * dpr
      const reachPx = reach * dpr
      const waveReachPx = (waveReach ?? reach) * dpr
      const now = Date.now()

      for (let yy = gap / 2; yy < cvs.height; yy += gap) {
        for (let xx = gap / 2; xx < cvs.width; xx += gap) {
          let r = rBase
          let color = staticColor
          let dx = 0,
            dy = 0

          // Wave
          if (drawEffect === 'wave') {
            let waveDx = 0,
              waveDy = 0,
              blend = 0
            waves.current.forEach((w) => {
              const dt = now - w.start
              const tTime = dt / (currentWaveDuration * 1000)
              if (tTime > 1) return
              const waveRadius = tTime * waveReachPx
              const dist = Math.hypot(xx - w.x, yy - w.y)
              const diff = dist - waveRadius
              const widthPx = waveReachPx * currentWaveThickness
              if (Math.abs(diff) <= widthPx) {
                const amp = Math.exp(-(diff * diff) / (2 * widthPx * widthPx))
                const ease = 1 - tTime
                const factor = waveReachPx * currentWaveStrength
                waveDx += ((xx - w.x) / (dist || 1)) * amp * factor * ease
                waveDy += ((yy - w.y) / (dist || 1)) * amp * factor * ease
                blend = Math.max(blend, amp * ease)
              }
            })
            if (blend > 0) {
              dx = waveDx
              dy = waveDy
              color = lerpColor(
                staticColor,
                currentWaveColor ?? activeColor,
                blend,
              )
            }
          }

          // Fish-eye
          if (drawEffect === 'fish-eye' && pointerMap.current.size === 0) {
            const cx = cvs.width / 2,
              cy = cvs.height / 2
            const tLens = 1 - Math.hypot(xx - cx, yy - cy) / Math.hypot(cx, cy)
            r *= 0.5 + 0.5 * tLens
            color = lerpColor('#000000', staticColor, 0.3 + 0.7 * tLens)
          }

          // Hover (максимальный t среди всех указателей)
          if (active.current && pointerMap.current.size > 0) {
            let maxT = 0
            pointerMap.current.forEach((pos) => {
              const d = Math.hypot(pos.x - xx, pos.y - yy)
              if (d < reachPx) maxT = Math.max(maxT, 1 - d / reachPx)
            })
            if (maxT > 0) {
              r = rBase + maxT * (rHover - rBase)
              color = lerpColor(color, activeColor, maxT)
            }
          }

          ctx.beginPath()
          ctx.arc(xx + dx, yy + dy, r, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      // Trailing (also render if programmatic trail is active)
      if (trailing || forceTrailRef.current) {
        ctx.filter = 'none'
        ctx.lineCap = 'round'
        const head = (trailingRadius ?? maxRadius) * dpr
        trailMap.current.forEach((arr) => {
          if (arr.length < 2) return
          for (let i = 0; i < arr.length - 1; i++) {
            const p1 = arr[i],
              p2 = arr[i + 1]
            const t = i / (arr.length - 1)
            ctx.lineWidth = head * (1 - t)
            ctx.strokeStyle = trailingGradient
              ? lerpColor(trailingGradient.from, trailingGradient.to, t)
              : (trailingColor ?? activeColor)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      }
    }, [
      dpr,
      gap,
      baseRadius,
      maxRadius,
      reach,
      blur,
      staticColor,
      activeColor,
      drawEffect,
      trailing,
      trailingRadius,
      trailingColor,
      trailingGradient,
      currentWaveStrength,
      currentWaveThickness,
      currentWaveDuration,
      currentWaveReach,
      currentWaveColor,
      lerpColor,
    ])

    // Wave loop
    const waveAnim = useRef<number | null>(null)
    const startWaveLoop = useCallback(() => {
      if (waveAnim.current == null) {
        const tick = () => {
          if (waves.current.length > 0) {
            draw()
            waveAnim.current = requestAnimationFrame(tick)
          } else {
            cancelAnimationFrame(waveAnim.current!)
            waveAnim.current = null
          }
        }
        waveAnim.current = requestAnimationFrame(tick)
      }
    }, [draw])

    // Resize
    useEffect(() => {
      const cvs = canvasRef.current
      if (!cvs) return
      const resize = () => {
        const scale = window.devicePixelRatio || 1
        setDpr(scale)
        cvs.width = cvs.offsetWidth * scale
        cvs.height = cvs.offsetHeight * scale
        draw()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(cvs)
      return () => void ro.disconnect()
    }, [draw])

    // Decay trailing
    useEffect(() => {
      if (!trailing) return
      const tick = () => {
        const now = Date.now()
        trailMap.current.forEach((arr, id) => {
          const last = lastMoveMap.current.get(id) || 0
          if (now - last > trailingLifetime && arr.length > minTrailLength) {
            for (let i = 0; i < 5 && arr.length > minTrailLength; i++) {
              arr.pop()
            }
          }
          if (arr.length === 0) {
            trailMap.current.delete(id)
            lastMoveMap.current.delete(id)
          }
        })
        draw()
        requestAnimationFrame(tick)
      }
      const id = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(id)
    }, [draw, trailing, minTrailLength, trailingLifetime])

    // Pointer handlers
    useEffect(() => {
      const cvs = canvasRef.current
      if (!cvs) return

      /* ➊  Если трейлинг выключен – вообще не вешаем pointer-слушатели */
      if (!trailing) {
        // но очистим всё, что было раньше
        pointerMap.current.clear()
        trailMap.current.clear()
        lastMoveMap.current.clear()
        draw() // перерисуем «чистый» фон
        return // ⬅️   досрочный выход
      }

      const getPos = (e: PointerEvent) => {
        const rect = cvs.getBoundingClientRect()
        return {
          x: (e.clientX - rect.left) * dpr,
          y: (e.clientY - rect.top) * dpr,
        }
      }

      const handleDown = (e: PointerEvent) => {
        const deviceMax = navigator.maxTouchPoints || 1
        const allowed = Math.min(MAX_TOUCH_SUPPORT, deviceMax, maxPointers)
        if (pointerMap.current.size >= allowed) return
        const pos = getPos(e)
        active.current = animate === 'on-hover'
        pointerMap.current.set(e.pointerId, pos)
        trailMap.current.set(e.pointerId, [pos])
        lastMoveMap.current.set(e.pointerId, Date.now())
        draw()
      }

      const handleMove = (e: PointerEvent) => {
        if (!pointerMap.current.has(e.pointerId)) return
        const pos = getPos(e)
        pointerMap.current.set(e.pointerId, pos)
        lastMoveMap.current.set(e.pointerId, Date.now())
        const arr = trailMap.current.get(e.pointerId)!
        arr.unshift(pos)
        if (arr.length > trailLength) arr.pop()
        draw()
      }

      const handleUp = (e: PointerEvent) => {
        if (drawEffect === 'wave' && waveOnPointerUp) {
          const pos = getPos(e)
          waves.current.push({ x: pos.x, y: pos.y, start: Date.now() })
          startWaveLoop()
        }
        pointerMap.current.delete(e.pointerId)
        draw()
        onPointerUp?.()
      }

      const handleCancel = (e: PointerEvent) => {
        pointerMap.current.delete(e.pointerId)
        trailMap.current.delete(e.pointerId)
        lastMoveMap.current.delete(e.pointerId)
        draw()
      }

      document.addEventListener('pointerdown', handleDown, { passive: false })
      document.addEventListener('pointermove', handleMove, { passive: false })
      document.addEventListener('pointerup', handleUp)
      document.addEventListener('pointercancel', handleCancel)
      return () => {
        document.removeEventListener('pointerdown', handleDown)
        document.removeEventListener('pointermove', handleMove)
        document.removeEventListener('pointerup', handleUp)
        document.removeEventListener('pointercancel', handleCancel)
        if (waveAnim.current != null) cancelAnimationFrame(waveAnim.current)
      }
    }, [
      dpr,
      draw,
      trailing,
      trailLength,
      minTrailLength,
      trailingLifetime,
      animate,
      drawEffect,
      waveOnPointerUp,
      startWaveLoop,
      maxPointers,
      onPointerUp,
    ])

    useImperativeHandle(
      ref,
      () => ({
        triggerWave: ({ x, y }) => {
          const cvs = canvasRef.current
          if (!cvs) return
          const rect = cvs.getBoundingClientRect()
          const cx = (x - rect.left) * dpr
          const cy = (y - rect.top) * dpr
          waves.current.push({ x: cx, y: cy, start: Date.now() })
          startWaveLoop()
        },
        setWaveParams: (params) => {
          if (params.waveStrength !== undefined)
            setCurrentWaveStrength(params.waveStrength)
          if (params.waveThickness !== undefined)
            setCurrentWaveThickness(params.waveThickness)
          if (params.waveDuration !== undefined)
            setCurrentWaveDuration(params.waveDuration)
          if (params.waveReach !== undefined)
            setCurrentWaveReach(params.waveReach)
          if (params.waveColor !== undefined)
            setCurrentWaveColor(params.waveColor)
        },
        spawnRandomTrail: (options) => {
          const cvs = canvasRef.current
          if (!cvs) return

          const duration = Math.max(300, Math.min(1500, options?.durationMs ?? 800))
          const speed = Math.max(2, Math.min(40, options?.speed ?? 8)) * dpr

          // Random start inside canvas with margins
          const margin = 40 * dpr
          let x = margin + Math.random() * Math.max(1, cvs.width - margin * 2)
          let y = margin + Math.random() * Math.max(1, cvs.height - margin * 2)
          let angle = Math.random() * Math.PI * 2

          const PID = -1 // synthetic pointer id
          const arr: Array<{ x: number; y: number }> = [{ x, y }]
          pointerMap.current.set(PID, { x, y })
          trailMap.current.set(PID, arr)
          lastMoveMap.current.set(PID, Date.now())
          forceTrailRef.current = true

          // Optional wave at the start for visual punch
          if (drawEffect === 'wave' && options?.wave) {
            waves.current.push({ x, y, start: Date.now() })
            startWaveLoop()
          }

          draw()

          const start = performance.now()
          const step = (ts: number, prevTs: number) => {
            if (!canvasRef.current) return
            const dt = Math.max(0, ts - prevTs)
            const elapsed = ts - start
            if (elapsed >= duration) {
              // End gesture
              pointerMap.current.delete(PID)
              lastMoveMap.current.delete(PID)

              // Wave on release (if requested)
              if (drawEffect === 'wave' && options?.wave) {
                waves.current.push({ x, y, start: Date.now() })
                startWaveLoop()
              }

              // Manual decay of trail
              const decay = () => {
                const a = trailMap.current.get(PID)
                if (!a || a.length <= (minTrailLength ?? 1)) {
                  trailMap.current.delete(PID)
                  lastMoveMap.current.delete(PID)
                  forceTrailRef.current = false
                  draw()
                  return
                }
                for (let i = 0; i < 5 && a.length > (minTrailLength ?? 1); i++) a.pop()
                draw()
                requestAnimationFrame(decay)
              }
              requestAnimationFrame(decay)
              synthAnimRef.current = null
              return
            }

            // Slightly change direction over time
            angle += (Math.random() - 0.5) * 0.2

            // Move and bounce within bounds
            x += Math.cos(angle) * speed * (dt / 16.7)
            y += Math.sin(angle) * speed * (dt / 16.7)

            if (x < margin) {
              x = margin
              angle = Math.PI - angle
            } else if (x > cvs.width - margin) {
              x = cvs.width - margin
              angle = Math.PI - angle
            }
            if (y < margin) {
              y = margin
              angle = -angle
            } else if (y > cvs.height - margin) {
              y = cvs.height - margin
              angle = -angle
            }

            pointerMap.current.set(PID, { x, y })
            lastMoveMap.current.set(PID, Date.now())
            arr.unshift({ x, y })
            if (arr.length > trailLength) arr.pop()
            draw()
            synthAnimRef.current = requestAnimationFrame((t) => step(t, ts))
          }

          if (synthAnimRef.current != null) cancelAnimationFrame(synthAnimRef.current)
          synthAnimRef.current = requestAnimationFrame((t) => step(t, t))
        },
      }),
      [startWaveLoop, dpr],
    )

    // Cleanup synthetic trail animation on unmount
    useEffect(() => {
      return () => {
        if (synthAnimRef.current != null)
          cancelAnimationFrame(synthAnimRef.current)
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none' }}
        className={cn('h-full w-full rounded-lg select-none', className)}
      />
    )
  },
)
