import { hapticFeedback } from '@tma.js/sdk'
import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
// import type { Rive } from '@rive-app/react-canvas'
import { cn } from '@/utils'
/* ───────────────── component ──────────────────── */
export function RussianRoulette({
  items,
  userNames,
  winnerIndex,
  isStartRoulette = true,
  duration = 4000,
  loops = 5,
  gap = 300,
  className,
  onFinish,
  onChange,
  // riveAnimation,
}: {
  items: Array<ReactNode>
  userNames: Array<string>
  winnerIndex: number
  isStartRoulette?: boolean // true → крутится
  duration?: number // ≥ 3000 (default 4000)
  loops?: number // min кругов (default 5)
  gap?: number // px между карточками (default 0)
  className?: string
  onFinish?: () => void
  onChange?: () => void
  // riveAnimation?: Rive
}) {
  if (items.length < 4) {
    throw new Error('Roulette needs at least 4 items')
  }
  if (winnerIndex < 0 || winnerIndex >= items.length) {
    throw new Error('winnerIndex out of range')
  }
  if (items.length !== userNames.length) {
    throw new Error('items and userNames must have the same length')
  }

  /* refs / state */
  const onFinishRef = useRef(onFinish)
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  const isStartRouletteRef = useRef(isStartRoulette)
  useEffect(() => {
    isStartRouletteRef.current = isStartRoulette
  }, [isStartRoulette])

  const reelRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<null | { card: number; viewport: number }>(
    null,
  )
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)
  const [stableItems, setStableItems] = useState<Array<ReactNode>>([])
  const [stableWinnerIndex, setStableWinnerIndex] = useState(winnerIndex)
  const itemsCapturedRef = useRef(false)
  const [centeredNameIndex, setCenteredNameIndex] = useState(0)
  const isInitialHapticRun = useRef(true)
  const animationCompletedRef = useRef(false)

  /* 1. измеряем карточку + viewport */
  const measureSizes = () => {
    if (reelRef.current && cardRef.current) {
      const cardWidth = cardRef.current.getBoundingClientRect().width
      const viewportWidth =
        reelRef.current.parentElement!.getBoundingClientRect().width
      if (cardWidth && viewportWidth) {
        setSizes({ card: cardWidth, viewport: viewportWidth })
      }
    }
  }

  useLayoutEffect(() => {
    // We can only measure after the items are rendered.
    if (stableItems.length > 0) {
      measureSizes()
    }
  }, [stableItems])

  // Stabilize items prop in state when the roulette starts
  useEffect(() => {
    // Capture props only once when the roulette starts
    if (isStartRoulette && !itemsCapturedRef.current) {
      setStableItems(items)
      setStableWinnerIndex(winnerIndex)
      itemsCapturedRef.current = true
    } else if (!isStartRoulette) {
      // Reset for the next run
      itemsCapturedRef.current = false
    }
  }, [isStartRoulette, items, winnerIndex])

  /* 2. запуск / сброс анимации */
  useEffect(() => {
    // This effect should not run if the roulette is already finished.
    if (isFinishRoulette) {
      return
    }

    // Resetting the roulette when isStartRoulette becomes false
    if (!isStartRoulette) {
      if (reelRef.current) {
        reelRef.current.style.transition = 'none'
        reelRef.current.style.transform = 'translateX(0)'
      }
      setCenteredNameIndex(0)
      animationCompletedRef.current = false
      // Re-measure sizes on reset, in case window was resized
      measureSizes()
      return
    }

    // Wait until sizes are measured and items are stabilized
    if (!sizes || stableItems.length === 0) {
      return
    }

    const { card, viewport } = sizes
    const step = card + gap
    const totalIdx = loops * stableItems.length + stableWinnerIndex
    const finalOffset = totalIdx * step + card / 2 - viewport / 2

    // Animation variables
    let animationFrameId: number
    let startTime: number | null = null

    // Reset state before starting animation
    setIsFinishRoulette(false)
    animationCompletedRef.current = false

    // Standard easing functions
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const customEase = (t: number) => {
      // This function maps time progress (0 to 1) to distance progress (0 to 1)
      // The slope of this function represents the roulette's speed.

      const p1 = 0.5 // Time for the start of the false stop
      const p2 = 0.65 // Time for the end of the false stop

      const d1 = 0.7 // Distance covered before the false stop
      const d2 = 0.75 // Distance covered after the false stop (a small amount)

      if (t < p1) {
        // Phase 1 & 2: Fast run-up to the false stop
        const t_segment = t / p1
        return easeInOutCubic(t_segment) * d1
      } else if (t < p2) {
        // Phase 3: The "false stop" itself. Very slow movement.
        const t_segment = (t - p1) / (p2 - p1)
        return d1 + easeInOutCubic(t_segment) * (d2 - d1)
      } else {
        // Phase 4 & 5: Re-acceleration and final stop
        const t_segment = (t - p2) / (1 - p2)
        return d2 + easeInOutCubic(t_segment) * (1 - d2)
      }
    }

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
      }
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Calculate position using the custom easing function
      const easedProgress = customEase(progress)
      const currentOffset = easedProgress * finalOffset

      const centeredItemRawIndex =
        (currentOffset + (viewport - card) / 2) / step
      const centeredItemIndex = Math.round(centeredItemRawIndex)
      const newNameIndex = centeredItemIndex % userNames.length

      setCenteredNameIndex(newNameIndex)

      if (reelRef.current) {
        reelRef.current.style.transition = 'none'
        reelRef.current.style.transform = `translateX(-${currentOffset}px)`
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Ensure it lands exactly on the final offset
        if (reelRef.current) {
          reelRef.current.style.transform = `translateX(-${finalOffset}px)`
        }
        setCenteredNameIndex(stableWinnerIndex)
        animationCompletedRef.current = true // Mark as completed
        setIsFinishRoulette(true)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      // Only reset position if the animation was cancelled, not if it finished.
      if (reelRef.current && !animationCompletedRef.current) {
        reelRef.current.style.transition = 'none'
        reelRef.current.style.transform = 'translateX(0)'
      }
    }
  }, [
    sizes,
    isStartRoulette,
    isFinishRoulette,
    loops,
    stableWinnerIndex,
    stableItems,
    gap,
    duration,
    userNames.length,
  ])

  // Haptic feedback on avatar change
  useEffect(() => {
    if (isInitialHapticRun.current) {
      isInitialHapticRun.current = false
      return
    }

    if (isStartRouletteRef.current) {
      onChange?.()
      if (hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.impactOccurred('heavy')
      }
    }
  }, [centeredNameIndex])

  // This effect handles the onFinish callback after the winner card scaling animation
  useEffect(() => {
    const winnerEl = winRef.current

    // if (winnerEl && riveAnimation) {
    //   riveAnimation.play()
    // }

    // We only want to fire onFinish when the scaling animation is complete.
    if (isFinishRoulette && winnerEl) {
      const handleTransitionEnd = (event: TransitionEvent) => {
        // Ensure the event is for the winner element itself, not a child.
        if (event.target === winnerEl) {
          onFinishRef.current?.()
        }
      }

      // Listen for the end of the scaling transition on the winner element
      winnerEl.addEventListener('transitionend', handleTransitionEnd, {
        once: true,
      })

      // Cleanup listener in case the component unmounts before transition ends
      return () => {
        winnerEl.removeEventListener('transitionend', handleTransitionEnd)
      }
    }
  }, [isFinishRoulette])

  /* 3. дублируем массив столько раз, чтобы лента не заканчивалась */
  const { extended, winnerGlobalIdx } = useMemo(() => {
    if (stableItems.length === 0) {
      return { extended: [], winnerGlobalIdx: -1 }
    }

    let copies = loops + 1
    if (sizes) {
      const { card, viewport } = sizes
      const step = card + gap
      const offset =
        loops * stableItems.length * step +
        stableWinnerIndex * step +
        card / 2 -
        viewport / 2
      const chunk = stableItems.length * step
      copies = Math.ceil((offset + viewport) / chunk) + 1
    }
    const ext = Array.from({ length: copies }, () => stableItems).flat()
    const winnerIdx = loops * stableItems.length + stableWinnerIndex
    return { extended: ext, winnerGlobalIdx: winnerIdx }
  }, [sizes, loops, stableItems, stableWinnerIndex, gap])

  const currentUserName = userNames[centeredNameIndex] || ''
  const [firstName, lastName] = currentUserName.split(' ')

  return (
    <div className="flex flex-col items-center gap-15">
      <div className={cn('relative w-full', className)}>
        <div
          ref={reelRef}
          className={cn('inline-flex items-center')}
          style={{ gap, transform: 'translateX(0)' }}
        >
          {extended.map((node, idx) => {
            return (
              <div
                key={idx}
                // className={cn('relative bg-amber-200')}
              >
                <div
                  ref={
                    idx === 0
                      ? cardRef
                      : idx === winnerGlobalIdx
                        ? winRef
                        : undefined
                  }
                  className={cn(
                    isFinishRoulette &&
                      idx === winnerGlobalIdx &&
                      'transition-all duration-300 scale-150 rounded-full shadow-[0_0_60px_rgba(140,53,251,0.6)]',
                  )}
                >
                  {node}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <span
        className={cn('font-pixel text-2xl uppercase text-center', className)}
      >
        {firstName}
        {lastName && <br />}
        {lastName}
      </span>
    </div>
  )
}
