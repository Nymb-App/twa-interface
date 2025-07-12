import Countdown from 'react-countdown'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/utils'

export const CountdownStartGame = ({
  onComplete,
}: {
  onComplete?: () => void
}) => {
  const [isOnCompleteTimer, setIsCompleteTimer] = useState(false)

  const countdownDate = useMemo(() => {
    return Date.now() + 4000
  }, [])

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        isOnCompleteTimer && 'opacity-0',
      )}
    >
      <Countdown
        date={countdownDate}
        intervalDelay={1000}
        precision={0}
        renderer={({ seconds }) => (
          <span
            key={seconds}
            className={cn(
              'font-pixel text-[7.5rem] text-[#B6FF00] [text-shadow:0px_0px_100px_rgba(182,255,0,0.6)] animate-[number-change_0.5s_ease-out]',
              seconds === 2 && 'mr-12',
              seconds === 1 && 'ml-12',
            )}
          >
            {seconds > 1 ? seconds - 1 : 'GO!'}
          </span>
        )}
        onComplete={() => {
          onComplete?.()
          setIsCompleteTimer(true)
        }}
      />
      <AnimatedCanvas
        initialDotCount={1200}
        initialDotSpeed={1}
        initialDotSize={0.6}
        initialVerticalAmplitude={1}
      />
    </div>
  )
}

const AnimatedCanvas = ({
  initialDotCount = 300,
  initialDotSpeed = 1,
  initialDotSize = 2,
  initialVerticalAmplitude = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [dotCount] = useState(initialDotCount)
  const [dotSpeed] = useState(initialDotSpeed)
  const [dotSize] = useState(initialDotSize)
  const [verticalAmplitude] = useState(initialVerticalAmplitude)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerHeight
    canvas.height = window.innerWidth

    class Dot {
      public color: string
      public x = 0
      public y = 0
      public alpha = 1
      public baseSpeed = 1
      public angle = 0

      constructor(color: string) {
        this.color = color
        this.reset()
      }

      reset() {
        if (!canvas) return
        const centerY = canvas.height / 2
        const distanceFromCenter =
          (Math.pow(Math.random(), 2) * canvas.height) / 2
        this.y =
          this.color === '#B6FF00'
            ? centerY - distanceFromCenter
            : centerY + distanceFromCenter
        this.x = Math.random() * canvas.width
        this.alpha = 1
        this.baseSpeed = Math.random() * 0.5 + 0.5
        this.angle = Math.random() * Math.PI * 2
      }

      draw() {
        if (!canvas) return
        if (!ctx) return
        const centerY = canvas.height / 2
        const distToCenter = Math.abs(this.y - centerY)
        const maxDist = canvas.height / 2
        const sizeFactor = 1 + (1 - distToCenter / maxDist) * 2

        ctx.beginPath()
        ctx.arc(this.x, this.y, dotSize * sizeFactor, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }

      update() {
        if (!canvas) return
        const centerY = canvas.height / 2
        this.y +=
          this.color === '#B6FF00'
            ? this.baseSpeed * dotSpeed
            : -this.baseSpeed * dotSpeed

        const distToCenter = Math.abs(this.y - centerY)
        if (distToCenter < 100) {
          this.baseSpeed *= 0.98
          this.alpha -= 0.02
        }

        if (
          this.alpha <= 0 ||
          (this.color === '#B6FF00' && this.y > centerY) ||
          (this.color === '#8C35FB' && this.y < centerY)
        ) {
          this.reset()
        }

        this.angle += 0.1 * dotSpeed
        this.x += Math.sin(this.angle) * verticalAmplitude

        if (this.x < 0) this.x = 0
        if (this.x > canvas.width) this.x = canvas.width
      }
    }

    let dots: Array<Dot> = []
    const createDots = (count: number) => {
      dots = []
      for (let i = 0; i < count / 2; i++) {
        dots.push(new Dot('#B6FF00'))
        dots.push(new Dot('#8C35FB'))
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.fillStyle = '#03061a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      dots.forEach((dot) => {
        dot.update()
        dot.draw()
      })

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createDots(dotCount)
    }

    createDots(dotCount)
    animate()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dotCount, dotSpeed, dotSize, verticalAmplitude])

  return (
    <div className="absolute top-0 w-full h-full z-[-1]">
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 -translate-x-1/2 h-full rotate-180"
      />
      <div className="absolute inset-0 w-full h-[60%] bg-[#03061a] mask-[linear-gradient(to_top,_black_0%,_black_60%,transparent_70%)]" />
      <div className="absolute bottom-0 w-full h-[60%] bg-[#03061a] mask-[linear-gradient(to_bottom,_black_0%,_black_60%,transparent_70%)]" />
    </div>
  )
}
