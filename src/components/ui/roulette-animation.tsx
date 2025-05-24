import { useEffect, useState } from 'react'

import RoulettePro from 'react-roulette-pro'
import 'react-roulette-pro/dist/index.css'
import { Button } from './button'

type TUser = {
  image: string
  username: string
}

const prizes: Array<TUser> | any = [
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
  {
    image: '/roulette-icons/user-3.png',
    username: 'Koshka Koshkina',
  },
]

const winPrizeIndex = 3

const repeatItems = (arr: Array<TUser>, times: number) => {
  const repeated = []
  for (let i = 0; i < times; i++) {
    repeated.push(...arr.map((item) => ({ ...item })))
  }
  return repeated
}

const repeatedPrizes = repeatItems(prizes, 25) // больше повторений — меньше шансов увидеть пустоту

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`

const prizeList = repeatedPrizes.map((prize) => ({
  ...prize,
  id:
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : generateId(),
}))

export const RouletteAnimation = ({
  isStartRoulette,
  setIsStartRoulette,
  setIsShowSendButton,
}: {
  isStartRoulette: boolean
  setIsStartRoulette: (value: boolean) => void
  setIsShowSendButton: (value: boolean) => void
}) => {
  const [currentCandidate, _] = useState('')
  const [isStart, setIsStart] = useState(false)
  const [isFinish, setIsFinish] = useState(false)

  const prizeIndex = prizes.length * 10 + winPrizeIndex // смещённый индекс выигрыша

  useEffect(() => {
    setIsShowSendButton(false)
    const timer = setTimeout(() => {
      setIsStart(isStartRoulette)
    }, 3000)
    return () => clearTimeout(timer)
  }, [isStartRoulette])

  const handlePrizeDefined = () => {
    setIsFinish(true)
    console.log('🥳 Prize defined! 🥳')
  }

  return (
    <div className="flex flex-col items-center">
      <RoulettePro
        prizes={prizeList}
        prizeIndex={prizeIndex}
        start={isStart}
        onPrizeDefined={handlePrizeDefined}
        options={{ stopInCenter: true }}
        defaultDesignOptions={{ hideCenterDelimiter: true }}
        prizeItemRenderFunction={(prize: any) => {
          return (
            <div className="relative font-pixel font-[400] uppercase flex flex-col items-center roulette-pro-regular-prize-item">
              <img
                src={prize.image}
                alt={prize.username}
                className="w-[92px] h-[92px] rounded-full object-cover"
              />
              <span className="absolute top-[25px] leading-[38px] tracking-[0.42px] text-[27px]">
                {prize.username.slice(0, 2)}
              </span>
            </div>
          )
        }}
      />
      <div className="mt-6">{currentCandidate || ''}</div>
      {isFinish && (
        <Button
          onClick={() => {
            setIsStartRoulette(false)
            setIsShowSendButton(true)
          }}
        >
          Close
        </Button>
      )}
    </div>
  )
}
