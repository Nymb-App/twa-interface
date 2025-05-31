import { useState } from 'react'
import { GateDrawerContent } from '../gate-page/gate-drawer-content'
import { GateProgressDisplay } from '../gate-page/gate-header'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ActionButton } from './action-button'
import { Drawer, DrawerTrigger } from './drawer'
import { Container } from './container'
import { WatchesIcon } from '@/assets/icons/watches'
import { TicketIcon } from '@/assets/icons/ticket'
import { BuyIcon } from '@/assets/icons/buy'
import BuyTime from '/buy-time.png'

export const JumpToTheNextLockedGateButton = () => {
  const year = 0
  const ticket = 0
  return (
    <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 bg-[#121312]">
      <Drawer>
        <Container>
          <DrawerTrigger className="w-full">
            <ActionButton className="drop-shadow-[0px_3px_0px_#232423] font-pixel text-[#FFFFFF] rounded-[16px] uppercase bg-gradient-to-b from-[#414241]/100 to-[#363736]/100">
              <span>jump to the next gate</span>
            </ActionButton>
          </DrawerTrigger>
          <GateDrawerMainContent year={year} ticket={ticket} />
        </Container>
      </Drawer>
    </div>
  )
}

function GateDrawerMainContent({
  year,
  ticket,
}: {
  year: number
  ticket: number
}) {
  const [buyResource, setBuyResource] = useState('')

  return (
    <GateDrawerContent
      title={
        !buyResource
          ? 'gate locked'
          : buyResource === 'time'
            ? 'buy time'
            : 'buy ticket'
      }
      description={
        !buyResource
          ? "You don't have enough resources to open the next gate."
          : 'Get what you want right now'
      }
      buyResource={buyResource}
    >
      {!buyResource && <GateDrawerContentShop year={year} ticket={ticket} />}
      {buyResource && (
        <GateDrawerBuyResource resource={buyResource} imgUrl={BuyTime} />
      )}
      {!buyResource && (
        <ActionButton
          onClick={() => {
            if (year === 0) {
              setBuyResource('time')
            } else {
              setBuyResource('ticket')
            }
          }}
          className="h-[48px] text-[14px] font-inter leading-[140%] text-[#B6FF00] w-auto rounded-[16px] bg-[#B6FF00]/8 mx-11"
        >
          <BuyIcon />
          <span className="ml-3">
            Buy 1 {year > 0 ? 'Ticket' : 'year'} and open the gate
          </span>
        </ActionButton>
      )}
    </GateDrawerContent>
  )
}

function GateDrawerContentShop({
  ticket,
  year,
}: {
  year: number
  ticket: number
}) {
  return (
    <div className="flex justify-evenly mb-8">
      <GateProgressDisplay
        icon={<WatchesIcon />}
        current={year}
        max={1}
        label="years"
      />
      <GateProgressDisplay
        icon={<TicketIcon />}
        current={ticket}
        max={1}
        label="ticket"
      />
    </div>
  )
}

function GateDrawerBuyResource({
  resource,
  imgUrl,
}: {
  resource: string
  imgUrl: string
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
