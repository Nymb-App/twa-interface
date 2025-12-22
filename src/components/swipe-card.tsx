import { BombIcon } from '@/assets/icons/bomb'
import { WatchesIcon } from '@/assets/icons/watches'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export const SwipeCard = ({
  title,
  description,
  subdescription,
  className,
  classNameBg,
}: {
  title: string
  description: string
  subdescription?: string
  className?: string
  classNameBg?: string
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl w-full h-max p-[1.3px] overflow-hidden bg-gradient-to-b from-white/20 to-transparent relative',
      )}
    >
      {classNameBg && (
        <div
          className={cn(
            'absolute left-1/2 -top-[30%] -translate-x-1/2 w-full h-[50px] z-10',
            classNameBg,
          )}
        />
      )}
      <div
        className={cn(
          'rounded-2xl w-full h-full pb-5 bg-[#161715] relative overflow-hidden',
          className,
        )}
      >
        {/* Dots pattern background */}
        <div className="w-full h-[155px] overflow-hidden relative [mask-image:radial-gradient(140px_circle_at_center,white,transparent)]">
          <DotBackground />
        </div>
        <div className="w-full h-[155px] overflow-hidden absolute top-0">
          <WatchesIcon className="absolute top-[40%] left-[40%] -rotate-45 animate-delay-pop-0" />
          <WatchesIcon className="absolute top-[12%] right-[8%] -rotate-[80deg] animate-delay-pop-1" />
          <WatchesIcon className="absolute -bottom-[15%] left-[50%] rotate-0 animate-delay-pop-2" />

          <BombIcon className="absolute top-[15%] left-[25%] -rotate-6 animate-delay-pop-3" />
          <BombIcon className="absolute bottom-[0%] left-[10%] rotate-12 animate-delay-pop-4" />
          <BombIcon className="absolute top-[50%] left-[85%] -rotate-12 animate-delay-pop-5" />
        </div>

        {/* Description section */}
        <div>
          <h3 className="mt-2 text-center text-base font-[400]">{title}</h3>
          <p className="mt-1 font-light text-xs text-white/50 text-center leading-3 font-inter tracking-[0.3px]">
            {description}
          </p>
          {subdescription && (
            <p className="font-light text-xs text-white/50 text-center font-inter tracking-[0.3px]">
              {subdescription}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface DotBackgroundProps {
  /** Расстояние между точками в пикселях */
  spacing?: number
  /** Базовый радиус точек */
  baseRadius?: number
  /** Амплитуда изменения радиуса */
  amplitude?: number
  /** Скорость анимации (мс) */
  speed?: number
  /** Центр анимации по горизонтали (0–1) */
  centerXRatio?: number
  /** Центр анимации по вертикали (0–1) */
  centerYRatio?: number
  /** Цвет точек в формате rgba */
  dotColor?: string
}

export default function DotBackground({
  spacing = 16,
  baseRadius = 0.01,
  amplitude = 4,
  speed = 800,
  centerXRatio = 0.5,
  centerYRatio = 0.5,
  dotColor = '182,255,0', // rgb без alpha
}: DotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Настройка DPR для четкости
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const { clientWidth: cw, clientHeight: ch } = canvas
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Инициализация точек
    let points: Array<{ x: number; y: number }> = []
    const initPoints = () => {
      const cols = Math.ceil(canvas.clientWidth / spacing)
      const rows = Math.ceil(canvas.clientHeight / spacing)
      points = []
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          points.push({ x: i * spacing, y: j * spacing })
        }
      }
    }
    initPoints()

    const start = performance.now()
    const animate = (time: number) => {
      const t = (time - start) / speed

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      const cx = canvas.clientWidth * centerXRatio
      const cy = canvas.clientHeight * centerYRatio

      points.forEach((p) => {
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        // Параметр волны от 0 до 1
        const wave = (Math.sin(dist * 0.05 - t) + 1) / 2
        const radius = baseRadius + wave * amplitude
        const alpha = 0.2 + wave * 0.6

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${dotColor},${alpha})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [
    spacing,
    baseRadius,
    amplitude,
    speed,
    centerXRatio,
    centerYRatio,
    dotColor,
  ])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-[#161715]"
    />
  )
}
