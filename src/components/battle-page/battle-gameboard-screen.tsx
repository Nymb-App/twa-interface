/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import Countdown from 'react-countdown'
import { useContext, useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../ui/page-layout'
import { GreenRain } from '../ui/green-rain'
import { NeonRain } from '../ui/neon-rain'
import { CountdownStartGame } from '../minigames/countdown-start-game'
import { BattleAnimatedPushButton } from './battle-animated-push-button'
import { BattleAnimatedBoostButton } from './battle-animated-boost-button'
import { BattleRainSplitLine } from './battle-rain-split-line'
import { AvatarCard } from '@/routes/send-gift'
import { BattlePushIcon } from '@/assets/icons/battle-push'
import { AppContext } from '@/context/app-context'
import { cn } from '@/utils'
import { BattleTurboBoostIcon } from '@/assets/icons/battle-turbo-boost'

export function GameBoardScreen({
  handleFinishGame,
  setIsWinner,
  setIsLoser,
}: {
  handleFinishGame: () => void
  setIsWinner: (value: boolean) => void
  setIsLoser: (value: boolean) => void
}) {
  const { battleGameRewardRadioValue } = useContext(AppContext)

  const [isCountdownStarted, setIsCountdownStarted] = useState(true)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [percentRainHeight, setPercentRainHeight] = useState(50)
  const [autoClick, setAutoClick] = useState(false)
  const [isLeftBoostActive, setIsLeftBoostActive] = useState(false)
  const [isLeftBoostDisable, setIsLeftBoostDisable] = useState(false)
  const [isRightBoostActive, setIsRightBoostActive] = useState(false)
  const [isRightBoostDisable, setIsRightBoostDisable] = useState(false)
  const [leftBoostfillPercentage, setLeftBoostfillPercentage] = useState(0)
  const [rightBoostfillPercentage, setRightBoostfillPercentage] = useState(0)

  const isBuyTurboBoost = true
  const isBoostActive =
    (isLeftBoostActive && !isLeftBoostDisable) ||
    (isRightBoostActive && !isRightBoostDisable)

  // Смена процента push
  const handleClick = () => {
    setPercentRainHeight((prev) => {
      const newValue = Math.min(
        Math.max(prev + (isBoostActive ? 4 : 2), 0),
        100,
      )
      return newValue
    })
  }
  useEffect(() => {
    if (percentRainHeight >= (isBoostActive ? 97 : 95)) {
      handleFinishGame()
      setIsWinner(true)
    }
    if (percentRainHeight <= 6) {
      handleFinishGame()
      setIsLoser(true)
    }
  }, [percentRainHeight])

  useEffect(() => {
    if (!isCountdownStarted && !endTime) {
      setEndTime(Date.now() + 60000)
    }
  }, [isCountdownStarted, endTime])

  useEffect(() => {
    let autoClickInterval: NodeJS.Timeout | null = null

    // Смена для бота
    if (!isCountdownStarted && endTime && autoClick) {
      autoClickInterval = setInterval(() => {
        setPercentRainHeight((prev) => {
          const newValue = Math.min(Math.max(prev - 2, 0), 100)
          return newValue
        })
      }, 300)
    }

    return () => {
      if (autoClickInterval) clearInterval(autoClickInterval)
    }
  }, [isCountdownStarted, endTime, autoClick])

  const backgroundClass = useMemo(() => {
    if (percentRainHeight > 50) return 'bg-battle-green'
    if (percentRainHeight < 50) return 'bg-battle-purple'
    return 'bg-battle-main'
  }, [percentRainHeight])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const body = document.body
    body.classList.remove(
      'bg-battle-green',
      'bg-battle-purple',
      'bg-battle-main',
    )
    body.classList.add(backgroundClass)

    return () => {
      body.classList.remove(backgroundClass)
    }
  }, [backgroundClass])

  return (
    <PageLayout
      useFooter={false}
      className={cn('pb-0 overflow-x-hidden', backgroundClass)}
    >
      <div className="flex flex-col min-h-[calc(100vh-7rem)] items-center justify-between">
        <div className="w-full">
          <section className={cn('w-full font-[400] pb-4')}>
            <dl className="flex justify-evenly text-center text-[14px] font-inter">
              <div>
                <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-4">
                  Winning:
                </dt>
                <dd className="leading-[120%] text-[#B6FF00] text-shadow-[0px_0px_8px_#B6FF00] mr-2 font-pixel mt-[-9px]">
                  <span className="mr-1 text-lg">
                    {battleGameRewardRadioValue.split(' ')[0]}
                  </span>
                  <span className="text-xs">
                    {battleGameRewardRadioValue.split(' ')[1]}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-2">
                  There's time:
                </dt>
                <dd className="text-[20px] leading-[24px] text-[#FFFFFF] font-pixel">
                  {isCountdownStarted || !endTime ? (
                    <span>01:00</span>
                  ) : (
                    <Countdown
                      key={'game-timer'}
                      date={endTime}
                      intervalDelay={1000}
                      precision={0}
                      onComplete={() => {
                        if (percentRainHeight > 50) {
                          setIsWinner(true)
                        }
                        if (percentRainHeight < 50) {
                          setIsLoser(true)
                        }

                        handleFinishGame()
                      }}
                      renderer={({ minutes, seconds }) => (
                        <span>
                          {minutes.toString().padStart(2, '0')}:
                          {seconds.toString().padStart(2, '0')}
                        </span>
                      )}
                    />
                  )}
                </dd>
              </div>
            </dl>
          </section>
          <section className="flex justify-center items-center gap-2 relative top-11 z-2 mt-[-36px]">
            <AvatarCard
              className="size-[32px]"
              classNameForSpan="text-[#FFFFFF] text-[14px] pr-1"
              src="/roulette-icons/user-2.png"
              label="IM"
            />
            <h1 className="font-pixel text-[14px] font-[400] text-[#FFFFFF] uppercase">
              igorivanov
            </h1>
          </section>
          <SvgHeaderBg percentRainHeight={percentRainHeight} />
        </div>
        <section className="mt-[-50px] mb-[-80px] w-full relative z-0 flex-1">
          {isCountdownStarted ? (
            <CountdownStartGame
              onComplete={() => {
                setIsCountdownStarted(false)
                setAutoClick(true)
              }}
            />
          ) : (
            <div className="absolute inset-0">
              <div
                className={`absolute top-0 w-full transition-all duration-${isBoostActive ? 250 : 500} ease-linear`}
                style={{ height: `${100 - percentRainHeight}%` }}
              >
                <NeonRain />
              </div>

              <BattleRainSplitLine
                position={percentRainHeight}
                isBoostActive={isBoostActive}
              />

              <div
                className={`absolute bottom-0 w-full transition-all duration-${isBoostActive ? 250 : 500} ease-linear`}
                style={{ height: `${percentRainHeight}%` }}
              >
                <GreenRain />
              </div>
            </div>
          )}
        </section>
        <div className="w-full">
          <section className="flex justify-center items-center gap-2 relative top-10 z-2">
            <AvatarCard
              className="size-[32px]"
              classNameForSpan="text-[#FFFFFF] text-[14px] pr-1"
              src="/roulette-icons/user-2.png"
              label="IM"
            />
            <h1 className="font-pixel text-[14px] font-[400] text-[#FFFFFF] uppercase">
              teviall
            </h1>
          </section>
          <SvgFooterBg percentRainHeight={percentRainHeight} />
          <section className="pt-[46px] pb-[46px]">
            <div className="flex justify-evenly items-center">
              <BattleAnimatedBoostButton
                onBoostActivate={() => setIsLeftBoostActive(true)}
                isBoostActive={isLeftBoostActive}
                setIsBoostDisable={() => setIsLeftBoostDisable(true)}
                resetBoost={() => {
                  setLeftBoostfillPercentage(0)
                  setIsLeftBoostActive(false)
                  setIsLeftBoostDisable(false)
                }}
                boostReady={leftBoostfillPercentage === 100}
                fillPercentage={leftBoostfillPercentage}
              />
              {isCountdownStarted ? (
                <BattlePushIcon />
              ) : (
                <BattleAnimatedPushButton
                  handleClick={handleClick}
                  leftBoostFillPercentage={leftBoostfillPercentage}
                  rightBoostFillPercentage={rightBoostfillPercentage}
                  setLeftBoostfillPercentage={setLeftBoostfillPercentage}
                  setRightBoostfillPercentage={setRightBoostfillPercentage}
                />
              )}
              {!isCountdownStarted && isBuyTurboBoost ? (
                <BattleAnimatedBoostButton
                  onBoostActivate={() => setIsRightBoostActive(true)}
                  isBoostActive={isRightBoostActive}
                  setIsBoostDisable={() => setIsRightBoostDisable(true)}
                  resetBoost={() => {
                    setRightBoostfillPercentage(0)
                    setIsRightBoostActive(false)
                    setIsRightBoostDisable(false)
                  }}
                  boostReady={rightBoostfillPercentage === 100}
                  fillPercentage={rightBoostfillPercentage}
                />
              ) : (
                <BattleTurboBoostIcon />
              )}
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}

const SvgHeaderBg = ({ percentRainHeight }: { percentRainHeight?: number }) => {
  return (
    <svg
      width="390"
      height="52"
      viewBox="0 0 390 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-1 w-full"
    >
      <foreignObject x="-8" y="-8" width="406" height="68">
        <div
          style={{
            backdropFilter: 'blur(4px)',
            clipPath: 'url(#bgblur_0_51_56418_clip_path)',
            height: '100%',
            width: '100%',
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="8">
        <path
          d="M0 0H390L370.29 42.7049C367.675 48.3713 362.003 52 355.763 52H34.2373C27.9965 52 22.3252 48.3713 19.71 42.7049L0 0Z"
          fill="url(#paint0_linear_51_56418)"
        />
        <path
          d="M389.218 0.5L369.836 42.4951C367.302 47.9844 361.808 51.5 355.763 51.5H34.2373C28.1915 51.5 22.6976 47.9844 20.1641 42.4951L0.782227 0.5H389.218Z"
          stroke="url(#paint1_linear_51_56418)"
          strokeOpacity="0.5"
        />
      </g>
      <defs>
        <clipPath id="bgblur_0_51_56418_clip_path" transform="translate(8 8)">
          <path d="M0 0H390L370.29 42.7049C367.675 48.3713 362.003 52 355.763 52H34.2373C27.9965 52 22.3252 48.3713 19.71 42.7049L0 0Z" />
        </clipPath>
        <linearGradient
          id="paint0_linear_51_56418"
          x1="195"
          y1="0"
          x2="195"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor={
              percentRainHeight! > 50
                ? '#0a1309'
                : percentRainHeight === 50
                  ? '#03061a'
                  : '#110522'
            }
          />
          <stop
            offset="1"
            stopColor={
              percentRainHeight! > 50
                ? '#0a1309'
                : percentRainHeight === 50
                  ? '#03061a'
                  : '#110522'
            }
            stopOpacity="0.4"
          />
        </linearGradient>
        <linearGradient
          id="paint1_linear_51_56418"
          x1="195"
          y1="0"
          x2="195"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8C35FB" stopOpacity="0" />
          <stop offset="1" stopColor="#8C35FB" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const SvgFooterBg = ({ percentRainHeight }: { percentRainHeight?: number }) => {
  return (
    <svg
      width="390"
      height="52"
      viewBox="0 0 390 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-1 w-full"
    >
      <foreignObject x="-8" y="-8" width="406" height="68">
        <div
          style={{
            backdropFilter: 'blur(4px)',
            clipPath: 'url(#bgblur_0_51_56588_clip_path)',
            height: '100%',
            width: '100%',
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="8">
        <path
          d="M0 52H390L370.29 9.29507C367.675 3.62867 362.003 0 355.763 0H34.2373C27.9965 0 22.3252 3.62866 19.71 9.29507L0 52Z"
          fill="url(#paint0_linear_51_56588)"
        />
        <path
          d="M389.218 51.5L369.836 9.50488C367.302 4.01556 361.808 0.500005 355.763 0.5H34.2373C28.1915 0.5 22.6976 4.01555 20.1641 9.50488L0.782227 51.5H389.218Z"
          stroke="url(#paint1_linear_51_56588)"
          strokeOpacity="0.5"
        />
      </g>
      <defs>
        <clipPath id="bgblur_0_51_56588_clip_path" transform="translate(8 8)">
          <path d="M0 52H390L370.29 9.29507C367.675 3.62867 362.003 0 355.763 0H34.2373C27.9965 0 22.3252 3.62866 19.71 9.29507L0 52Z" />
        </clipPath>
        <linearGradient
          id="paint0_linear_51_56588"
          x1="195"
          y1="52"
          x2="195"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor={
              percentRainHeight! > 50
                ? '#0a1309'
                : percentRainHeight === 50
                  ? '#03061a'
                  : '#110522'
            }
          />
          <stop
            offset="1"
            stopColor={
              percentRainHeight! > 50
                ? '#0a1309'
                : percentRainHeight === 50
                  ? '#03061a'
                  : '#110522'
            }
            stopOpacity="0.4"
          />
        </linearGradient>
        <linearGradient
          id="paint1_linear_51_56588"
          x1="195"
          y1="52"
          x2="195"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B6FF00" stopOpacity="0" />
          <stop offset="1" stopColor="#B6FF00" />
        </linearGradient>
      </defs>
    </svg>
  )
}
