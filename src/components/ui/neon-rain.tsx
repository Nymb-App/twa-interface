import { useEffect, useMemo, useRef } from 'react'

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

  interface RGB {
    r: number
    g: number
    b: number
  }

  const colorStops = useMemo(() => {
    const rgbaPattern = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/

    const toRgb = (value: string): RGB => {
      const match = value.match(rgbaPattern)
      if (!match) {
        throw new Error('Invalid RGBA string')
      }

      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
      }
    }

    const toRgba = ({ r, g, b }: RGB, alpha: number) =>
      `rgba(${r}, ${g}, ${b}, ${alpha})`

    const headCharged = toRgb(gradColorGradient0Value)
    const headNormal = toRgb(gradColorGradient1Value)
    const body = toRgb(gradColorGradient2Value)
    const tail = toRgb(gradColorGradient3Value)

    return {
      headCharged: toRgba(headCharged, 0),
      headNormal: toRgba(headNormal, 0),
      body: toRgba(body, 0.5),
      tail: toRgba(tail, 0),
    }
  }, [
    gradColorGradient0Value,
    gradColorGradient1Value,
    gradColorGradient2Value,
    gradColorGradient3Value,
  ])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Id of the currently scheduled animation frame so we can cancel it on cleanup
  const animationFrameId = useRef<number | null>(null)

  const normalCount = 120 // default 120
  const chargedCountMax = 10
  const chargedSpawnIntervalMs = 1000 // default 1000
  const gradientBucketSize = 10
  const rampDurationMs = 4500
  const minInitialNormalDrops = Math.min(normalCount, 8)
  const minInitialChargedDrops = Math.min(chargedCountMax, 1)

  interface SpawnController {
    timeAccumulator: number
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const nextRandom = (() => {
      let state = (performance.now() * 1_000) >>> 0

      return () => {
        state = (state * 1664525 + 1013904223) >>> 0
        return state / 4294967296
      }
    })()

    const randomRange = (min: number, max: number) =>
      min + nextRandom() * (max - min)

    const randomInt = (min: number, max: number) =>
      Math.floor(randomRange(min, max + 1))

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

    // const resizeCanvas = () => {
    //   // Настройка размера в соответствии с родителем, а не с окном
    //   const parent = canvas.parentElement
    //   if (!parent) return
    //   canvas.width = parent.offsetWidth
    //   canvas.height = parent.offsetHeight
    // }

    // resizeCanvas()
    // window.addEventListener('resize', resizeCanvas)

    const gradientCache = new Map<string, CanvasGradient>()

    class RainDrop {
      public charged: boolean
      public x!: number
      public y!: number
      public length!: number
      public speed!: number
      public alpha!: number
      public width!: number
      private gradient: CanvasGradient | null = null
      private gradientKey = ''
      constructor(charged = false) {
        this.charged = charged
        this.reset()
      }

      reset() {
        if (!canvas) return
        this.x = randomRange(0, canvas.width)
        this.y = randomRange(-canvas.height, 0)
        const rawLength = this.charged
          ? randomRange(60, 260)
          : randomRange(20, 120)
        const lengthBucket = Math.max(
          gradientBucketSize,
          Math.round(rawLength / gradientBucketSize) * gradientBucketSize,
        )
        this.length = lengthBucket
        this.speed = this.charged ? randomRange(20, 35) : randomRange(4, 10)
        this.alpha = 1
        this.width = this.charged ? randomRange(2.5, 4) : randomRange(1, 2.5)
        this.gradient = null
        this.gradientKey = `${this.charged ? 'c' : 'n'}-${lengthBucket}`
      }

      update() {
        this.y += this.speed
      }

      draw(context: CanvasRenderingContext2D) {
        if (!this.gradient) {
          const cachedGradient = gradientCache.get(this.gradientKey)
          if (cachedGradient) {
            this.gradient = cachedGradient
          } else {
            const gradient = context.createLinearGradient(0, 0, 0, this.length)
            gradient.addColorStop(
              0,
              this.charged ? colorStops.headCharged : colorStops.headNormal,
            )
            gradient.addColorStop(0.5, colorStops.body)
            gradient.addColorStop(1, colorStops.tail)
            gradientCache.set(this.gradientKey, gradient)
            this.gradient = gradient
          }
        }

        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        context.lineWidth = this.width
        context.lineCap = 'round'
        context.strokeStyle = this.gradient
        context.moveTo(0, 0)
        context.lineTo(0, this.length)
        context.stroke()
        context.restore()
      }
    }

    const normalDrops: Array<RainDrop> = []
    const activeChargedDrops: Array<RainDrop> = []
    const chargedPool: Array<RainDrop> = []
    const spawnController: SpawnController = {
      timeAccumulator: 0,
    }

    let lastFrameTime = performance.now()
    const startTime = lastFrameTime

    const animate = (time: number) => {
      if (!ctx) return

      // ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = fillStyle
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const elapsed = time - startTime
      const rampProgress = clamp01(elapsed / rampDurationMs)
      const currentNormalTarget = Math.max(
        minInitialNormalDrops,
        Math.round(normalCount * rampProgress),
      )
      while (normalDrops.length < currentNormalTarget) {
        const drop = new RainDrop(false)
        drop.reset()
        normalDrops.push(drop)
      }

      for (const drop of normalDrops) {
        drop.update()
        ctx.save()
        // ctx.globalCompositeOperation = 'lighter'
        drop.draw(ctx)
        ctx.restore()
        if (drop.y > canvas.height) drop.reset()
      }

      const delta = time - lastFrameTime
      spawnController.timeAccumulator += delta
      const rampedChargedLimit = Math.max(
        minInitialChargedDrops,
        Math.round(chargedCountMax * rampProgress),
      )

      if (
        spawnController.timeAccumulator >= chargedSpawnIntervalMs &&
        activeChargedDrops.length < rampedChargedLimit
      ) {
        const newDropCount = Math.max(
          1,
          Math.floor(spawnController.timeAccumulator / chargedSpawnIntervalMs),
        )
        const availableSlots = rampedChargedLimit - activeChargedDrops.length
        const spawnCount = Math.min(
          availableSlots,
          Math.max(1, randomInt(1, newDropCount)),
        )
        for (let i = 0; i < spawnCount; i++) {
          const drop = chargedPool.pop() ?? new RainDrop(true)
          drop.charged = true
          drop.reset()
          activeChargedDrops.push(drop)
        }
        spawnController.timeAccumulator %= chargedSpawnIntervalMs
      }

      for (let i = activeChargedDrops.length - 1; i >= 0; i--) {
        const drop = activeChargedDrops[i]
        drop.update()
        ctx.save()
        // ctx.globalCompositeOperation = 'lighter'
        drop.draw(ctx)
        ctx.restore()
        if (drop.y > canvas.height) {
          const lastIndex = activeChargedDrops.length - 1
          if (i !== lastIndex) {
            activeChargedDrops[i] = activeChargedDrops[lastIndex]
          }
          activeChargedDrops.pop()
          chargedPool.push(drop)
        }
      }

      lastFrameTime = time
      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [
    chargedCountMax,
    chargedSpawnIntervalMs,
    colorStops,
    fillStyle,
    normalCount,
  ])

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
