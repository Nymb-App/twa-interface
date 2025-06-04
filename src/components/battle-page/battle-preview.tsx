import { useContext } from 'react'
import { ActionButton } from '../ui/action-button'
import { PageLayout } from '../ui/page-layout'
import { Container } from '../ui/container'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Drawer, DrawerTrigger } from '../ui/drawer'
import { GateDrawerContent } from '../gate-page/gate-drawer-content'
import { FlickeringGrid } from '../magicui/flickering-grid'
import BattleDrawerImage from '../../../public/minigames/battle-drawer-img.png'
import { GateElectricLines } from '../ui/gate-electric-lines'
import type { ReactNode } from 'react'
import { cn } from '@/utils'
import { AppContext } from '@/context/app-context'
import { BustIcon } from '@/assets/icons/bust'

export function BattlePreviewPage({
  setIsStartFindingOpponent,
}: {
  setIsStartFindingOpponent: (value: boolean) => void
}) {
  return (
    <PageLayout useFooter={false} className="bg-[#03061a] pb-50">
      <header className="font-pixel font-[400] text-center">
        <BattleTitle
          text={
            <>
              Enter the
              <br />
              bet amount
            </>
          }
        />
        <CurrentUserBattleCard />
      </header>
      <BattleGameRewardSection />
      <div className="fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#03061a]">
        <p className="font-inter text-[#FFFFFF]/40 text-[14px] font-[400] leading-[140%] text-center mb-4">
          The opponent will be <br /> randomly selected. Commission 1%
        </p>
        <ActionButton
          onClick={() => setIsStartFindingOpponent(true)}
          className="font-pixel text-[#121312] rounded-[16px] uppercase"
        >
          <span>finding the opponent</span>
        </ActionButton>
      </div>
    </PageLayout>
  )
}

export const BattleTitle = ({ text }: { text: string | ReactNode }) => {
  return (
    <h1 className="text-[24px] leading-[32px] text-[#FFFFFF] uppercase mb-4">
      {text}
    </h1>
  )
}

function BattleGameRewardSection() {
  const { battleGameRewardRadioValue, setBattleGameRewardRadioValue } =
    useContext(AppContext)

  return (
    <section className="relative px-[3px]">
      <Container>
        <div className="font-pixel rounded-[24px] border border-[#2B311C] backdrop-blur-[16px] bg-[rgba(255, 255, 255, 0.01)] p-4 uppercase mb-[21px]">
          <div className="text-center">
            <span className="text-[white] tracking-[5px] font-[400] text-[48px] leading-[120%] [-webkit-text-stroke:4px_rgba(182,255,0,1)] [text-shadow:0px_12.0067px_24.0134px_rgba(182,255,0,0.3),_0px_0px_72.0403px_#B6FF00]">
              {battleGameRewardRadioValue}
            </span>
          </div>
          <div className="h-[1px] bg-[#FFFFFF1F] my-4" />
          <RadioGroup
            defaultValue="1 weeks"
            value={battleGameRewardRadioValue}
            onValueChange={(value) => {
              setBattleGameRewardRadioValue(value)
            }}
            className="flex gap-3 justify-center"
          >
            {['1 days', '1 weeks', '1 month', '1 years'].map((option) => (
              <div key={option} className="">
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="hidden peer"
                />
                <label
                  htmlFor={option}
                  className={cn(
                    'backdrop-blur-[8px] py-1.5 pl-1 pr-1.5 rounded-[8px] cursor-pointer leading-[120%] text-[12px] font-[400] uppercase',
                    battleGameRewardRadioValue === option
                      ? 'border border-[#B6FF00] text-[#B6FF00] bg-[linear-gradient(360deg,_rgba(182,255,0,0.24)_0%,_rgba(182,255,0,0)_100%)] backdrop-blur-sm'
                      : 'border border-transparent starboard-result-block-bg text-[#FFFFFF66]',
                  )}
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Drawer>
          <DrawerTrigger asChild className="w-full mx-auto">
            <button className="flex justify-center gap-[21px] h-[40px] max-w-[254px]">
              <span className="bg-[#FFFFFF]/4 rounded-[14px] basis-[114px] flex justify-center items-center gap-3 px-2 bg-[url('/minigames/boost-grey-bg.png')] bg-no-repeat bg-[position:bottom_left_-0px]">
                <span className="ml-1.5">
                  <BustIcon />
                </span>
                <span>1 Bust</span>
              </span>
              <span className="bg-[#FFFFFF]/4 rounded-[14px] basis-[114px] flex justify-center items-center gap-3 px-2 bg-[url('/minigames/boost-green-bg.png')] bg-no-repeat bg-[position:bottom_left_-0px]">
                <span className="ml-[11px]">
                  <BustIcon strokeColor="#B6FF00" />
                </span>
                <span>1 Extra</span>
              </span>
            </button>
          </DrawerTrigger>
          <GateDrawerContent
            title="get extra bust"
            description="Increase your chances of winning"
            footerButton={
              <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
                <span>confirm and pay 0.1 ton</span>
              </ActionButton>
            }
          >
            <div>
              <div className="relative flex justify-center mb-8">
                <img
                  src={BattleDrawerImage}
                  alt="battle-drawer-image"
                  width={154}
                  height={166}
                />
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
              <div className="font-pixel font-[400]">
                <span className="text-[#FFFFFF] text-[30px] leading-[120%]">
                  0.1
                </span>
                <span className="block text-[#FFFFFF]/40 text-[16px] leading-[20px]">
                  ton
                </span>
              </div>
            </div>
          </GateDrawerContent>
        </Drawer>
      </Container>
    </section>
  )
}

export const CurrentUserBattleCard = ({
  className,
  isStartFindingOpponent,
}: {
  className?: string
  isStartFindingOpponent?: boolean
}) => {
  return (
    <div
      className={cn(
        "font-pixel flex flex-col items-center gap-6 bg-[url('/minigames/battle-header-bg.png')] z-[-1] bg-no-repeat bg-bottom pt-[26px] h-[220px] uppercase",
        className,
      )}
    >
      <p>teviall</p>
      <div className="relative size-[104px] rounded-[34px] shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)]">
        <img
          src={'/roulette-icons/default.png'}
          className="w-full h-auto object-cover absolute z-1 rounded-[34px]"
        />
        <p className="absolute z-1 left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
          NA
        </p>
        <FlickeringGrid
          className="absolute top-[-65px] left-[-134px] w-[450px] h-[220px] mask-[linear-gradient(to_right,transparent_0%,black_20%,black_70%,transparent_80%)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={false}
          width={400}
          height={220}
        />
        {isStartFindingOpponent && (
          <GateElectricLines
            svg1ClassName="top-[-30%] left-[90%]"
            svg2ClassName="top-[70%] left-[-90%] rotate-180"
            svg3ClassName="top-[70%] left-[90%] scale-x-[-1]"
            svg4ClassName="top-[-50%] left-[-80%] rotate-90 scale-x-[-1]"
          />
        )}
      </div>
    </div>
  )
}
