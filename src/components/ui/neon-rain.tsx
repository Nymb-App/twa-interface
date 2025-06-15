import { useEffect, useRef } from 'react'

export const NeonRain = ({
  gradColorGradient0 = 'rgba(255,255,255,1)',
  gradColorGradient1 = 'rgba(180,120,255,1)',
  gradColorGradient2 = 'rgba(116,29,227,1)',
  gradColorGradient3 = 'rgba(74,29,227,0)',
  className,
  fillStyle = 'rgba(0, 0, 30, 0.2)',
}: {
  className?: string
  fillStyle?: string
  gradColorGradient0?: string
  gradColorGradient1?: string
  gradColorGradient2?: string
  gradColorGradient3?: string
}) => {
  const gradColorGradient0Value = gradColorGradient0.trim()
  const gradColorGradient1Value = gradColorGradient1.trim()
  const gradColorGradient2Value = gradColorGradient2.trim()
  const gradColorGradient3Value = gradColorGradient3.trim()

  function addAlpha(rgba: string, alpha: number): string {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)

    if (!match) {
      throw new Error('Invalid RGBA string')
    }

    const [, r, g, b] = match
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const normalCount = 120
  const chargedCountMax = 10

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // const resizeCanvas = () => {
    //   // Настройка размера в соответствии с родителем, а не с окном
    //   const parent = canvas.parentElement
    //   if (!parent) return
    //   canvas.width = parent.offsetWidth
    //   canvas.height = parent.offsetHeight
    // }

    // resizeCanvas()
    // window.addEventListener('resize', resizeCanvas)

    class RainDrop {
      public charged: boolean
      public x!: number
      public y!: number
      public length!: number
      public speed!: number
      public alpha!: number
      public width!: number
      constructor(charged = false) {
        this.charged = charged
        this.reset()
      }

      reset() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * -canvas.height
        this.length = this.charged
          ? 60 + Math.random() * 200
          : 20 + Math.random() * 100
        this.speed = this.charged
          ? 20 + Math.random() * 15
          : 4 + Math.random() * 6
        this.alpha = 1
        this.width = this.charged
          ? 2.5 + Math.random() * 1.5
          : 1 + Math.random() * 1.5
      }

      update() {
        this.y += this.speed
      }

      draw(context: CanvasRenderingContext2D) {
        const grad = context.createLinearGradient(
          this.x,
          this.y,
          this.x,
          this.y + this.length,
        )
        grad.addColorStop(
          0,
          this.charged
            ? addAlpha(gradColorGradient0Value, 0)
            : addAlpha(gradColorGradient1Value, 0),
        )

        grad.addColorStop(
          0.5,
          addAlpha(gradColorGradient2Value, this.alpha * 0.5),
        )
        grad.addColorStop(1, addAlpha(gradColorGradient3Value, 0))
        grad.addColorStop(
          1,
          addAlpha(gradColorGradient2Value, this.alpha * 0.5),
        )
        grad.addColorStop(1, addAlpha(gradColorGradient3Value, 0))

        context.beginPath()
        context.strokeStyle = grad
        context.lineWidth = this.width
        context.moveTo(this.x, this.y)
        context.lineTo(this.x, this.y + this.length)
        context.stroke()
      }
    }

    const normalDrops = Array.from(
      { length: normalCount },
      () => new RainDrop(false),
    )
    const chargedDrops: Array<RainDrop> = []

    const spawnChargedParticles = () => {
      const availableSlots = chargedCountMax - chargedDrops.length
      if (availableSlots <= 0) return

      const count = Math.floor(Math.random() * (availableSlots + 1))
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (chargedDrops.length < chargedCountMax) {
            chargedDrops.push(new RainDrop(true))
          }
        }, Math.random() * 100)
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.fillStyle = fillStyle
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const drop of normalDrops) {
        drop.update()
        drop.draw(ctx)
        if (drop.y > canvas.height) drop.reset()
      }

      for (let i = chargedDrops.length - 1; i >= 0; i--) {
        chargedDrops[i].update()
        chargedDrops[i].draw(ctx)
        if (chargedDrops[i].y > canvas.height) chargedDrops.splice(i, 1)
      }

      requestAnimationFrame(animate)
    }

    const interval = setInterval(spawnChargedParticles, 1000)
    animate()

    return () => {
      // window.removeEventListener('resize', resizeCanvas)
      clearInterval(interval)
    }
  }, [])

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    ></canvas>
  )
}
