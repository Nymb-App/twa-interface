import { useContext, useState } from 'react'
import { HiLockClosed } from 'react-icons/hi2'
import { GateDrawerContent } from '../gate-page/gate-drawer-content'
import {
  GateNextDisplayBlock,
  GateProgressDisplay,
} from '../gate-page/gate-header'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { GateStatisticsInfoBlock } from '../gate-page/gate-statistics-section'
import { ActionButton } from './action-button'
import { Container } from './container'
import { Drawer, DrawerTrigger } from './drawer'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { BuyIcon } from '@/assets/icons/buy'
import BuyTime from '/buy-time.png'
import { GateContext } from '@/context/gate-context'
import { ArrowIcon } from '@/assets/icons/arrow'

export const JumpToTheNextGateButton = () => {
  const [buyResource, setBuyResource] = useState('')
  const [isOpenDrawerInfo, setIsOpenDrawerInfo] = useState(false)
  const [isOpenDrawerBuyTime, setIsOpenDrawerBuyTime] = useState(false)
  const [isOpenDrawerBuyTicket, setIsOpenDrawerBuyTicket] = useState(false)
  const { year, ticket, isLockedNewGate, currentLevel } =
    useContext(GateContext)

  return (
    <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 bg-[#121312]">
      {isLockedNewGate && (
        <Drawer>
          <Container>
            <DrawerTrigger asChild className="w-full">
              <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
                <span>jump to the next gate</span>
              </ActionButton>
            </DrawerTrigger>
            <GateDrawerContent title="open gate">
              <div className="relative flex justify-evenly pt-[54px] pb-[48px]">
                <FlickeringGrid
                  className="absolute top-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
                  squareSize={2}
                  gridGap={12}
                  color="#b7ff01"
                  maxOpacity={0.5}
                  flickerChance={0.3}
                  autoResize={false}
                  width={450}
                  height={450}
                />
                <GateProgressDisplay
                  icon={<WatchesIcon />}
                  current={year || 0}
                  max={1}
                  label="years"
                  isLockedNewGate={isLockedNewGate}
                />
                <div className="relative">
                  <div className="absolute -top-[35px] left-[50px] rotate-90">
                    <ArrowIcon className="absolute -top-[3px] left-0 text-[#B6FF00] w-[15px] h-[15px] animate-bounce-gate-arrow" />
                  </div>
                  <GateNextDisplayBlock
                    className="z-1 border-2 backdrop-blur-[8px] shadow-[0_0_80px_rgba(182,255,0,0.56),_inset_0_0_16px_rgba(182,255,0,0.24)]"
                    isLockedNewGate={isLockedNewGate}
                    currentLevel={currentLevel}
                  />
                  <HiLockClosed
                    className="absolute bottom-5.5 left-8.5"
                    color="#FFFFFF"
                    fontSize={24}
                  />
                </div>
                <GateProgressDisplay
                  icon={<TicketIcon />}
                  current={ticket || 0}
                  max={1}
                  label="ticket"
                  isLockedNewGate={isLockedNewGate}
                />
              </div>
              <p className="text-[#FFFFFF]/60 font-inter text-[14px] leading-[140%] mb-4">
                After opening gate, you'll get:
              </p>
              <div className="grid grid-cols-2 gap-3 font-pixel">
                <GateStatisticsInfoBlock
                  value={2}
                  description="Daily reward"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
                >
                  <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
                    days
                  </span>
                </GateStatisticsInfoBlock>
                <GateStatisticsInfoBlock
                  value={8}
                  description="Mining"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
                >
                  <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
                    hours
                  </span>
                </GateStatisticsInfoBlock>
                <GateStatisticsInfoBlock
                  value={1200}
                  description="Max Energy"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00] mr-3"
                />
                <GateStatisticsInfoBlock
                  value={4}
                  description="In Swipe"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
                >
                  <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
                    point
                  </span>
                </GateStatisticsInfoBlock>
              </div>
            </GateDrawerContent>
          </Container>
        </Drawer>
      )}
      {!isLockedNewGate && (
        <Drawer open={isOpenDrawerInfo}>
          <Container>
            <DrawerTrigger asChild className="w-full">
              <ActionButton
                onClick={() => setIsOpenDrawerInfo(true)}
                className="drop-shadow-[0px_3px_0px_#232423] font-pixel text-[#FFFFFF] rounded-[16px] uppercase bg-gradient-to-b from-[#414241]/100 to-[#363736]/100"
              >
                <span>jump to the next gate</span>
              </ActionButton>
            </DrawerTrigger>
            <GateDrawerContent
              title="gate locked"
              description="You don't have enough resources to open the next gate."
              setIsOpenDrawer={setIsOpenDrawerInfo}
            >
              <div className="flex justify-evenly mb-8">
                <GateProgressDisplay
                  icon={<WatchesIcon />}
                  current={year || 0}
                  max={1}
                  label="years"
                />
                <GateProgressDisplay
                  icon={<TicketIcon />}
                  current={ticket || 0}
                  max={1}
                  label="ticket"
                />
              </div>
              <ActionButton
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
                className="h-[48px] text-[14px] font-inter leading-[140%] text-[#B6FF00] w-auto rounded-[16px] bg-[#B6FF00]/8 px-4.5"
              >
                <BuyIcon />
                <span className="ml-3">
                  Buy 1 {year > 0 ? 'Ticket' : 'year'} and open the gate
                </span>
              </ActionButton>
            </GateDrawerContent>
          </Container>
        </Drawer>
      )}
      {buyResource === 'time' && (
        <Drawer open={isOpenDrawerBuyTime}>
          <Container>
            <GateDrawerContent
              title="buy time"
              description="Get what you want right now"
              setIsOpenDrawer={setIsOpenDrawerBuyTime}
            >
              <GateDrawerBuyResource resource={buyResource} imgUrl={BuyTime} />
            </GateDrawerContent>
          </Container>
        </Drawer>
      )}
      {buyResource === 'ticket' && (
        <Drawer open={isOpenDrawerBuyTicket}>
          <Container>
            <GateDrawerContent
              title="buy time"
              description="Get what you want right now"
              setIsOpenDrawer={setIsOpenDrawerBuyTicket}
            >
              <GateDrawerBuyResource resource={buyResource} />
            </GateDrawerContent>
          </Container>
        </Drawer>
      )}
    </div>
  )
}

function GateDrawerBuyResource({
  resource,
  imgUrl,
}: {
  resource: string
  imgUrl?: string
}) {
  return (
    <div>
      <div className="relative flex justify-center mb-8">
        {resource === 'time' ? (
          <img
            src={imgUrl}
            alt={`${resource}-image`}
            width={154}
            height={166}
          />
        ) : (
          <TicketIcon className="w-[154px] h-[166px]" />
        )}
        <FlickeringGrid
          className="absolute inset-0 z-[-1] mask-[radial-gradient(ellipse_180px_120px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={250}
        />
      </div>
      <div className="flex justify-evenly items-center font-pixel font-[400] text-[white] uppercase">
        <div>
          <p className="text-[#B6FF00] text-[30px] leading-[120%] [text-shadow:_0px_4.00224px_8.00448px_rgba(182,_255,_0,_0.3),_0px_0px_24.0134px_#B6FF00]">
            {resource === 'time' ? (
              <span>01</span>
            ) : (
              <span className="mr-3">1</span>
            )}
          </p>
          {resource === 'ticket' ? (
            <span className="text-[#FFFFFF]/40 text-[16px] leading-[20px]">
              ticket
            </span>
          ) : (
            <span className="text-[#FFFFFF]/40 text-[16px] leading-[20px]">
              years
            </span>
          )}
        </div>
        <span className="text-[48px] text-[#FFFFFF]/40">:</span>
        <div>
          <p className="text-[30px] leading-[120%]">2</p>
          <span className="text-[#FFFFFF]/40 text-[16px] leading-[20px]">
            ton
          </span>
        </div>
      </div>
    </div>
  )
}
