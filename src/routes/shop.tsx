import { createFileRoute } from '@tanstack/react-router'
import { forwardRef, useState } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { cn } from '@/utils'
import { NoTasksBlock } from '@/components/tasks-page/tasks-tabs/tasks-tabs'
import { GateDrawerContent } from '@/components/gate-page/gate-drawer-content'
import { Drawer, DrawerTrigger } from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ActionButton } from '@/components/ui/action-button'

export const Route = createFileRoute('/shop')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout className="relative" useFooter={false}>
      <FlickeringGrid
        className="relative top-10 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="white"
        maxOpacity={1}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
      <header className="absolute top-30 w-full left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h1 className="font-pixel mb-20 text-center text-[24px] leading-[32px] font-[400] uppercase">
          shop
        </h1>
        <div className="flex flex-col gap-10 w-full px-4">
          <Drawer>
            <DrawerTrigger>
              <ShopCard
                className="bg-[rgba(26,18,32,1)]"
                borderClassName="bg-gradient-to-b from-[#A119FF] to-[#322C37]"
                classNameContainerImage="bg-[url('/shop-energy-bg.png')] bg-no-repeat bg-[center_calc(50%_-_10px)] [filter:drop-shadow(0_0_50px_#9137FF)_drop-shadow(0_0_30px_#9137FF)]"
                classNameImage="mt-[-35px]"
                title="restore energy"
                view="energy"
                image="/shop-energy-img.png"
              />
            </DrawerTrigger>
            <GateDrawerContent
              title="restore energy"
              description="Get what you want right now"
              footerButton={
                <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
                  <span className="flex items-center gap-2">
                    pay <TonIcon fill="black" /> 0.2 restore energy
                  </span>
                </ActionButton>
              }
            >
              <ShopExchangeCard
                item="energy"
                itemValueReward="1000"
                itemValuePay="0.2"
                className="mt-[-35px] pt-[34px] pb-[10px]"
                src="/shop-energy-img.png"
                classNameContainerImage="bg-[url('/shop-energy-bg.png')] bg-no-repeat bg-[center_calc(50%_-_10px)] w-full bg-[size:100%_100%]"
                classNameImage="relative left-1/2 -translate-x-1/2 top-[-20px]"
                flickeringGridColor="#A119FF"
              />
            </GateDrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger>
              <ShopCard
                className="bg-[rgba(26,30,20,1)]"
                borderClassName="bg-gradient-to-b from-[#B6FF00] to-[#B6FF00]/10"
                classNameContainerImage="mt-[-15px] size-[88px] w-full"
                title="time reserve"
                view="time"
                image="/shop-clock-img.png"
              />
            </DrawerTrigger>
            <GateDrawerContent
              title="time reserve"
              description="Get what you want right now"
              footerButton={
                <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
                  <span className="flex items-center gap-2">
                    pay <TonIcon fill="black" /> 0.2 get 1 week
                  </span>
                </ActionButton>
              }
            >
              <ShopExchangeCard
                item="time"
                itemValueReward="1"
                itemValuePay="100"
                className="mt-[-35px] pt-[34px] pb-[10px]"
                src="/shop-clock-img.png"
              />
            </GateDrawerContent>
          </Drawer>
        </div>
      </header>
      <div className="mt-80">
        <NoTasksBlock
          className="h-full flex-1"
          classNameText="font-inter text-white/60 text-sm"
          title="More coming soon"
        />
      </div>
    </PageLayout>
  )
}

interface ShopCardProps {
  title?: string
  view?: 'energy' | 'time'
  image?: string
  className?: string
  classNameContainerImage?: string
  classNameImage?: string
  borderClassName?: string
}

const ShopCard = forwardRef<HTMLDivElement, ShopCardProps>(
  (
    {
      title = '',
      view = 'energy',
      image,
      className = '',
      classNameContainerImage = '',
      classNameImage = '',
      borderClassName = '',
    },
    ref,
  ) => {
    return (
      <div className="relative" ref={ref}>
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className={cn('h-full w-full p-[1px]', borderClassName)}>
            <div
              className={cn(
                'relative h-full w-full rounded-[23px] backdrop-blur-[2px]',
                className,
              )}
            >
              {view === 'time' && (
                <FlickeringGrid
                  className="absolute top-3 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
                  squareSize={2}
                  gridGap={12}
                  color="#B6FF00"
                  maxOpacity={1}
                  flickerChance={0.3}
                  autoResize={false}
                  height={140}
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className={cn(
              'flex justify-center mt-[-35px]',
              classNameContainerImage,
            )}
          >
            {image && (
              <img
                src={image}
                alt={view}
                className={cn('mt-[-13px]', classNameImage)}
              />
            )}
          </div>
          <div className="uppercase font-pixel flex gap-2 justify-between items-center px-6 pb-5">
            <p className="leading-[24px]">{title}</p>
            {view === 'energy' && (
              <span className="text-[18px] text-[#9137FF]">+1000</span>
            )}
            {view === 'time' && (
              <span className="text-[18px] text-[#B6FF00]">
                <span>1D</span>
                <span className="text-[#B6FF00]/40 ml-2">/</span>
                <span>1W</span>
                <span className="text-[#B6FF00]/40 ml-2">/</span>
                <span>1Y</span>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  },
)

function ShopExchangeCard({
  item,
  itemValueReward,
  itemValuePay,
  className = '',
  classNameContainerImage = '',
  classNameImage = '',
  flickeringGridColor = '#b7ff01',
  src,
}: {
  item: string
  itemValueReward: string
  itemValuePay: string
  className?: string
  classNameContainerImage?: string
  classNameImage?: string
  flickeringGridColor?: string
  src?: string
}) {
  const [radioValue, setRadioValue] = useState('1 week')
  return (
    <>
      <div className={cn('relative flex justify-evenly', className)}>
        {src && (
          <>
            <FlickeringGrid
              className="absolute top-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
              squareSize={2}
              gridGap={12}
              color={flickeringGridColor}
              maxOpacity={1}
              flickerChance={0.3}
              autoResize={false}
              width={450}
              height={450}
            />
            <div className={cn('relative', classNameContainerImage)}>
              <img
                src={src}
                className={cn('size-[120px] object-cover', classNameImage)}
              />
            </div>
          </>
        )}
      </div>
      <div>
        {item === 'time' && (
          <RadioGroup
            defaultValue="1 week"
            value={radioValue}
            onValueChange={(value) => {
              setRadioValue(value)
            }}
            className="flex gap-3 justify-center mb-5"
          >
            {['1 day', '1 week', '1 year'].map((option) => (
              <div key={option}>
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="hidden peer"
                />
                <label
                  htmlFor={option}
                  className={cn(
                    'font-pixel backdrop-blur-[8px] py-1.5 px-6 rounded-[8px] cursor-pointer leading-[120%] text-[9.5px] font-[400] uppercase',
                    radioValue === option
                      ? 'border border-[#B6FF00] text-[#B6FF00] bg-[linear-gradient(360deg,_rgba(182,255,0,0.24)_0%,_rgba(182,255,0,0)_100%)] backdrop-blur-sm'
                      : 'border border-transparent starboard-result-block-bg text-[#FFFFFF66]',
                  )}
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        )}
        <div className="font-pixel grid grid-cols-3 items-center mx-10">
          <div className="text-[30px] leading-[22px]">
            <p
              className={cn(
                item === 'energy'
                  ? 'text-[#9137FF] [text-shadow:0px_4.00224px_8.00448px_rgba(145,55,255,0.3),_0px_0px_24.0134px_#9137FF]'
                  : 'text-[#B6FF00] [text-shadow:0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]',
              )}
            >
              +{itemValueReward}
            </p>
            <span className="text-white/40 uppercase text-[12px]">
              {item === 'energy' ? 'energy' : radioValue.split(' ')[1]}
            </span>
          </div>
          <span className="text-white/40 text-[48px]">:</span>
          <div className="flex flex-col items-center">
            <span className="text-white text-[30px]">{itemValuePay}</span>
            <Select defaultValue="ton">
              <SelectTrigger className="text-[12px] font-pixel uppercase rounded-[8px] text-white/40 border-none starboard-result-block-bg">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Select value" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#121312] border-none !text-white/40">
                <SelectItem
                  className="!bg-[#121312] hover:!bg-[#121312] border-none !text-white/40 hover:!text-white"
                  value="ton"
                >
                  <div className="flex items-center gap-2">
                    <TonIcon /> <span>Ton</span>
                  </div>
                </SelectItem>
                <SelectItem value="stars" className="" disabled>
                  <div className="flex items-center gap-2">
                    <StarIcon /> <span>Stars</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  )
}

const StarIcon = ({ fill = 'white' }: { fill?: string }) => {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.75283 4.38002L7.67675 0.557603C7.89919 0.116901 8.43729 -0.05998 8.87618 0.16187C9.04752 0.248812 9.1858 0.389715 9.27298 0.563599L11.0917 4.25111C11.239 4.5539 11.5306 4.75776 11.8642 4.79674L15.667 5.25242C16.184 5.31539 16.5537 5.78607 16.4936 6.30472C16.4665 6.51758 16.3704 6.71544 16.2171 6.86533L13.208 9.82434C13.0847 9.94425 13.0276 10.1121 13.0486 10.283L13.5507 14.2763C13.6228 14.8489 13.217 15.3706 12.6458 15.4425C12.4294 15.4696 12.2129 15.4305 12.0206 15.3256L8.8431 13.5928C8.61164 13.4669 8.33507 13.4639 8.10361 13.5838L4.80892 15.2687C4.34598 15.5054 3.78083 15.3196 3.54335 14.8549C3.45317 14.681 3.4231 14.4862 3.45017 14.2943L3.71169 12.4596C3.84095 11.5632 4.39709 10.7837 5.20272 10.373L8.85813 8.51123C8.95434 8.46326 8.99341 8.34334 8.94532 8.2444C8.90624 8.16946 8.82507 8.12449 8.7409 8.13648L4.26783 8.77805C3.58544 8.87399 2.89404 8.68211 2.35595 8.2444L0.867921 7.03323C0.444061 6.68846 0.374921 6.05889 0.720622 5.63318C0.882952 5.4353 1.11442 5.30639 1.36693 5.27342L5.18468 4.78474C5.42817 4.75176 5.6416 4.60187 5.75283 4.38002Z"
        fill={fill}
      />
    </svg>
  )
}

const TonIcon = ({ fill = 'white' }: { fill?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.93467 1C1.07209 1 -0.108428 3.0091 0.828592 4.6333L7.0805 15.4694C7.4885 16.1769 8.511 16.1769 8.9189 15.4694L15.1721 4.6333C16.1078 3.0117 14.9273 1 13.066 1H2.93467ZM7.0754 12.2198L5.7139 9.5847L2.42855 3.709C2.21182 3.3329 2.47954 2.8511 2.93339 2.8511H7.0742V12.2211L7.0754 12.2198ZM13.5683 3.7077L10.2843 9.586L8.9227 12.2198V2.8498H13.0635C13.5173 2.8498 13.7851 3.3317 13.5683 3.7077Z"
        fill={fill}
      />
    </svg>
  )
}
