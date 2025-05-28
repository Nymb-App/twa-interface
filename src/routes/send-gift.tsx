import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/utils'
import { SendGift } from '@/assets/icons/send-gift'
import { AppContext } from '@/context/app-context'
import { Container } from '@/components/ui/container'
import { RussianRoulette } from '@/components/ui/russian-roullete'

export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    document.body.style.backgroundColor = '#151317'
  }, [])

  // const { isShowSendGiftButton, isShowSendGiftActionButtons, isStartRoulette } =
  //   useContext(AppContext)

  const [isShowSendGiftButton, setIsShowSendGiftButton] = useState(true)
  const [isShowSendGiftActionButtons, setIsShowSendGiftActionButtons] =
    useState(false)
  const [isStartRoulette, setIsStartRoulette] = useState(false)

  return (
    <PageLayout
      className="bg-[#151317]"
      useFooter={false}
      useSendButton={isShowSendGiftButton}
      useSendGiftActionButtons={isShowSendGiftActionButtons}
      setIsShowSendGiftActionButtons={setIsShowSendGiftActionButtons}
      setIsStartRoulette={setIsStartRoulette}
    >
      {isStartRoulette ? (
        <RussianRoulette
          isStartRoulette={isStartRoulette}
          items={participants}
          winnerIndex={3}
          duration={4500}
          gap={20}
          loops={4}
          onFinish={() => {}}
          setIsShowSendGiftButton={setIsShowSendGiftButton}
          isShowSendGiftActionButtons={isShowSendGiftActionButtons}
          setIsShowSendGiftActionButtons={setIsShowSendGiftActionButtons}
        />
      ) : (
        <Container className="mb-5">
          <SendGiftHeader />
        </Container>
      )}
    </PageLayout>
  )
}

const AvatarCard = ({ src, label }: { src: string; label: string }) => (
  <div className="relative size-22">
    <img
      src={src}
      className="size-full object-cover rounded-full shadow-lg" // ← ОДИНАКОВО для всех
    />
    <span className="absolute left-1/2 top-1/2 -translate-1/2 font-pixel text-2xl">
      {label || 'NA'}
    </span>
  </div>
)

const participants = [
  <AvatarCard src="/roulette-icons/user-1.png" label="IM" />,
  <AvatarCard src="/roulette-icons/user-2.png" label="AJ" />,
  <AvatarCard src="/roulette-icons/user-3.png" label="MP" />,
  <AvatarCard src="/roulette-icons/user-2.png" label="JS" />,
]

const SendGiftHeader = () => {
  const {
    giftCountValue,
    giftPeriodRadioValue,
    setGiftPeriodRadioValue,
    setGiftCountValue,
  } = useContext(AppContext)

  return (
    <>
      <div className="flex flex-col items-center relative">
        <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase mb-[115px]">
          enter the <br />
          prize amount
        </h1>
        <SendGift className="animate-[wiggle_3s_ease-in-out_infinite] absolute top-[60px] z-1" />
        <FlickeringGrid
          className="absolute inset-0 h-[350px] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#aa73f9"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={350}
        />
      </div>
      <div className="relative">
        <div className="mt-[60px] font-pixel rounded-[24px] border border-[#2B311C] p-4 backdrop-blur-[16px] bg-[rgba(255, 255, 255, 0.01)]">
          <div className="flex justify-between items-center py-[9px] px-4">
            <button
              onClick={() => {
                if (giftCountValue > 1) {
                  setGiftCountValue(giftCountValue - 1)
                }
              }}
              className="p-2 bg-[#8C35FB29] rounded-[14px] h-[40px] w-[40px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.4277 10.7861V12.7861H2V10.7861H22.4277Z"
                  fill="white"
                />
              </svg>
            </button>
            <span className="text-[#8633F1] font-[400] text-[48px] leading-[120%] [text-shadow:0px_0px_60px_#A55EFF]">
              {giftCountValue}
            </span>
            <button
              onClick={() => {
                if (giftCountValue < 100) {
                  setGiftCountValue(giftCountValue + 1)
                }
              }}
              className="p-2 bg-[#8C35FB29] rounded-[14px] h-[40px] w-[40px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2139 1.57227V10.7861H22.4277V12.7861H13.2139V22H11.2139V12.7861H2V10.7861H11.2139V1.57227H13.2139Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <div className="h-[1px] bg-[#FFFFFF1F] my-4" />
          <RadioGroup
            defaultValue="weeks"
            value={giftPeriodRadioValue}
            onValueChange={(value) => {
              setGiftPeriodRadioValue(value)
            }}
            className="flex gap-4 justify-center"
          >
            {['days', 'weeks', 'years'].map((option) => (
              <div key={option} className="">
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="hidden peer"
                />
                <label
                  htmlFor={option}
                  className={cn(
                    'backdrop-blur-[8px] py-1.5 px-5 rounded-[8px] cursor-pointer leading-[120%] text-[12px] font-[400] uppercase',
                    giftPeriodRadioValue === option
                      ? 'border border-[#8C35FB] text-[#8633F1]'
                      : 'border border-transparent starboard-result-block-bg text-[#FFFFFF66]',
                  )}
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </>
  )
}
