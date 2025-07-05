import { useEffect, useRef } from 'react'
import { cn } from '@/utils'

interface IBattleResultGameBgProps {
  className?: string
  countBase?: number
  baseSpeed?: number
  minLen?: number
  maxLen?: number
  segLen?: number
  startCurveY?: number
  bendPower?: number
  glowBlurBig?: number
  glowBlurThin?: number
  glowColor?: string
  gradColor1?: string
  gradColor2?: string
  gradColor3?: string
}

export const BattleResultGameBg = ({
  className,
  countBase = 150,
  baseSpeed = 350,
  minLen = 120,
  maxLen = 300,
  segLen = 18,
  startCurveY = 0.4,
  bendPower = 800,
  glowBlurBig = 24,
  glowBlurThin = 12,
  glowColor = '#F84CD8',
  gradColor1 = 'rgba(186,190,255,0)',
  gradColor2 = '#4C55F4',
  gradColor3 = '#F84CD8',
}: IBattleResultGameBgProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return

    const COUNT_BASE = countBase
    const BASE_SPEED = baseSpeed
    const MIN_LEN = minLen
    const MAX_LEN = maxLen
    const SEG_LEN = segLen
    const START_CURVE_Y = startCurveY
    const BEND_POWER = bendPower

    const GLOW_BLUR_BIG = glowBlurBig
    const GLOW_BLUR_THIN = glowBlurThin
    const GLOW_COLOR = glowColor

    let W: number, H: number, dpr: number
    const drops: Array<Drop> = []
    let animationFrameId: number

    class Drop {
      public x0 = 0
      public y = 0
      public len = 0
      public segs = 0
      public speed = 0
      public skip = true
      constructor() {
        this.reset()
      }
      reset() {
        this.x0 = Math.random() * W
        this.y = -Math.random() * H - MAX_LEN
        this.len = MIN_LEN + Math.random() * (MAX_LEN - MIN_LEN)
        this.segs = Math.ceil(this.len / SEG_LEN)
        this.speed = BASE_SPEED * (0.9 + Math.random() * 0.3)
        this.skip = true
      }
      update(dt: number) {
        if (this.skip) {
          this.skip = false
          return
        }
        this.y += this.speed * dt
        const top = this.y - this.len
        if (top > H + 50 || this.x0 < -this.len || this.x0 > W + this.len)
          this.reset()
      }
      calcX(yVal: number) {
        const curveY = H * START_CURVE_Y
        if (yVal <= curveY) return this.x0
        const t = (yVal - curveY) / (H - curveY)
        const rel = (this.x0 - W / 2) / (W / 2)
        return this.x0 + t * t * BEND_POWER * Math.abs(rel) * Math.sign(rel)
      }
      buildPath() {
        const path = new Path2D()
        for (let i = 0; i < this.segs; i++) {
          const yTop = this.y - i * SEG_LEN
          const yBot = yTop - SEG_LEN
          if (yBot < 0) break
          path.moveTo(this.calcX(yBot) / dpr, yBot / dpr)
          path.lineTo(this.calcX(yTop) / dpr, yTop / dpr)
        }
        return path
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cvs.width = window.innerWidth * dpr
      H = cvs.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops.length = 0
      makeDrops()
    }

    const makeDrops = () => {
      const areaRatio = ((W / dpr) * H) / dpr / (1920 * 1080)
      const target = Math.round(areaRatio * COUNT_BASE)
      while (drops.length < target) drops.push(new Drop())
      while (drops.length > target) drops.pop()
    }

    let last = performance.now()
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now

      ctx.clearRect(0, 0, W, H)

      // Step 1: Update state and build paths once
      const activePaths: Array<{ path: Path2D; drop: Drop }> = []
      drops.forEach((d) => {
        d.update(dt)
        if (!d.skip) {
          activePaths.push({ path: d.buildPath(), drop: d })
        }
      })

      // Step 2: Batch 1 - Draw all glows
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineWidth = 2
      ctx.strokeStyle = 'transparent'
      ctx.shadowBlur = GLOW_BLUR_BIG
      ctx.shadowColor = GLOW_COLOR
      ctx.globalAlpha = 0.9
      activePaths.forEach(({ path }) => {
        ctx.stroke(path)
      })
      ctx.restore()

      // Step 3: Batch 2 - Draw all gradients
      ctx.lineCap = 'round'
      ctx.lineWidth = 4
      ctx.shadowBlur = GLOW_BLUR_THIN
      ctx.shadowColor = GLOW_COLOR
      ctx.globalAlpha = 1
      activePaths.forEach(({ path, drop }) => {
        const grad = ctx.createLinearGradient(
          0,
          (drop.y - drop.len) / dpr,
          0,
          drop.y / dpr,
        )
        grad.addColorStop(0, gradColor1)
        grad.addColorStop(0.6, gradColor2)
        grad.addColorStop(1, gradColor3)
        ctx.strokeStyle = grad
        ctx.stroke(path)
      })

      animationFrameId = requestAnimationFrame(loop)
    }

    resize()
    loop(last)

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    baseSpeed,
    bendPower,
    countBase,
    glowBlurBig,
    glowBlurThin,
    glowColor,
    gradColor1,
    gradColor2,
    gradColor3,
    maxLen,
    minLen,
    segLen,
    startCurveY,
  ])

  return (
    <canvas
      className={cn('block w-full h-full bg-[#110522]', className)}
      ref={canvasRef}
    />
  )
}
