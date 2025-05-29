// components/PrizeRoulette.tsx  — winner-zoom edition
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRive } from '@rive-app/react-canvas'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ElectricLines } from './electric-lines'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/utils'
import { AppContext } from '@/context/app-context'
import { SendGift } from '@/assets/icons/send-gift'

/* ──────────────────── props ───────────────────── */
export interface PrizeRouletteProps {
  items: Array<ReactNode>
  winnerIndex: number // 0-based
  isStartRoulette?: boolean // true → крутится
  duration?: number // ≥ 3000 (default 4000)
  loops?: number // min кругов (default 5)
  gap?: number // px между карточками (default 0)
  winnerScale?: number // во сколько увеличить победителя (default 1.4)
  className?: string
  onFinish?: () => void
  setIsShowSendGiftButton?: (value: boolean) => void // для управления кнопкой отправки подарка
  isShowSendGiftActionButtons?: boolean // для управления кнопкой отправки подарка
  setIsShowSendGiftActionButtons?: (value: boolean) => void // для управления кнопкой отправки подарка
}

/* ───────────────── component ──────────────────── */
export function RussianRoulette({
  items,
  winnerIndex,
  isStartRoulette = true,
  duration = 4000,
  loops = 5,
  gap = 0,
  winnerScale = 1.8,
  className,
  onFinish,
  setIsShowSendGiftButton,
  isShowSendGiftActionButtons,
  setIsShowSendGiftActionButtons,
}: PrizeRouletteProps) {
  if (items.length < 4) throw new Error('Roulette needs at least 4 items')
  if (winnerIndex < 0 || winnerIndex >= items.length)
    throw new Error('winnerIndex out of range')
  if (duration < 3000) duration = 3000
  if (loops < 1) loops = 1

  /* refs / state */
  const reelRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null) // 1-я карточка
  const winRef = useRef<HTMLDivElement>(null) // финальная карточка
  const started = useRef(false) // чтобы не стартовать 2×
  const [sizes, setSizes] = useState<null | { card: number; viewport: number }>(
    null,
  )
  const [isFinishRoulette, setIsFinishRoulette] = useState(false)
  const { giftCountValue, giftPeriodRadioValue } = useContext(AppContext)
  const [isWinner, setIsWinner] = useState(false)
  const [startRiveAnimation, setStartRiveAnimation] = useState(false)
  const [placeholderRiveAnimation, setPlaceholderRiveAnimation] = useState(true)

  /* 1. измеряем карточку + viewport */
  useLayoutEffect(() => {
    if (!reelRef.current || !cardRef.current) return

    setIsShowSendGiftButton?.(false)

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
  }, [])

  /* 2. запуск / сброс анимации */
  useEffect(() => {
    if (!sizes) return
    const { card, viewport } = sizes
    const step = card + gap
    const reel = reelRef.current!

    /* стоп - если isStartRoulette = false */
    // if (isStartRoulette) {
    if (!isStartRoulette) {
      reel.style.transition = 'none'
      reel.style.transform = 'translateX(0)'
      winRef.current?.classList.remove('roulette-winner')
      started.current = false
      return
    }
    if (started.current) return // уже запущено

    const totalIdx = loops * items.length + winnerIndex
    const offset = totalIdx * step + card / 2 - viewport / 2

    // reel.style.transition = 'none'
    // reel.style.transform = 'translateX(0)'

    /* запуск на след. кадре */
    if (!isFinishRoulette) {
      requestAnimationFrame(() => {
        reel.style.transition = `transform ${duration}ms cubic-bezier(.1,.8,.2,1)`
        reel.style.transform = `translateX(-${offset}px)`
        started.current = false
      })
    }

    const done = () => {
      started.current = false
      /* выделяем победителя */
      winRef.current?.classList.add('roulette-winner')
      setIsFinishRoulette(true)
      // setTimeout(() => {
      //   setIsShowSendGiftActionButtons?.(true)
      // }, 4500)
      onFinish?.()
      setIsWinner(true)
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
  ])

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
    winnerGlobalIdx = loops * items.length + winnerIndex // индекс в «loops»-копии
  }
  const extended = Array.from({ length: copies }, () => items).flat()

  const { RiveComponent, rive } = useRive({
    src: '/riveAnimations/gift-freinds.riv',
    autoplay: true,
    onLoad: () => {
      // setStartRiveAnimation(true)
    },
    onPlay: () => {
      // setTimeout(() => {
      //   setStartRiveAnimation(true)
      //   setPlaceholderRiveAnimation(false)
      // }, 2000)
    },
    // onStateChange: () => {
    //   rive?.stop()
    // },
    onStop: () => {
      setStartRiveAnimation(false)
      setIsShowSendGiftActionButtons?.(true)
    },
  })

  useEffect(() => {
    rive?.pause()
  }, [startRiveAnimation])

  useEffect(() => {
    rive?.play()
  }, [isFinishRoulette])

  useEffect(() => {
    if (!rive) return
    const interval = setInterval(() => {
      if (rive.activeArtboard) {
        setStartRiveAnimation(true)
        setPlaceholderRiveAnimation(false)
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [rive])

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center relative">
        <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase mb-[230px]">
          send a gift <br />
          for frend
        </h1>
        {isShowSendGiftActionButtons && (
          <div className="font-pixel font-400 text-center -mt-[20px] absolute top-[145px]">
            <span className="text-[64px] leading-[120%] [text-shadow:0px_0px_60px_#A55EFF] bg-gradient-to-b from-[#BE8CFF] to-[#8C35FB] bg-clip-text text-transparent">
              {giftCountValue}
            </span>
            <p className="text-[20px] leading-[24px] mt-2 uppercase">
              {giftPeriodRadioValue} gets
            </p>
          </div>
        )}
        {isShowSendGiftActionButtons && <ElectricLines />}
        {/* {!startRiveAnimation && (
          <SendGift className="-mt-[20px] absolute top-[145px] animate-[wiggle_3s_ease-in-out_infinite] z-1" />
        )}
        {startRiveAnimation && !isShowSendGiftActionButtons && (
          <RiveComponent className="w-[460px] h-[460px] absolute -top-[45px] z-0" />
        )} */}
        {/* {!startRiveAnimation && ( */}
        <SendGift
          className={cn(
            '-mt-[20px] absolute top-[145px] animate-[wiggle_3s_ease-in-out_infinite] z-1',
            !placeholderRiveAnimation && 'hidden',
          )}
        />
        {/* <SendGift className="-mt-[20px] top-[145px] z-1 absolute animate-[wiggle_3s_ease-in-out_infinite] send-gift-rive-icon" /> */}
        {/* )} */}
        {/* {!isShowSendGiftActionButtons && ( */}
        <RiveComponent
          className={cn(
            'w-[499px] h-[499px] absolute -top-[42px] -left-[150px] z-1 transform rotate-18',
            !startRiveAnimation && 'hidden',
            !rive?.isPlaying &&
              !isWinner &&
              'animate-[wiggle_3s_ease-in-out_infinite]',
          )}
        />
        {/* // #8C35FB // #B6FE01 */}
        {/* )} */}
        <FlickeringGrid
          className="absolute top-0 w-[450px] h-[445px]
      mask-[radial-gradient(ellipse_215px_215px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#aa73f9"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={450}
        />
      </div>
      {/* {!isFinishRoulette ? (
        <div className="flex flex-col items-center relative">
          <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase mb-[270px]">
            send a gift <br />
            for frend
          </h1>
          <SendGift className="-mt-[20px] animate-[wiggle_3s_ease-in-out_infinite] absolute top-[145px] z-1" />
          <FlickeringGrid
            className="absolute top-0 w-[450px] h-[445px]
      mask-[radial-gradient(ellipse_215px_215px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#aa73f9"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
            width={450}
            height={450}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center relative">
          <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase mb-[230px]">
            send a gift <br />
            for frend
          </h1>
          <div className="font-pixel font-400 text-center -mt-[20px] absolute top-[145px]">
            <span className="text-[64px] leading-[120%] [text-shadow:0px_0px_60px_#A55EFF] bg-gradient-to-b from-[#BE8CFF] to-[#8C35FB] bg-clip-text text-transparent">
              {giftCountValue}
            </span>
            <p className="text-[20px] leading-[24px] mt-2 uppercase">
              {giftPeriodRadioValue} gets
            </p>
          </div>
          {isShowSendGiftActionButtons && <ElectricLines />}
          <FlickeringGrid
            className="absolute top-0 w-[450px] h-[445px]
      mask-[radial-gradient(ellipse_215px_215px_at_center,black,transparent)]"
            squareSize={2}
            gridGap={12}
            color="#aa73f9"
            maxOpacity={1}
            flickerChance={0.3}
            autoResize={false}
            width={450}
            height={450}
          />
        </div>
      )} */}
      <div
        className={cn(
          'relative w-full mt-[40px]',
          isWinner && 'mr-[2090px]',
          className,
        )}
        style={{ '--gap': `${gap}px` } as CSSProperties}
      >
        <div
          ref={reelRef}
          className={cn('flex items-center', isWinner && '!gap-[75px]')}
          style={{ gap, transform: 'translateX(0)' }}
        >
          {extended.map((node, i) => {
            return (
              <div>
                <div
                  key={i}
                  ref={
                    i === 0
                      ? cardRef
                      : i === winnerGlobalIdx
                        ? winRef
                        : undefined
                  }
                  className="shrink-0 flex justify-center items-center"
                >
                  {node}
                </div>
              </div>
            )
          })}
        </div>

        {/* Левая тень */}
        <div
          className={cn(
            'pointer-events-none absolute top-0 left-0 w-[100px] h-full bg-gradient-to-r from-[#151317] to-transparent',
            // isWinner && 'some-block w-[5000px]',
          )}
        />

        {/* Правая тень */}
        <div
          className={cn(
            'pointer-events-none absolute top-0 right-0 w-[100px] h-full bg-gradient-to-l from-[#151317] via-transparent to-transparent',
            // isWinner && 'w-[2000px] left-[1280px]',
          )}
        />

        {/* локальный CSS */}
        <style>
          {`
                    .roulette-winner {
                        transform: scale(${winnerScale});
                        transition: transform 1.5s ease-in-out;
                    }
                `}
        </style>
      </div>
      <div className="font-pixel text-[24px] leading-[32px] mt-[54px] font-[400] uppercase text-center">
        {/* Innaus <br />
        Masinko */}
        <UserNamesRotator users={users} delay={4500 / 4} />
      </div>
    </div>
  )
}

const users = ['Innaus Masinko', 'Alex Johnson', 'Maria Petrova', 'John Smith']

interface UserNamesRotatorProps {
  users: Array<string>
  delay?: number // задержка в мс между сменами (по умолчанию 1000)
}

export function UserNamesRotator({
  users,
  delay = 1000,
}: UserNamesRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (users.length === 0) return

    if (currentIndex >= users.length - 1) return // стоп на последнем элементе

    const timeoutId = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [currentIndex, users, delay])

  return (
    <div className="font-pixel text-[24px] leading-[32px] mt-2 font-[400] uppercase text-center">
      <span>
        {users[currentIndex].split(' ')[0]}
        <br />
        {users[currentIndex].split(' ')[1]}
      </span>
    </div>
  )
}
