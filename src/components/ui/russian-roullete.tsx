import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/utils';
/* ───────────────── component ──────────────────── */
export function RussianRoulette({
  items,
  winnerIndex,
  isStartRoulette = true,
  duration = 4000,
  loops = 5,
  gap = 300,
  className,
  onFinish,
}: {
  items: Array<ReactNode>
  winnerIndex: number
  isStartRoulette?: boolean // true → крутится
  duration?: number // ≥ 3000 (default 4000)
  loops?: number // min кругов (default 5)
  gap?: number // px между карточками (default 0)
  className?: string
  onFinish?: () => void
}) {
  if (items.length < 4) {
    throw new Error('Roulette needs at least 4 items');
  } 
  if (winnerIndex < 0 || winnerIndex >= items.length) {
    throw new Error('winnerIndex out of range');
  }

  /* refs / state */
  const reelRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const [sizes, setSizes] = useState<null | { card: number; viewport: number }>(
    null,
  )
  const [isFinishRoulette, setIsFinishRoulette] = useState(false);

  /* 1. измеряем карточку + viewport */
  useLayoutEffect(() => {
    if (!reelRef.current || !cardRef.current) {
      return;
    }

    const measure = () => {
      const card = cardRef.current!.getBoundingClientRect().width // без gap
      const viewport =
        reelRef.current!.parentElement!.getBoundingClientRect().width
      if (card && viewport) setSizes({ card, viewport })
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(cardRef.current)
    ro.observe(reelRef.current.parentElement!)
    return () => ro.disconnect()
  }, []);

  /* 2. запуск / сброс анимации */
  useEffect(() => {
    if (!sizes) return
    const { card, viewport } = sizes
    const step = card + gap
    const reel = reelRef.current!

    if (!isStartRoulette) {
      reel.style.transition = 'none'
      reel.style.transform = 'translateX(0)'
      started.current = false
      
      return;
    }
    if (started.current) {
      return;
    }

    const totalIdx = loops * items.length + winnerIndex
    const offset = totalIdx * step + card / 2 - viewport / 2

    /* запуск на след. кадре */
    if (!isFinishRoulette) {
      requestAnimationFrame(() => {
        reel.style.transition = `transform ${duration}ms cubic-bezier(.1,.8,.2,1)`
        reel.style.transform = `translateX(-${offset}px)`
        started.current = false
      })
    }

    const done = () => {
      started.current = false;
      setIsFinishRoulette(true);
      onFinish?.();
    }
    reel.addEventListener('transitionend', done, { once: true })
    return () => reel.removeEventListener('transitionend', done)
  }, [
    sizes,
    isStartRoulette,
    loops,
    winnerIndex,
    items.length,
    gap,
    duration,
    onFinish,
  ]);

  /* 3. дублируем массив столько раз, чтобы лента не заканчивалась */
  let copies = loops + 1
  let winnerGlobalIdx = loops * items.length + winnerIndex // по умолчанию
  if (sizes) {
    const { card, viewport } = sizes
    const step = card + gap
    const offset =
      loops * items.length * step + winnerIndex * step + card / 2 - viewport / 2
    const chunk = items.length * step
    copies = Math.ceil((offset + viewport) / chunk) + 1
    winnerGlobalIdx = loops * items.length + winnerIndex
  }
  const extended = Array.from({ length: copies }, () => items).flat()

  return (
    <div className="flex flex-col items-center gap-15">
      <div
        className={cn(
          'relative w-full',
          className,
        )}
      >
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
                className={cn(isFinishRoulette && idx === winnerGlobalIdx && 'transition-transform duration-300 scale-150 rounded-full shadow-[0_0_60px_rgba(140,53,251,0.6)]')}
              >
                {node}
              </div>
              </div>
            )
          })}
        </div>
      </div>

      <UserNamesRotator
        users={users}
        delay={100}
      />
    </div>
  );
}

const users = ['Innaus Masinko', 'Alex Johnson', 'Maria Petrova', 'John Smith']

export function UserNamesRotator({
  users,
  delay = 1000,
  className,
}: {
  users: string[],
  delay?: number,
  className?: string
}) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (
      users.length === 0 ||
      users.length === 1 ||
      currentIndex >= users.length - 1
    ) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
    }, delay)

    return () => clearTimeout(timeoutId);
  }, [currentIndex, users, delay]);

  return (
    <span className={cn("font-pixel text-2xl uppercase text-center", className)}>
      {users[currentIndex].split(' ')[0]}
      <br />
      {users[currentIndex].split(' ')[1]}
    </span>
  )
}
