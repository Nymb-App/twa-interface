import { useMemo, useState } from 'react'
import { HiLockClosed } from 'react-icons/hi2'
import { toast } from 'sonner'
import { GateDrawerContent } from '../gate-page/gate-drawer-content'
import { GateNextDisplayBlock } from '../gate-page/gate-next-display-block'
import { GateProgressDisplay } from '../gate-page/gate-progress-display'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { GateInfoBlockNextLvl } from '../gate-page/ui/info-block'
import { TransferTonButton } from '../transfer-ton-button'
import { ActionButton } from './action-button'
import { Container } from './container'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { BuyIcon } from '@/assets/icons/buy'
import BuyTime from '/buy-time.webp'
import { useAccountMe } from '@/hooks/api/use-account'
import { convertTimestampToLargestUnit } from '@/utils'
import { CloseIcon } from '@/assets/icons/close'
import { useShop } from '@/hooks/api/use-shop'
import { ItemTime } from '../gate-page/ui/item-time'
import { ItemTicket } from '../gate-page/ui/item-ticket'

export const JumpToTheNextGateButton = () => {
  const [buyResource, setBuyResource] = useState('')
  const [isOpenDrawerInfo, setIsOpenDrawerInfo] = useState(false)
  const [isOpenDrawerBuyTime, setIsOpenDrawerBuyTime] = useState(false)
  const [isOpenDrawerBuyTicket, setIsOpenDrawerBuyTicket] = useState(false)

  const { getLvlStats, accountQuery } = useAccountMe()

  const { buyItem } = useShop()

  const currentLvl = useMemo(
    () => getLvlStats.data?.currentLevel ?? 12,
    [getLvlStats],
  )

  const isNextLvlUnlocked = useMemo(
    () => getLvlStats.data?.isNextLvlUnlocked ?? false,
    [getLvlStats],
  )

  const accountData = useMemo(() => accountQuery.data, [accountQuery])

  const nextLvlBenefits = useMemo(() => {
    if (getLvlStats.data?.nextLvlBenefits) {
      return getLvlStats.data.nextLvlBenefits
    }
    return {
      minigameSlidePoints: 2,
      minigameBattleTime: 86400,
      farmingTime: 34920,
      dailyReward: 172800,
      maxEnergy: 1000,
    }
  }, [getLvlStats])

  const year = accountData?.time ?? 0
  const ticket = accountData?.ticket ?? 0

  const yearRequired = useMemo(() => {
    if (getLvlStats.data?.timeRequired) {
      return getLvlStats.data.timeRequired * 1000
    }
    return 1209600000
  }, [getLvlStats])

  const ticketRequired = useMemo(() => {
    if (getLvlStats.data?.ticketsRequired) {
      return getLvlStats.data.ticketsRequired
    }
    return 2
  }, [getLvlStats])

  return (
    <div className="fixed bottom-0 z-50 w-full max-w-[450px] bg-[#121312] pb-12">
      {isNextLvlUnlocked && (
        <Drawer>
          <div className="w-full px-4">
            <DrawerTrigger asChild className="w-full">
              <ActionButton className="font-pixel rounded-[16px] text-[#121312] uppercase">
                <span>jump to the next gate</span>
              </ActionButton>
            </DrawerTrigger>
          </div>
          <GateDrawerContent title="open gate">
            <div className="relative flex justify-evenly pt-[54px] pb-[48px]">
              <FlickeringGrid
                className="absolute top-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
                squareSize={2}
                gridGap={12}
                color="#b7ff01"
                maxOpacity={1}
                flickerChance={0.3}
                autoResize={false}
                width={450}
                height={450}
              />
              <GateProgressDisplay
                icon={<WatchesIcon />}
                current={convertTimestampToLargestUnit(year).time}
                label="years"
                isLockedNewGate={isNextLvlUnlocked}
              />
              <div className="relative">
                <GateNextDisplayBlock
                  className="z-1 border-2 shadow-[0_0_80px_rgba(182,255,0,0.56),_inset_0_0_16px_rgba(182,255,0,0.24)] backdrop-blur-[8px]"
                  isLockedNewGate={isNextLvlUnlocked}
                  currentLevel={currentLvl}
                />
                <HiLockClosed
                  className="absolute bottom-5.5 left-8.5"
                  color="#FFFFFF"
                  fontSize={24}
                />
              </div>
              <GateProgressDisplay
                icon={<TicketIcon />}
                current={ticket}
                label="ticket"
                isLockedNewGate={isNextLvlUnlocked}
              />
            </div>
            <p className="font-inter mb-4 text-[14px] leading-[140%] text-[#FFFFFF]/60">
              After opening gate, you'll get:
            </p>
            <GateInfoBlockNextLvl
              dailyReward={nextLvlBenefits.dailyReward}
              mining={nextLvlBenefits.farmingTime * 1000}
              maxEnergy={nextLvlBenefits.maxEnergy}
              swipePoints={nextLvlBenefits.minigameSlidePoints}
            />
          </GateDrawerContent>
        </Drawer>
      )}
      {!isNextLvlUnlocked && (
        <Drawer open={isOpenDrawerInfo}>
          <Container>
            <DrawerTrigger asChild className="w-full">
              {currentLvl > 1 ? (
                <ActionButton
                  onClick={() => setIsOpenDrawerInfo(true)}
                  className="font-pixel rounded-[16px] bg-gradient-to-b from-[#414241]/100 to-[#363736]/100 text-[#FFFFFF] uppercase drop-shadow-[0px_3px_0px_#232423]"
                >
                  <span>jump to the next gate</span>
                </ActionButton>
              ) : (
                <ActionButton
                  onClick={() =>
                    toast('You archived max', {
                      style: {
                        marginBottom: '40px',
                      },
                    })
                  }
                  className="font-pixel rounded-[16px] bg-gradient-to-b from-[#414241]/100 to-[#363736]/100 text-[#FFFFFF] uppercase drop-shadow-[0px_3px_0px_#232423]"
                >
                  <span>You archived max</span>
                </ActionButton>
              )}
            </DrawerTrigger>
            <GateDrawerContent
              title="gate locked"
              description="You don't have enough resources to open the next gate."
              setIsOpenDrawer={setIsOpenDrawerInfo}
            >
              <div className="mb-8 flex justify-evenly">
                <GateProgressDisplay
                  icon={<WatchesIcon />}
                  current={year}
                  max={yearRequired}
                  label="years"
                />
                <GateProgressDisplay
                  icon={<TicketIcon />}
                  current={ticket}
                  max={ticketRequired}
                  label="ticket"
                />
              </div>
              {/* <ActionButton
                onClick={() => {
                  if (year === 0) {
                    setBuyResource('time')
                    setIsOpenDrawerBuyTime(true)
                  } else {
                    setBuyResource('ticket')
                    setIsOpenDrawerBuyTicket(true)
                  }
                  setIsOpenDrawerInfo(false)
                }}
                className="font-inter h-[48px] w-auto rounded-[16px] bg-[#B6FF00]/8 px-4.5 text-[14px] leading-[140%] text-[#B6FF00]"
              >
                <BuyIcon />
                <span className="ml-3">
                  Buy 1 {year > 0 ? 'Ticket' : 'year'} and open the gate
                </span>
              </ActionButton> */}
            </GateDrawerContent>
            <ItemTime />
          </Container>
        </Drawer>
      )}
      {buyResource === 'time' && <ItemTime />}
      {buyResource === 'ticket' && <ItemTicket />}
    </div>
  )
}
