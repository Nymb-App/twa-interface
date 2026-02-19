import { CloseIcon } from '@/assets/icons/close'
import { LockIcon } from '@/assets/icons/lock'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useAccountMe } from '@/hooks/api/use-account'
import { cn } from '@/lib/utils'
import { convertTimestampToDaysUnit } from '@/utils'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { gateDataStatistics } from '../gate-data-statistics'
import { ItemTicket } from './item-ticket'
import { ItemTime } from './item-time'
import { useTranslation } from 'react-i18next'

export function LvlUpButton({ className }: { className?: string }) {
  const { accountQuery, isLoading, lvlUpMutation } = useAccountMe()

  const accountData = useMemo(() => {
    if (!accountQuery.data) {
      return {
        lvl: 12,
        ticket: 0,
        time: 0,
      }
    }

    const { ticket, time, lvl } = accountQuery.data

    return {
      ticket,
      time,
      lvl,
    }
  }, [accountQuery.data])

  const isTicketsEnough = useMemo(() => {
    // if (!accountData) return false;
    if (!accountData.ticket) return false
    if (!accountData.lvl) return false
    if (accountData.ticket === 0) return false
    if (accountData.lvl === 1) return false
    return (
      accountData.ticket >=
      gateDataStatistics[String(accountData.lvl - 1)].ticketsRequired
    )
  }, [accountData, accountData.ticket, accountData.lvl])

  const isTimeEnough = useMemo(() => {
    if (!accountData.time) return false
    if (accountData.time * 1000 <= Date.now()) return false
    if (accountData.lvl === 1) return false
    return (
      convertTimestampToDaysUnit(accountData.time - Date.now() / 1000) >=
      gateDataStatistics[String(accountData.lvl - 1)].timeRequired
    )
  }, [accountData.time, accountData.lvl])

  const requirements = useMemo(() => {
    if (!accountData.lvl) return gateDataStatistics['11']

    return gateDataStatistics[String(accountData.lvl - 1)]
  }, [accountData])

  if (accountData.lvl === 1 || isLoading) {
    return (
      <div className="opacity-60 cursor-not-allowed fixed text-center bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[450px] font-pixel text-white text-xl py-4 border-b-4 border-[#232423] bg-gradient-to-b from-[#414241] to-[#363736] rounded-2xl outline-none">
        {isLoading ? 'Loading...' : 'You are on the first gate'}
      </div>
    )
  }
  if (isTicketsEnough && isTimeEnough) {
    return (
      <LvlUpButtonWithNextGateNavigation
        onClick={() => lvlUpMutation.mutate()}
        ticketAmount={requirements.ticketsRequired}
        timeAmount={requirements.timeRequired}
        lvl={accountData.lvl}
        className={className}
      />
    )
  } else {
    return (
      <LvlUpButtonWithShop
        ticketAmount={accountData.ticket}
        timeAmount={convertTimestampToDaysUnit(
          accountData.time - Date.now() / 1000,
        )}
        lvl={accountData.lvl}
        className={className}
      />
    )
  }
}

function LvlUpButtonWithShop({
  ticketAmount = 0,
  timeAmount = 0,
  lvl = 12,
  className,
}: {
  ticketAmount?: number
  timeAmount?: number
  lvl?: number
  className?: string
}) {
  const { t } = useTranslation()
  const isTicketsEnough = useMemo(() => {
    if (!ticketAmount) return false
    if (ticketAmount === 0) return false
    return ticketAmount >= gateDataStatistics[String(lvl - 1)].ticketsRequired
  }, [ticketAmount, lvl])

  // const isTimeEnough = useMemo(() => {
  //   console.log(timeAmount, 'timeAmount?')
  //   if (!timeAmount) return false
  //   if (timeAmount * 1000 <= Date.now()) return false // FIX: баг тут!!!

  //   // Получаем количество лет
  //   const time = parseFloat(((timeAmount / 86400) * 365).toFixed(2))
  //   return time >= 1
  // }, [timeAmount, lvl])

  const nextLvl = useMemo(() => {
    return lvl - 1 > 0 ? lvl - 1 : 1
  }, [lvl])

  const allowedTickets = useMemo(() => {
    return gateDataStatistics[String(nextLvl)].ticketsRequired
  }, [nextLvl])

  const allowedTime = useMemo(() => {
    return gateDataStatistics[String(nextLvl)].timeRequired
  }, [nextLvl])

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[450px] font-pixel text-white text-xl py-4 border-b-4 border-[#232423] bg-gradient-to-b from-[#414241] to-[#363736] rounded-2xl cursor-pointer outline-none',
          className,
        )}
      >
        {t('gate.jump-next')}
      </DrawerTrigger>

      <DrawerContent className="bg-[#161714] rounded-t-[32px]! border-t-2 border-[#2f302e] pt-3">
        <DrawerClose className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer">
          <CloseIcon />
        </DrawerClose>
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-pixel text-white text-2xl">
            {t('gate.locked.title')}
          </DrawerTitle>
          <DrawerDescription className="text-white/60 font-inter text-sm">
            {t('gate.locked.description.line1')}
            <br />
            {t('gate.locked.description.line2')}
          </DrawerDescription>
        </DrawerHeader>
        <div className="relative inline-flex justify-around items-center w-full mt-6 font-pixel text-white px-0 sm:px-10">
          <div className="flex flex-col gap-1 justify-center items-center">
            <img src="/clock-img.webp" className="size-10" />
            <span className="text-2xl">
              {timeAmount}
              <span className="text-white/40 font-inter"> / </span>
              {allowedTime}
            </span>
            <span className="text-white/40 text-xs">
              {t('gate.units.days')}
            </span>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <img src="/ticket-img.webp" className="size-10" />
            <span className="text-2xl">
              {ticketAmount > 99 ? '99+' : ticketAmount}
              <span className="text-white/40 font-inter"> / </span>
              {allowedTickets}
            </span>
            <span className="text-white/40 text-xs">
              {t('gate.units.tickets')}
            </span>
          </div>
        </div>

        <div className="mt-8 w-full inline-flex justify-center">
          {!isTicketsEnough ? <ItemTicket /> : <ItemTime />}
          {/* {!isTicketsEnough && <ItemTicket />} */}
        </div>

        <DrawerFooter className="relative mt-6 mb-4">
          <DrawerClose className="w-full py-4 font-pixel text-black text-xl bg-gradient-to-b from-white to-[#999999] rounded-2xl cursor-pointer">
            {t('common.close')}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function LvlUpButtonWithNextGateNavigation({
  className,
  lvl,
  timeAmount = 0,
  ticketAmount = 0,
  onClick,
}: {
  className?: string
  lvl?: number
  timeAmount?: number
  ticketAmount?: number
  onClick?: () => void
}) {
  const { t } = useTranslation()
  const nextLvl = useMemo(() => {
    if (!lvl) return 11
    return lvl - 1 > 0 ? lvl - 1 : 1
  }, [lvl])

  const statistics = useMemo(() => {
    return gateDataStatistics[String(nextLvl)]
  }, [nextLvl])

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          'fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[450px] font-pixel text-black text-xl py-4 bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] rounded-2xl cursor-pointer outline-none',
          className,
        )}
      >
        {t('gate.jump-next')}
      </DrawerTrigger>

      <DrawerContent className="bg-[#161714] !rounded-t-[32px] border-t-2 border-[#2f302e] pt-3">
        <FlickeringGrid
          className="absolute -top-14 left-0 size-full mask-[radial-gradient(ellipse_200px_150px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.9}
          flickerChance={0.3}
          autoResize={false}
        />
        <DrawerClose className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px] cursor-pointer">
          <CloseIcon />
        </DrawerClose>
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-pixel text-white text-2xl">
            {t('gate.open.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="relative inline-flex justify-around items-center w-full mt-6 font-pixel text-white px-0 sm:px-10">
          <div className="flex flex-col gap-1 justify-center items-center w-[80px]">
            <img src="/clock-img.webp" className="size-10" />
            <span className="text-2xl">{timeAmount}</span>
            <span className="text-base">{t('gate.units.days')}</span>
          </div>

          <div className="relative flex flex-col gap-1 justify-center items-center rounded-4xl size-[88px] outline-2 outline-[#B6FF00] bg-[#161816] shadow-[0_0_80px_#B6FF00]/60">
            <span
              className={cn(
                'text-3xl text-[#B6FF00]',
                (nextLvl === 11 || nextLvl === 10 || nextLvl === 1) && 'mr-3.5',
              )}
            >
              {nextLvl}
            </span>
            <LockIcon
              fillOpacity={1}
              className="absolute -bottom-3 h-[26px] w-[20px]"
            />
          </div>

          <div className="flex flex-col gap-1 justify-center items-center w-[80px]">
            <img src="/ticket-img.webp" className="size-10" />
            <span className="text-2xl">
              {ticketAmount > 99 ? '99+' : ticketAmount}
            </span>
            <span className="text-base">{t('gate.units.tickets')}</span>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-white/60 text-center text-sm">
            {t('gate.open.after')}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-6 px-4">
            <div className="w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4 backdrop-blur-[2px]">
              <div className="inline-flex gap-1 justify-center items-baseline">
                <span className="text-2xl text-[#B6FF00]">
                  {statistics.dailyReward}
                </span>
                <span className="text-sm text-white/40">
                  {t('gate.units.days')}
                </span>
              </div>

              <span className="text-white text-sm font-inter">
                {t('gate.rewards.daily')}
              </span>
            </div>

            <div className="w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4 backdrop-blur-[2px]">
              <div className="inline-flex gap-1 justify-center items-baseline">
                <span className="text-2xl text-[#B6FF00]">
                  {statistics.mining}
                </span>
                <span className="text-sm text-white/40">
                  {t('gate.units.hours')}
                </span>
              </div>

              <span className="text-white text-sm font-inter">
                {t('gate.rewards.farming')}
              </span>
            </div>

            <div className="w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4 backdrop-blur-[2px]">
              <div className="inline-flex gap-1 justify-center items-baseline">
                <span className="text-2xl text-[#B6FF00]">
                  {statistics.maxEnergy}
                </span>
              </div>

              <span className="text-white text-sm font-inter">
                {t('gate.rewards.max-energy')}
              </span>
            </div>

            <div className="w-full flex flex-col gap-1 justify-center items-center font-pixel bg-gradient-to-b from-white/0 to-white/5 rounded-2xl p-4 backdrop-blur-[2px]">
              <div className="inline-flex gap-1 justify-center items-baseline">
                <span className="text-2xl text-[#B6FF00]">
                  {statistics.points}
                </span>
                <span className="text-sm text-white/40">
                  {t('gate.units.minutes')}
                </span>
              </div>

              <span className="text-white text-sm font-inter">
                {t('gate.rewards.in-swap')}
              </span>
            </div>
          </div>
        </div>
        <DrawerFooter className="relative mt-6 mb-4">
          <Link
            to={'/unlock-gate'}
            search={{ nextLvl }}
            onClick={onClick}
            className="w-full py-4 font-pixel text-black text-xl bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] rounded-2xl cursor-pointer text-center"
          >
            {t('gate.go-to', { lvl: nextLvl })}
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
