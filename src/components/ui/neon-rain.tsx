import { useEffect, useRef } from 'react'

export const NeonRain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      // Настройка размера в соответствии с родителем, а не с окном
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const normalCount = 200
    const chargedCountMax = 10

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
          ? 120 + Math.random() * 200
          : 60 + Math.random() * 100
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
            ? `rgba(255,255,255, ${this.alpha})`
            : `rgba(180,120,255, ${this.alpha})`,
        )
        // grad.addColorStop(0.5, `rgba(116,29,227, ${this.alpha * 0.5})`)
        // grad.addColorStop(1, `rgba(74,29,227, 0)`)

        grad.addColorStop(1, `rgba(116,29,227, ${this.alpha * 0.5})`)
        grad.addColorStop(0, `rgba(74,29,227, 0)`)

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
      ctx.fillStyle = 'rgba(0, 0, 30, 0.2)'
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
      window.removeEventListener('resize', resizeCanvas)
      clearInterval(interval)
    }
  }, [])

  return (
    <canvas
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
