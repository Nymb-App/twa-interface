import { isAndroid } from 'react-device-detect'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BattleCard } from './battle-card'
import { GameCard } from './game-card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from './ui/drawer'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'
import { Card } from '@/components/ui/card'
import { TasksIcon } from '@/assets/icons/tasks'
import { StatisticsIcon } from '@/assets/icons/statistics'
import { SocialIcon } from '@/assets/icons/social'
import { SwipeCard } from '@/components/swipe-card'
import { cn } from '@/lib/utils'
import { useAccountMe } from '@/hooks/api/use-account'

export function HeroSection() {
  return (
    <section className="relative mt-48 text-2xl text-white px-3">
      <h2 className="font-pixel text-center animate-slide-up-fade-0">
        WHAT AWAITS YOU
      </h2>

      <div className="flex flex-col gap-4">
        {/* <Link to="/onboarding">onboarding</Link> */}
        <Link to="/home">home</Link>
      </div>

      <StarsCard className="mt-10 animate-slide-up-fade-0" />

      <div className="inline-flex justify-between gap-2 w-full mt-3 animate-slide-up-fade-1">
        <SwipeCardDrawer />
        <BattleCardDrawer />
      </div>
      <div className="inline-flex w-full gap-2 mt-2 animate-slide-up-fade-2">
        <TasksCardDrawer />
        <ReferralsCardDrawer />
        <StarBoardCardDrawer />
      </div>
    </section>
  )
}

function SwipeCardDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const savedScrollY = useRef(0)
  const savedHash = useRef<string>('')

  // 1) На маунте один раз убираем хеш, если он есть
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      savedHash.current = window.location.hash // если нужно — можно потом вернуть
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  const openDrawer = useCallback(() => {
    // 2) Перед открытием ещё раз гарантированно убираем хеш (если вдруг появился)
    if (window.location.hash) {
      savedHash.current = window.location.hash
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    // 3) Лочим скролл без дёрганья (фиксируем body)
    savedScrollY.current = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    // 4) Возвращаем body и скролл на прежнее место
    const body = document.body
    const top = body.style.top
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, Math.abs(parseInt(top || '0', 10)))

    setIsOpen(false)
  }, [])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(v) => (v ? openDrawer() : closeDrawer())}
    >
      <DrawerTrigger className="w-full cursor-pointer">
        {isAndroid ? (
          <SwipeCard
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
          />
        ) : (
          <GameCard
            delay={1000}
            placeholderSrc="/lottie-placeholder/minigames/slide.webp"
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
            animationData={'/lottie/swipe2.json'}
          />
        )}
      </DrawerTrigger>
      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none"
        />
        <img
          src="/index-page/swipes-intro.png"
          alt="Swipe Card Top"
          className="absolute top-0 left-1/2 mt-10 -translate-x-1/2 w-full max-w-[280px] h-auto select-none pointer-events-none"
        />

        <div className="p-4">
          <h3 className="font-pixel text-3xl text-white text-center">SWIPES</h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Swipe every day to build your time bank.
            <br />
            Skip bombs, grab multipliers, win big!
          </p>
        </div>
        <DrawerFooter className="w-full px-5 mb-3">
          <DrawerClose className="cursor-pointer font-pixel text-black text-lg w-full px-8 py-4 bg-gradient-to-b from-white to-[#999999] rounded-2xl">
            CLOSE
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function BattleCardDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const savedScrollY = useRef(0)
  const savedHash = useRef<string>('')

  // 1) На маунте один раз убираем хеш, если он есть
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      savedHash.current = window.location.hash // если нужно — можно потом вернуть
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  const openDrawer = useCallback(() => {
    // 2) Перед открытием ещё раз гарантированно убираем хеш (если вдруг появился)
    if (window.location.hash) {
      savedHash.current = window.location.hash
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    // 3) Лочим скролл без дёрганья (фиксируем body)
    savedScrollY.current = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    // 4) Возвращаем body и скролл на прежнее место
    const body = document.body
    const top = body.style.top
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, Math.abs(parseInt(top || '0', 10)))

    setIsOpen(false)
  }, [])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(v) => (v ? openDrawer() : closeDrawer())}
    >
      <DrawerTrigger className="w-full cursor-pointer">
        <BattleCard
          className="w-full"
          classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
          title="Battle"
          description="are you strong"
          subdescription="enough?"
        />
      </DrawerTrigger>
      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none"
        />
        <img
          src="/index-page/battle-intro.png"
          alt="Battle Card Top"
          className="absolute top-0 left-1/2 mt-10 mix-blend-lighten -translate-x-1/2 w-full max-w-[330px] h-auto select-none pointer-events-none"
        />

        <div className="p-4">
          <h3 className="font-pixel text-3xl text-white text-center">BATTLE</h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Fight against other players!
            <br />
            Bet time, win big, take it all
          </p>
        </div>
        <DrawerFooter className="w-full px-5 mb-3">
          <DrawerClose className="cursor-pointer font-pixel text-black text-lg w-full px-8 py-4 bg-gradient-to-b from-white to-[#999999] rounded-2xl">
            CLOSE
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function TasksCardDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const savedScrollY = useRef(0)
  const savedHash = useRef<string>('')

  // 1) На маунте один раз убираем хеш, если он есть
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      savedHash.current = window.location.hash // если нужно — можно потом вернуть
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  const openDrawer = useCallback(() => {
    // 2) Перед открытием ещё раз гарантированно убираем хеш (если вдруг появился)
    if (window.location.hash) {
      savedHash.current = window.location.hash
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    // 3) Лочим скролл без дёрганья (фиксируем body)
    savedScrollY.current = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    // 4) Возвращаем body и скролл на прежнее место
    const body = document.body
    const top = body.style.top
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, Math.abs(parseInt(top || '0', 10)))

    setIsOpen(false)
  }, [])
  return (
    <Drawer
      open={isOpen}
      onOpenChange={(v) => (v ? openDrawer() : closeDrawer())}
    >
      <DrawerTrigger className="w-full cursor-pointer">
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <TasksIcon className="size-8" />
            <span className="text-xs text-white/60">Tasks</span>
          </div>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none"
        />
        <img
          src="/index-page/tasks-intro.png"
          alt="Battle Card Top"
          className="absolute top-0 left-1/2 -translate-x-1/2 mt-5 w-full max-w-[300px] h-auto select-none pointer-events-none"
        />

        <div className="p-4">
          <h3 className="font-pixel text-3xl text-white text-center">TASKS</h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Complete daily and special tasks.
            <br />
            Earn time and unlock unique rewards!
          </p>
        </div>
        <DrawerFooter className="w-full px-5 mb-3">
          <DrawerClose className="cursor-pointer font-pixel text-black text-lg w-full px-8 py-4 bg-gradient-to-b from-white to-[#999999] rounded-2xl">
            CLOSE
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ReferralsCardDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const savedScrollY = useRef(0)
  const savedHash = useRef<string>('')

  // 1) На маунте один раз убираем хеш, если он есть
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      savedHash.current = window.location.hash // если нужно — можно потом вернуть
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  const openDrawer = useCallback(() => {
    // 2) Перед открытием ещё раз гарантированно убираем хеш (если вдруг появился)
    if (window.location.hash) {
      savedHash.current = window.location.hash
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    // 3) Лочим скролл без дёрганья (фиксируем body)
    savedScrollY.current = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    // 4) Возвращаем body и скролл на прежнее место
    const body = document.body
    const top = body.style.top
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, Math.abs(parseInt(top || '0', 10)))

    setIsOpen(false)
  }, [])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(v) => (v ? openDrawer() : closeDrawer())}
    >
      <DrawerTrigger className="w-full cursor-pointer">
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <SocialIcon className="size-8" />
            <span className="text-xs text-white/60">Referrals</span>
          </div>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none"
        />
        <img
          src="/index-page/referrals-intro.png"
          alt="Battle Card Top"
          className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 w-full max-w-[280px] h-auto select-none pointer-events-none"
        />

        <div className="p-4">
          <h3 className="font-pixel text-3xl text-white text-center">
            REFERRALS
          </h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Get paid for every friend you invite
            <br />
            and every friend they bring!
          </p>
        </div>
        <DrawerFooter className="w-full px-5 mb-3">
          <DrawerClose className="cursor-pointer font-pixel text-black text-lg w-full px-8 py-4 bg-gradient-to-b from-white to-[#999999] rounded-2xl">
            CLOSE
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function StarBoardCardDrawer() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const savedScrollY = useRef(0)
  const savedHash = useRef<string>('')

  // 1) На маунте один раз убираем хеш, если он есть
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) {
      savedHash.current = window.location.hash // если нужно — можно потом вернуть
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
  }, [])

  const openDrawer = useCallback(() => {
    // 2) Перед открытием ещё раз гарантированно убираем хеш (если вдруг появился)
    if (window.location.hash) {
      savedHash.current = window.location.hash
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    // 3) Лочим скролл без дёрганья (фиксируем body)
    savedScrollY.current = window.scrollY
    const body = document.body
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    // 4) Возвращаем body и скролл на прежнее место
    const body = document.body
    const top = body.style.top
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, Math.abs(parseInt(top || '0', 10)))

    setIsOpen(false)
  }, [])

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(v) => (v ? openDrawer() : closeDrawer())}
    >
      <DrawerTrigger className="w-full cursor-pointer">
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <StatisticsIcon className="size-8" />
            <span className="text-xs text-white/60">Star Board</span>
          </div>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute top-3 right-3 bg-[#1D1F1D] size-8 rounded-full flex justify-center items-center cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.29289 0.292893C8.68342 -0.0976311 9.31643 -0.0976311 9.70696 0.292893C10.0975 0.683417 10.0975 1.31643 9.70696 1.70696L6.41399 4.99992L9.70696 8.29289L9.77532 8.36907C10.0957 8.76184 10.0731 9.34084 9.70696 9.70696C9.34084 10.0731 8.76184 10.0957 8.36907 9.77532L8.29289 9.70696L4.99992 6.41399L1.70696 9.70696L1.63078 9.77532C1.23801 10.0957 0.659009 10.0731 0.292893 9.70696C-0.0732229 9.34084 -0.0958169 8.76184 0.224534 8.36907L0.292893 8.29289L3.58586 4.99992L0.292893 1.70696C-0.097631 1.31643 -0.097631 0.683417 0.292893 0.292893C0.683417 -0.097631 1.31643 -0.097631 1.70696 0.292893L4.99992 3.58586L8.29289 0.292893Z"
              fill="white"
            />
          </svg>
        </DrawerClose>

        <img
          src="/index-page/dotted-pattern.png"
          alt="Dotted Pattern"
          className="w-full h-auto select-none pointer-events-none"
        />
        <img
          src="/index-page/stars-board.png"
          alt="Battle Card Top"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full mt-10 max-w-[600px] h-auto select-none pointer-events-none"
        />

        <div className="p-4">
          <h3 className="font-pixel text-3xl text-white text-center">
            STAR BOARD
          </h3>
          <p className="text-white/60 font-inter text-sm text-center mt-2">
            Multiple leaderboards, multiple chances to shine.
            <br />
            Find your place among the stars!
          </p>
        </div>
        <DrawerFooter className="w-full px-5 mb-3">
          <DrawerClose className="cursor-pointer font-pixel text-black text-lg w-full px-8 py-4 bg-gradient-to-b from-white to-[#999999] rounded-2xl">
            CLOSE
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function StarsCard({ className }: { className?: string }) {
  const { tasksQuery } = useTasks()
  const { accountQuery } = useAccountMe()

  const isCompletedTaskTwitter = useMemo(() => {
    return tasksQuery.data?.some(
      (task) => task.name === TaskNames.SubscribeTwitter && task.isCompleted,
    )
  }, [tasksQuery.data])

  const isSubscribedTelegram = useMemo(() => {
    return accountQuery.data?.isSubscribed
  }, [accountQuery])

  return (
    <div
      className={cn(
        'w-full p-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-2xl',
        className,
      )}
    >
      <div className='flex flex-col items-center relative w-full rounded-2xl bg-[url("/index-page/stars-bg.png"),linear-gradient(#161715,#161715)] bg-cover bg-top px-4 pb-5'>
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 inline-flex h-[88px] w-full justify-center">
          <img
            src="/index-page/star-left.png"
            alt="Stars"
            className="w-20 h-full object-cover mt-3"
          />
          <img
            src="/index-page/star-center.png"
            alt="Stars"
            className="w-[92px] h-full object-cover"
          />
          <img
            src="/index-page/star-right.png"
            alt="Stars"
            className="w-[78px] h-full object-cover mt-4"
          />
        </div>

        <span className="text-[54px] font-pixel mt-14 text-[#FFD930] [text-shadow:0px_3.65px_63.05px_#FFD13D]">
          1,000,000
        </span>

        <p className="text-center text-white font-pixel text-lg uppercase mt-1">
          Stars Giveaway
        </p>
        <p className="text-center text-xs text-white/40 font-inter font-light">
          The giveaway is happening at launch.
        </p>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3.5 inline-flex h-[88px] w-[86%] justify-between">
          <img
            src="/index-page/star-bottom-left.png"
            alt="Stars"
            className="w-[82px] h-full object-cover"
          />
          <img
            src="/index-page/star-bottom-right.png"
            alt="Stars"
            className="w-[82px] h-full object-cover"
          />
        </div>
        {isCompletedTaskTwitter && isSubscribedTelegram ? (
          <p className="relative top-[-10px] uppercase text-[#FFD930] text-sm font-pixel mt-9">
            already joined
          </p>
        ) : (
          <a
            href="#join-giveaway"
            className="relative text-black bg-gradient-to-b from-[#FFD930] to-[#FFDE4D] px-7 py-2.5 rounded-xl font-pixel text-sm mt-4 transition-transform duration-200 cursor-pointer"
          >
            JOIN US
          </a>
        )}
      </div>
    </div>
  )
}
