import { useContext, useEffect, useRef, useState } from 'react'

import RoulettePro from 'react-roulette-pro'
import 'react-roulette-pro/dist/index.css'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ElectricLines } from './electric-lines'
import { SendGift } from '@/assets/icons/send-gift'
import { cn } from '@/utils'
import { AppContext } from '@/context/app-context'

type TUser = {
  image: string
  username: string
}

const prizes: Array<TUser> | any = [
  {
    image: '/roulette-icons/user-1.png',
    username: 'Koshka Koshkina',
  },
  {
    image: '/roulette-icons/user-1.png',
    username: 'Ivan Ivanov',
  },
  {
    image: '/roulette-icons/user-2.png',
    username: 'Bogdan Bogdanov',
  },
  {
    image: '/roulette-icons/user-3.png',
    username: 'Mark Markov',
  },
]

// const repeatItems = (arr: Array<TUser>, times: number) => {
//   const repeated = []
//   for (let i = 0; i < times; i++) {
//     repeated.push(...arr.map((item) => ({ ...item })))
//   }
//   return repeated
// }

// const repeatedPrizes = repeatItems(prizes, 25) // больше повторений — меньше шансов увидеть пустоту
// console.log(repeatedPrizes)

const N = prizes.length

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill('_')
    .map(() => array[Math.floor(Math.random() * array.length)]),
]

// Создаем расширенный массив с блоками исходных призов
const reproducedPrizeList = [
  ...prizes,
  ...reproductionArray(prizes, N * 3),
  ...prizes,
  ...reproductionArray(prizes, N * 4),
]

// Вычисляем индекс победителя в расширенном массиве
const desiredWinnerIndex = 0 // Индекс в исходном массиве
const middleBlockStart = N + 3 * N // 4N
const winPrizeIndex = middleBlockStart + desiredWinnerIndex // 4N + 0 = 4N

// Генерируем уникальные ID для элементов
const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`

const prizeList = reproducedPrizeList.map((prize) => ({
  ...prize,
  id:
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : generateId(),
}))
console.log(prizeList[winPrizeIndex])

export const RouletteAnimation = ({
  isStartRoulette,
  isShowSendGiftActionButtons,
  setIsShowSendGiftButton,
  setIsShowSendGiftActionButtons,
}: {
  isStartRoulette: boolean
  isShowSendGiftActionButtons: boolean
  setIsShowSendGiftButton: (value: boolean) => void
  setIsShowSendGiftActionButtons: (value: boolean) => void
}) => {
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const { giftCountValue, giftPeriodRadioValue } = useContext(AppContext)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    setIsShowSendGiftButton(false)
    const timer = setTimeout(() => {
      setIsStart(isStartRoulette)
    }, 1500)
    return () => clearTimeout(timer)
  }, [isStartRoulette])

  const handlePrizeDefined = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsFinish(true)
    timerRef.current = setTimeout(() => {
      setIsShowSendGiftActionButtons(true)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center">
      {!isFinish ? (
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
      )}
      <div>
        <RoulettePro
          prizes={prizeList}
          prizeIndex={winPrizeIndex}
          start={isStart}
          onPrizeDefined={handlePrizeDefined}
          spinningTime={10}
          options={{ stopInCenter: true }}
          defaultDesignOptions={{
            hideCenterDelimiter: true,
          }}
          prizeItemRenderFunction={(prize: any) => {
            return (
              <div
                className={cn(
                  'font-pixel font-[400] uppercase flex flex-col justify-center items-center',
                  isFinish && 'h-[160px]',
                )}
              >
                <img
                  src={prize.image}
                  alt={prize.username}
                  className={cn('w-[86px] h-[86px] rounded-full object-cover')}
                />
                {/* <span
                  className={cn(
                    'absolute top-[20px] leading-[38px] tracking-[0.42px] text-[27px]',
                    isFinish && 'top-[58px]',
                  )}
                >
                  {isFinish &&
                  prize.username === winner.username &&
                  prize.image === winner.image
                    ? prize.username.slice(0, 2)
                    : prize.username.slice(0, 2)}
                </span> */}
              </div>
            )
          }}
        />
        {/* <div className="pointer-events-none absolute top-[285px] z-10 left-0 h-[190px] w-17 bg-gradient-to-l from-[#121312] to-transparent" /> */}
        {/* <div className="pointer-events-none absolute top-[285px] z-2 right-0 h-[190px] w-17 bg-gradient-to-l from-[#121312] to-transparent" /> */}
      </div>
      <div className="font-pixel text-[24px] ledaing-[32px] mt-6 font-[400] uppercase text-center">
        Innaus
        <br />
        Masinko
      </div>
    </div>
  )
}
