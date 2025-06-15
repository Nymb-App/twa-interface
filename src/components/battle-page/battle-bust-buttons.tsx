import { Drawer, DrawerTrigger } from '../ui/drawer'
import { GateDrawerContent } from '../gate-page/gate-drawer-content'
import { ActionButton } from '../ui/action-button'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { cn } from '@/utils'
import { BustIcon } from '@/assets/icons/bust'
import BattleDrawerImage from '/minigames/battle-drawer-img.png'

export const BattleBustButtons = ({
  className,
  onAnimationEnd,
}: {
  className?: string
  onAnimationEnd?: () => void
}) => {
  return (
    <div
      className={cn('flex justify-center gap-4 h-10', className)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="bg-[#FFFFFF]/4 rounded-[14px] h-full basis-[114px] flex justify-center items-center gap-3 px-2 bg-[url('/minigames/boost-grey-bg.png')] bg-no-repeat bg-[position:bottom_left_-1px]">
        <span className="ml-1.5">
          <BustIcon />
        </span>
        <span className="font-semibold">1 Bust</span>
      </div>
      <Drawer>
        <DrawerTrigger className="font-semibold cursor-pointer bg-[#FFFFFF]/4 rounded-[14px] h-full flex justify-center items-center gap-3 px-3 bg-[url('/minigames/boost-green-bg.png')] bg-no-repeat bg-[position:bottom_left_-1px]">
          <span className="ml-[6px]">
            <BustIcon strokeColor="#B6FF00" />
          </span>
          <span className="text-[#B6FF00]">1 Extra</span>
          {/* </span> */}
        </DrawerTrigger>
        <GateDrawerContent
          title="get extra bust"
          description="Increase your chances of winning"
          className="backdrop-blur-[8px] bg-[#121312]/95"
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
    </div>
  )
}
