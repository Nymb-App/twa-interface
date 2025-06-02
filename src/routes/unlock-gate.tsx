import { createFileRoute } from '@tanstack/react-router'
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2'
import { useContext, useState } from 'react'
import { GateNextDisplayBlock } from '@/components/gate-page/gate-header'
import { PageLayout } from '@/components/ui/page-layout'
import { GateContext } from '@/context/gate-context'
import { Container } from '@/components/ui/container'
import { GateStatisticsInfoBlock } from '@/components/gate-page/gate-statistics-section'
import { cn } from '@/utils'
import { GateElectricLines } from '@/components/ui/gate-electric-lines'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'

export const Route = createFileRoute('/unlock-gate')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentLevel, isLockedNewGate } = useContext(GateContext)

  const [isStartAnimation, setIsStartAnimation] = useState(true)

  const [isTwitchingLockerAnimation, setIsTwitchingLockerAnimation] =
    useState(true)

  const [isTranslateLockerAnimation, setIsTranslateLockerAnimation] =
    useState(false)

  const [isFadeOutLockerAnimation, setIsFadeOutLockerAnimation] =
    useState(false)

  const [isScaleBlockAnimation, setIsScaleBlockAnimation] = useState(false)

  function handleTwitchingLockerAnimationEnd() {
    setIsTranslateLockerAnimation(true)
  }

  function handleTranslateLockerAnimationEnd() {
    setIsTwitchingLockerAnimation(false)
    setIsFadeOutLockerAnimation(true)
  }

  setTimeout(() => setIsStartAnimation(false), 4500)

  return (
    <PageLayout useFooter={false} useUnlockGateCloseButton={!isStartAnimation}>
      {isStartAnimation ? (
        <div
          className={cn(
            'relative mt-[135px] translate-y-[150px]',
            isScaleBlockAnimation && 'animation-translate-gate-number',
          )}
        >
          <div className="absolute left-1/2 -translate-x-1/2">
            <GateNextDisplayBlock
              className={cn(
                'z-1 border-2 backdrop-blur-[8px] shadow-[0_0_80px_rgba(182,255,0,0.56),_inset_0_0_16px_rgba(182,255,0,0.24)]',
                isFadeOutLockerAnimation && 'animation-scale-up-gate-block',
              )}
              isLockedNewGate={isLockedNewGate}
              currentLevel={currentLevel}
              animationSpanClass="text-[white] [-webkit-text-stroke:0.5px_rgba(182,255,0,1)]"
            />
            {!isFadeOutLockerAnimation ? (
              <HiLockClosed
                className={cn(
                  'absolute -bottom-2 left-8.5 animation-twitching-locker',
                  isTranslateLockerAnimation && 'animation-translate-locker',
                )}
                color="#FFFFFF"
                fontSize={24}
                onAnimationEnd={() => {
                  handleTwitchingLockerAnimationEnd()
                  if (isTranslateLockerAnimation) {
                    handleTranslateLockerAnimationEnd()
                  }
                }}
              />
            ) : (
              <HiLockOpen
                className={cn(
                  'absolute -bottom-2 left-8.5',
                  'translate-y-[-40px] animation-fade-out-locker',
                )}
                onAnimationEnd={() => setIsScaleBlockAnimation(true)}
                color="#FFFFFF"
                fontSize={24}
              />
            )}
            <FlickeringGrid
              className="absolute z-[-1] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[450px] h-[450px] mask-[radial-gradient(ellipse_220px_190px_at_center,black,transparent)]"
              // className="absolute z-[-1] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[450px] h-[450px] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
              squareSize={2}
              gridGap={12}
              color="#b7ff01"
              maxOpacity={0.5}
              flickerChance={0.3}
              autoResize={false}
              width={450}
              height={450}
            />
          </div>
        </div>
      ) : (
        <div>
          <Container>
            <h1 className="font-pixel text-[#FFFFFF] text-[24px] leading-[32px] text-center uppercase animate-slide-up-fade-1">
              gate's open
            </h1>
            <div className="relative text-center py-[90px]">
              <GateElectricLines className="animation-gate-lines" />
              <FlickeringGrid
                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[450px] h-[450px] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
                squareSize={2}
                gridGap={12}
                color="#b7ff01"
                maxOpacity={0.5}
                flickerChance={0.3}
                autoResize={false}
                width={450}
                height={450}
              />
              <span
                className={cn(
                  'font-pixel font-[400] text-[104px] leading-[120%] text-[white] [-webkit-text-stroke:2px_rgba(182,255,0,1)] [text-shadow:0px_12.0067px_24.0134px_rgba(182,255,0,0.3),_0px_0px_72.0403px_#B6FF00]',
                  currentLevel.toString().startsWith('1') ? 'mr-12' : 'mr-0',
                )}
              >
                {currentLevel - 1}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 font-pixel text-center">
              <div className="animate-slide-up-fade-2">
                <GateStatisticsInfoBlock
                  value={2}
                  description="Daily reward"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
                >
                  <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
                    days
                  </span>
                </GateStatisticsInfoBlock>
              </div>
              <div className="animate-slide-up-fade-2">
                <GateStatisticsInfoBlock
                  value={8}
                  description="Mining"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00]"
                >
                  <span className="ml-1 text-[14px] leading-[120%] text-[#FFFFFF]/40">
                    hours
                  </span>
                </GateStatisticsInfoBlock>
              </div>
              <div className="animate-slide-up-fade-3">
                <GateStatisticsInfoBlock
                  value={1200}
                  description="Max Energy"
                  className="text-[#B6FF00] text-shadow-[0px_4.00224px_8.00448px_rgba(182,255,0,0.3),_0px_0px_24.0134px_#B6FF00] mr-3"
                />
              </div>
              <div className="animate-slide-up-fade-3">
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
            </div>
          </Container>
        </div>
      )}
      <style>{`
        @keyframes twitchingLockerAnimation {
          0% {
            left: 34px;
          }
          50% {
            left: 36px;
          }
          75% {
            left: 32px;
          }
          100% {
            left: 34px;
          }
        }

        .animation-twitching-locker {
          animation: twitchingLockerAnimation 0.1s ease-in-out 6 forwards;
        }

        @keyframes translateLockerAnimation  {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-40px);
          }
        }

        .animation-translate-locker {
          animation: translateLockerAnimation 1s ease-in-out forwards;
        }

        @keyframes fadeOutLockerAnimation {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animation-fade-out-locker {
          animation: fadeOutLockerAnimation 1.5s ease-in-out forwards;
        }

        @keyframes scaleUpGateBlock {
          0% {
            transform: scale(1);
            margin-right: 0;
          }
          40%, 100% {
            backdrop-filter: blur(0px); 
            background-color: transparent;
            box-shadow: none;
            border: 2px solid rgba(182, 255, 0, 0);
            margin-right: 7px;
          }
          100% {
            margin-right: 7px;
            transform: scale(3.5);
          }
        }

        .animation-scale-up-gate-block {
          animation: scaleUpGateBlock 1s ease-in-out 1s forwards;
        }

        @keyframes translateGateNumber {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-142px);
          }
        }

        .animation-translate-gate-number {
          animation: translateGateNumber 1s ease-in-out forwards;
        }

        @keyframes fadeInGateLinesAnimation {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animation-gate-lines {
          animation: fadeInGateLinesAnimation 2s ease-in-out forwards;
        }
      `}</style>
    </PageLayout>
  )
}
