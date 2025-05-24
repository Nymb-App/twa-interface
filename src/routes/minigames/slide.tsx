import { createFileRoute } from '@tanstack/react-router'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Countdown from 'react-countdown'
import { hapticFeedback } from '@telegram-apps/sdk'
import type { Ref } from 'react'
import { WatchesIcon } from '@/assets/icons/watches'
import EnergyIcon from '@/assets/icons/energy'
import HeaderBg from '@/assets/svg/header-bg'
import { cn } from '@/lib/utils'
import { BombIcon } from '@/assets/icons/bomb'

export const Route = createFileRoute('/minigames/slide')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-[#121312] overflow-x-hidden flex flex-col justify-end">
      <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
        <header className="relative z-10 inline-flex items-center justify-around w-full h-16">
          <HeaderBg className="absolute w-[110%] h-17" />

          <div className="relative flex items-center justify-between w-full h-full px-4">
            <div className="inline-flex items-center justify-center w-1/3">
              <EnergyIcon />
              <span className="font-pixel text-xl text-[#B6FF00]">1200</span>
            </div>

            <div className="w-0.5 h-full bg-gradient-to-b from-transparent from-20% via-white/20 to-transparent to-80%" />

            <Countdown
              date={Date.now() + 30000}
              intervalDelay={1000}
              precision={0}
              renderer={renderer}
              onComplete={() => {
                // setIsFinished(true);
              }}
            />

            <div className="w-0.5 h-full bg-gradient-to-b from-transparent from-20% via-white/20 to-transparent to-80%" />

            <div className="inline-flex items-center justify-center w-1/3">
              <WatchesIcon className="size-9" />
              <span className="font-pixel text-2xl text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
                0
              </span>
            </div>
          </div>
        </header>

        <div className="w-full h-[calc(100%-60px)] absolute bottom-0">
          <BombField
            thresholdPercent={100}
            onInteractionEnter={(params) => console.log(params)}
          />
        </div>
      </div>
    </div>
  )
}

const renderer = ({
  seconds,
  completed,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}) => {
  if (completed) {
    return (
      <div className="inline-flex items-center justify-center w-1/3">
        <span className="font-pixel text-base text-white">00</span>
        <span className="font-pixel text-base text-white">:</span>
        <span className="font-pixel text-base text-white">00</span>
      </div>
    )
  } else {
    return (
      <div className="inline-flex items-center justify-center w-1/3">
        <span className="font-pixel text-base text-white">00</span>
        <span className="font-pixel text-base text-white">:</span>
        <span className="font-pixel text-base text-white">
          {seconds > 9 ? seconds : `0${seconds}`}
        </span>
      </div>
    )
  }
}

// BombField.tsx  ------------------------------------------------------------

type Item = {
  id: string
  type: 'bomb' | 'time'
  top: number
  left: number
  rot: number
  moveDur: string
  animDelay: string
}

function BombField({
  thresholdPercent = 100,
  gridGap = 10,
  bombCount = 4,
  timerCount = 16,
  onInteractionEnter,
}: {
  thresholdPercent?: number
  gridGap?: number
  bombCount?: number
  timerCount?: number
  onInteractionEnter?: (params: {
    item: 'bomb' | 'time'
    posX: number
    posY: number
  }) => void
}) {
  const dotPatternInteractiveRef = useRef<DotPatternHandle>(null)
  const [removed, setRemoved] = useState<Set<string>>(new Set())

  // Генерируем items вместе с параметрами анимации один раз
  const generateItems = useCallback((): Array<Item> => {
    const taken = new Set<number>()
    const randCell = () => {
      let c: number
      do c = Math.floor(Math.random() * gridGap * gridGap)
      while (taken.has(c))
      taken.add(c)
      return c
    }
    const randomDur = (min: number, max: number) =>
      (min + Math.random() * (max - min)).toFixed(2) + 's'
    const randomDelay = () => '-' + (Math.random() * 4).toFixed(2) + 's'
    const makeItem = (type: 'bomb' | 'time'): Item => {
      const cell = randCell()
      const row = Math.floor(cell / gridGap)
      const col = cell % gridGap
      return {
        id: crypto.randomUUID(),
        type,
        top: 5 + row * (90 / (gridGap - 1)),
        left: 5 + col * (90 / (gridGap - 1)),
        rot: Math.random() * 360,
        moveDur: randomDur(2, 4),
        animDelay: randomDelay(),
      }
    }
    return [
      ...Array.from({ length: bombCount }, () => makeItem('bomb')),
      ...Array.from({ length: timerCount }, () => makeItem('time')),
    ]
  }, [])

  const [items, setItems] = useState<Array<Item>>(() => generateItems())

  const handleHit = useCallback((id: string) => {
    setRemoved((prev) => new Set(prev).add(id))
  }, [])

  useEffect(() => {
    const removedTimes = items.filter(
      (i) => i.type === 'time' && removed.has(i.id),
    ).length
    const thresholdCount = Math.ceil(timerCount * (thresholdPercent / 100))
    if (removedTimes >= thresholdCount) {
      setRemoved(new Set())
      setItems(generateItems())
    }
  }, [removed, items, generateItems, thresholdPercent])

  useEffect(() => {
    const onMove = (e: TouchEvent | PointerEvent) => {
      e.preventDefault()
      let x: number, y: number
      if ('touches' in e) {
        if (!e.touches.length) return
        x = e.touches[0].clientX
        y = e.touches[0].clientY
      } else {
        x = e.clientX
        y = e.clientY
      }
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      if (!el) return
      const hit = el.closest<HTMLElement>('[data-id]')
      if (!hit) return
      const id = hit.dataset.id!
      if (!removed.has(id)) handleHit(id)

      const type = hit.dataset.type as 'bomb' | 'time'

      if (onInteractionEnter) {
        e.preventDefault()
        let x: number
        let y: number
        if ('touches' in e) {
          if (!e.touches.length) return
          x = e.touches[0].clientX
          y = e.touches[0].clientY
        } else {
          x = e.clientX
          y = e.clientY
        }
        onInteractionEnter({ item: type, posX: x, posY: y })
      }

      if (type === 'bomb') {
        // TODO: Call wave effect

        e.preventDefault()
        let x: number
        let y: number
        if ('touches' in e) {
          if (!e.touches.length) return
          x = e.touches[0].clientX
          y = e.touches[0].clientY
        } else {
          x = e.clientX
          y = e.clientY
        }

        dotPatternInteractiveRef.current?.triggerWave({ x, y })
        hapticFeedback.notificationOccurred('error')
      } else {
        if (hapticFeedback.impactOccurred.isAvailable()) {
          hapticFeedback.impactOccurred(
            navigator.userAgent.includes('Android') ? 'heavy' : 'medium',
          )
        }
      }
    }

    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('pointermove', onMove, { passive: false })
    return () => {
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('pointermove', onMove)
    }
  }, [handleHit, removed])

  return (
    <>
      <DotPatternInteractive
        ref={dotPatternInteractiveRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full duration-500 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)]"
        gap={40}
        baseRadius={2}
        maxRadius={4}
        reach={80}
        blur={0}
        staticColor="#969695"
        activeColor="#B6FF00"
        trailing
        trailLength={20}
        minTrailLength={1}
        trailingLifetime={100}
        trailingRadius={8}
        trailingColor="#B6FF00"
        drawEffect="wave"
        waveReach={300}
        waveColor="#EF5252"
        waveOnPointerUp={false}
      />
      <div className="absolute inset-0 bg-[#121312] pointer-events-none mask-[radial-gradient(ellipse_200px_400px_at_center,transparent,black)]" />
      {items.map((item) => {
        const gone = removed.has(item.id)
        const Icon = item.type === 'bomb' ? BombIcon : WatchesIcon
        const label = item.type === 'bomb' ? '-10%' : '+2'
        return (
          <div
            key={item.id}
            data-id={item.id}
            data-type={item.type}
            style={
              {
                top: `${item.top}%`,
                left: `${item.left}%`,
                '--move-dur': item.moveDur,
                '--anim-delay': item.animDelay,
              } as React.CSSProperties
            }
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-400',
              gone && 'pointer-events-none opacity-0 scale-140',
            )}
          >
            {gone && (
              <span
                className={cn(
                  'font-pixel absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-2xl animate-[rise_2s_ease-out_forwards]',
                  item.type === 'bomb' ? 'text-[#ef5252]' : 'text-[#b6ff00]',
                )}
              >
                {label}
              </span>
            )}
            <Icon className="size-14" style={{ rotate: `${item.rot}deg` }} />
          </div>
        )
      })}

      <style>
        {`
                    @keyframes rise {
                        from { opacity: 1; transform: translate(-50%, 0) scale(1); }
                        to   { opacity: 0; transform: translate(-50%, -40px) scale(1.1); }
                    }

                    @keyframes tilt-pulse {
                        0% 100% {
                            transform: rotate(-15deg) scale(1) translate(10%);
                        }
                        50% {
                            transform: rotate( 15deg) scale(1.07) translate(10%);
                        }
                    }

                    [data-id] > svg {
                        animation:
                            tilt-pulse var(--move-dur) ease-in-out infinite var(--anim-delay);
                    }
                `}
      </style>
    </>
  )
}

/* --------------------------------------------------
 * 1. DotPatternInteractive — configurable canvas background
 *    (container‑aware ResizeObserver implementation)
 * -------------------------------------------------- */
export interface DotPatternHandle {
  triggerWave: (pointer: { x: number; y: number }) => void
}
interface DotPatternProps {
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
  waveColor?: string // color of points in wave
  className?: string
}

export const DotPatternInteractive = forwardRef(function (
  {
    className,
    gap = 40,
    baseRadius = 2,
    maxRadius = 6,
    reach = 150,
    blur = 0,
    staticColor = '#64748b',
    activeColor = '#38bdf8',
    trailing = false,
    trailLength = 20,
    minTrailLength = 4,
    trailingLifetime = 50,
    trailingRadius,
    trailingColor,
    trailingGradient,
    animate = 'on-hover',
    drawEffect = 'normal',
    waveStrength = 0.15,
    waveThickness = 0.3,
    waveDuration = 1,
    waveReach,
    waveColor,
    waveOnPointerUp = true,
  }: DotPatternProps,
  ref: Ref<DotPatternHandle>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const [dpr, setDpr] = useState(1)
  const trail = useRef<Array<{ x: number; y: number }>>([])
  const waves = useRef<Array<{ x: number; y: number; start: number }>>([])
  const lastMove = useRef(Date.now())
  const active = useRef(animate === 'on-hover')

  // Helpers
  const lerpColor = useCallback((a: string, b: string, t: number) => {
    const ca = parseInt(a.slice(1), 16)
    const cb = parseInt(b.slice(1), 16)
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

  // Drawing routine
  const draw = useCallback(
    (pointer?: { x: number; y: number }) => {
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
          let dx = 0
          let dy = 0

          // Wave effect
          if (drawEffect === 'wave') {
            let waveDx = 0,
              waveDy = 0,
              blend = 0
            waves.current.forEach((w) => {
              const dt = now - w.start
              const tTime = dt / (waveDuration * 1000)
              if (tTime > 1) return
              const waveRadius = tTime * waveReachPx
              const dist = Math.hypot(xx - w.x, yy - w.y)
              const diff = dist - waveRadius
              const widthPx = waveReachPx * waveThickness
              if (Math.abs(diff) <= widthPx) {
                const amp = Math.exp(-(diff * diff) / (2 * widthPx * widthPx))
                const ease = 1 - tTime
                const factor = waveReachPx * waveStrength
                waveDx += ((xx - w.x) / (dist || 1)) * amp * factor * ease
                waveDy += ((yy - w.y) / (dist || 1)) * amp * factor * ease
                blend = Math.max(blend, amp * ease)
              }
            })
            if (blend > 0) {
              dx = waveDx
              dy = waveDy
              color = lerpColor(staticColor, waveColor ?? activeColor, blend)
            }
          }

          // Fish-eye
          if (!pointer && drawEffect === 'fish-eye') {
            const cx = cvs.width / 2
            const cy = cvs.height / 2
            const tLens = 1 - Math.hypot(xx - cx, yy - cy) / Math.hypot(cx, cy)
            r *= 0.5 + 0.5 * tLens
            color = lerpColor('#000000', staticColor, 0.3 + 0.7 * tLens)
          }

          // Hover
          if (pointer) {
            const d = Math.hypot(pointer.x - xx, pointer.y - yy)
            if (d < reachPx) {
              const t = 1 - d / reachPx
              r = rBase + t * (rHover - rBase)
              color = lerpColor(color, activeColor, t)
            }
          }

          ctx.beginPath()
          ctx.arc(xx + dx, yy + dy, r, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      // Trail
      if (trailing && trail.current.length > 1) {
        ctx.filter = 'none'
        ctx.lineCap = 'round'
        const head = (trailingRadius ?? maxRadius) * dpr
        for (let i = 0; i < trail.current.length - 1; i++) {
          const p1 = trail.current[i]
          const p2 = trail.current[i + 1]
          const t = i / (trail.current.length - 1)
          ctx.lineWidth = head * (1 - t)
          ctx.strokeStyle = trailingGradient
            ? lerpColor(trailingGradient.from, trailingGradient.to, t)
            : (trailingColor ?? activeColor)
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    },
    [
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
      waveStrength,
      waveThickness,
      waveDuration,
      waveReach,
      waveColor,
      lerpColor,
    ],
  )

  // Wave loop
  const waveAnim = useRef<number | null>(null)
  const startWaveLoop = useCallback(() => {
    if (waveAnim.current == null) {
      const tick = () => {
        if (waves.current.length > 0) {
          draw(lastPointerRef.current || undefined)
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
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const scale = window.devicePixelRatio || 1
      setDpr(scale)
      canvas.width = canvas.offsetWidth * scale
      canvas.height = canvas.offsetHeight * scale
      draw()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [draw])

  // Decay trail
  useEffect(() => {
    if (!trailing) return
    const tick = () => {
      if (
        Date.now() - lastMove.current > trailingLifetime &&
        trail.current.length > minTrailLength
      ) {
        trail.current.pop()
        draw(trail.current[0])
      }
      requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [draw, trailing, minTrailLength, trailingLifetime])

  // Pointer events
  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const getPos = (e: PointerEvent) => {
      const rect = cvs.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      }
    }

    const move = (e: PointerEvent) => {
      const pos = getPos(e)
      lastMove.current = Date.now()
      lastPointerRef.current = pos
      if (trailing) {
        trail.current.unshift(pos)
        if (trail.current.length > trailLength) trail.current.pop()
      }
      draw(pos)
    }

    const up = (e: PointerEvent) => {
      // Если авто-волна включена и режим wave — пушим волну
      if (drawEffect === 'wave' && waveOnPointerUp) {
        const pos = getPos(e)
        waves.current.push({ x: pos.x, y: pos.y, start: Date.now() })
        startWaveLoop()
      }
      // сброс hover при touch
      if (e.pointerType === 'touch') {
        lastPointerRef.current = null
        draw()
      }
    }

    const clear = () => {
      active.current = animate === 'on-hover'
      trail.current = []
      draw(lastPointerRef.current || undefined)
    }

    cvs.addEventListener('pointermove', move)
    cvs.addEventListener('pointerup', up)
    cvs.addEventListener('pointerleave', clear)
    cvs.addEventListener('pointercancel', clear)
    return () => {
      cvs.removeEventListener('pointermove', move)
      cvs.removeEventListener('pointerup', up)
      cvs.removeEventListener('pointerleave', clear)
      cvs.removeEventListener('pointercancel', clear)
      if (waveAnim.current != null) cancelAnimationFrame(waveAnim.current)
    }
  }, [
    dpr,
    draw,
    trailing,
    trailLength,
    animate,
    drawEffect,
    waveOnPointerUp,
    startWaveLoop,
  ])

  // Expose API
  useImperativeHandle(
    ref,
    () => ({
      triggerWave: ({ x, y }) => {
        const cvs = canvasRef.current
        if (!cvs) return
        const rect = cvs.getBoundingClientRect()
        const canvasX = (x - rect.left) * dpr
        const canvasY = (y - rect.top) * dpr
        waves.current.push({ x: canvasX, y: canvasY, start: Date.now() })
        startWaveLoop()
      },
    }),
    [startWaveLoop, dpr],
  )

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: 'none' }}
      className={cn('h-full w-full rounded-lg select-none', className)}
    />
  )
})
