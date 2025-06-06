import Countdown from 'react-countdown'
import { useContext, useEffect, useState } from 'react'
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

export function GameBoardScreen({
  handleFinishGame,
}: {
  handleFinishGame: () => void
}) {
  const { battleGameRewardRadioValue, setBattleGamePercentOfFill } =
    useContext(AppContext)

  const [isCountdownStarted, setIsCountdownStarted] = useState(true)
  const [endTime, setEndTime] = useState<number | null>(null)

  const [percentRainHeight, setPercentRain] = useState(50)

  const handleClick = () => {
    setPercentRain((prev) => {
      const newValue = Math.min(Math.max(prev + 1, 0), 100) // ограничим от 0 до 100
      return newValue
    })
  }

  useEffect(() => {
    if (!isCountdownStarted && !endTime) {
      setEndTime(Date.now() + 120000)
    }
  }, [isCountdownStarted, endTime])

  return (
    <PageLayout useFooter={false} className="bg-[#03061a] pb-0">
      <div className="flex flex-col min-h-[calc(100vh-7rem)] items-center justify-between">
        <div className="w-full">
          <section className="w-full font-[400] mb-4">
            <dl className="flex justify-evenly text-center text-[14px] font-pixel uppercase">
              <div>
                <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-4">
                  Winning:
                </dt>
                <dd className="leading-[120%] text-[#B6FF00] text-shadow-[0px_0px_8px_#B6FF00] mr-2">
                  {battleGameRewardRadioValue}
                </dd>
              </div>
              <div>
                <dt className="leading-[120%] text-[14px] text-[#FFFFFF]/40 mb-2">
                  There's time:
                </dt>
                <dd className="text-[20px] leading-[24px] text-[#FFFFFF]">
                  {isCountdownStarted || !endTime ? (
                    <span>02:00</span>
                  ) : (
                    <Countdown
                      key={'game-timer'}
                      date={endTime}
                      intervalDelay={1000}
                      precision={0}
                      onComplete={() => {
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
          <SvgHeaderBg />
        </div>
        <section className="mt-[-50px] mb-[-80px] w-full relative z-0 flex-1">
          {isCountdownStarted ? (
            <CountdownStartGame
              onComplete={() => {
                setIsCountdownStarted(false)
                setBattleGamePercentOfFill(0)
              }}
            />
          ) : (
            <div className="absolute inset-0">
              <div
                className="absolute top-0 w-full transition-all duration-150 ease-linear"
                style={{ height: `${100 - percentRainHeight}%` }}
              >
                <NeonRain />
              </div>

              <BattleRainSplitLine position={percentRainHeight} />

              <div
                className={`absolute bottom-0 w-full transition-all duration-150 ease-linear`}
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
          <SvgFooterBg />
          <section className="pt-[46px] pb-[46px]">
            <div className="flex justify-evenly">
              <BattleAnimatedBoostButton />
              {isCountdownStarted ? (
                <BattlePushIcon />
              ) : (
                <BattleAnimatedPushButton onClick={handleClick} />
              )}

              <button>
                <svg
                  width="88"
                  height="88"
                  viewBox="0 0 88 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.2">
                    <path
                      d="M64.398 46.5305C66.1285 46.5305 67.5313 45.1276 67.5313 43.3971C67.5313 41.6666 66.1285 40.2638 64.398 40.2638C62.6675 40.2638 61.2646 41.6666 61.2646 43.3971C61.2646 45.1276 62.6675 46.5305 64.398 46.5305Z"
                      fill="white"
                    />
                    <path
                      d="M60.5796 58.286C62.3101 58.286 63.713 56.8831 63.713 55.1526C63.713 53.4221 62.3101 52.0193 60.5796 52.0193C58.8491 52.0193 57.4463 53.4221 57.4463 55.1526C57.4463 56.8831 58.8491 58.286 60.5796 58.286Z"
                      fill="white"
                    />
                    <path
                      d="M50.5796 65.5516C52.3101 65.5516 53.713 64.1487 53.713 62.4182C53.713 60.6878 52.3101 59.2849 50.5796 59.2849C48.8491 59.2849 47.4463 60.6878 47.4463 62.4182C47.4463 64.1487 48.8491 65.5516 50.5796 65.5516Z"
                      fill="white"
                    />
                    <path
                      d="M38.2183 65.5516C39.9488 65.5516 41.3516 64.1487 41.3516 62.4182C41.3516 60.6878 39.9488 59.2849 38.2183 59.2849C36.4878 59.2849 35.085 60.6878 35.085 62.4182C35.085 64.1487 36.4878 65.5516 38.2183 65.5516Z"
                      fill="white"
                    />
                    <path
                      d="M28.2183 58.286C29.9488 58.286 31.3516 56.8831 31.3516 55.1526C31.3516 53.4221 29.9488 52.0193 28.2183 52.0193C26.4878 52.0193 25.085 53.4221 25.085 55.1526C25.085 56.8831 26.4878 58.286 28.2183 58.286Z"
                      fill="white"
                    />
                    <path
                      d="M24.399 46.5305C26.1294 46.5305 27.5323 45.1276 27.5323 43.3971C27.5323 41.6666 26.1294 40.2638 24.399 40.2638C22.6685 40.2638 21.2656 41.6666 21.2656 43.3971C21.2656 45.1276 22.6685 46.5305 24.399 46.5305Z"
                      fill="white"
                    />
                    <path
                      d="M28.2183 34.7746C29.9488 34.7746 31.3516 33.3718 31.3516 31.6413C31.3516 29.9108 29.9488 28.5079 28.2183 28.5079C26.4878 28.5079 25.085 29.9108 25.085 31.6413C25.085 33.3718 26.4878 34.7746 28.2183 34.7746Z"
                      fill="white"
                    />
                    <path
                      d="M38.2183 27.5093C39.9488 27.5093 41.3516 26.1065 41.3516 24.376C41.3516 22.6455 39.9488 21.2427 38.2183 21.2427C36.4878 21.2427 35.085 22.6455 35.085 24.376C35.085 26.1065 36.4878 27.5093 38.2183 27.5093Z"
                      fill="white"
                    />
                    <path
                      d="M50.5796 27.5093C52.3101 27.5093 53.713 26.1065 53.713 24.376C53.713 22.6455 52.3101 21.2427 50.5796 21.2427C48.8491 21.2427 47.4463 22.6455 47.4463 24.376C47.4463 26.1065 48.8491 27.5093 50.5796 27.5093Z"
                      fill="white"
                    />
                    <path
                      d="M60.5796 34.7746C62.3101 34.7746 63.713 33.3718 63.713 31.6413C63.713 29.9108 62.3101 28.5079 60.5796 28.5079C58.8491 28.5079 57.4463 29.9108 57.4463 31.6413C57.4463 33.3718 58.8491 34.7746 60.5796 34.7746Z"
                      fill="white"
                    />
                  </g>
                  <g opacity="0.08">
                    <path
                      d="M74.3995 45.6637C75.6513 45.6637 76.6661 44.6489 76.6661 43.397C76.6661 42.1452 75.6513 41.1304 74.3995 41.1304C73.1476 41.1304 72.1328 42.1452 72.1328 43.397C72.1328 44.6489 73.1476 45.6637 74.3995 45.6637Z"
                      fill="white"
                    />
                    <path
                      d="M70.379 60.6639C71.6308 60.6639 72.6456 59.6491 72.6456 58.3973C72.6456 57.1454 71.6308 56.1306 70.379 56.1306C69.1271 56.1306 68.1123 57.1454 68.1123 58.3973C68.1123 59.6491 69.1271 60.6639 70.379 60.6639Z"
                      fill="white"
                    />
                    <path
                      d="M59.3995 71.6445C60.6513 71.6445 61.6661 70.6297 61.6661 69.3779C61.6661 68.126 60.6513 67.1112 59.3995 67.1112C58.1476 67.1112 57.1328 68.126 57.1328 69.3779C57.1328 70.6297 58.1476 71.6445 59.3995 71.6445Z"
                      fill="white"
                    />
                    <path
                      d="M44.3985 75.6637C45.6503 75.6637 46.6652 74.6489 46.6652 73.397C46.6652 72.1452 45.6503 71.1304 44.3985 71.1304C43.1467 71.1304 42.1318 72.1452 42.1318 73.397C42.1318 74.6489 43.1467 75.6637 44.3985 75.6637Z"
                      fill="white"
                    />
                    <path
                      d="M29.3995 71.6444C30.6513 71.6444 31.6661 70.6296 31.6661 69.3777C31.6661 68.1259 30.6513 67.1111 29.3995 67.1111C28.1476 67.1111 27.1328 68.1259 27.1328 69.3777C27.1328 70.6296 28.1476 71.6444 29.3995 71.6444Z"
                      fill="white"
                    />
                    <path
                      d="M18.419 60.6639C19.6709 60.6639 20.6857 59.6491 20.6857 58.3973C20.6857 57.1454 19.6709 56.1306 18.419 56.1306C17.1672 56.1306 16.1523 57.1454 16.1523 58.3973C16.1523 59.6491 17.1672 60.6639 18.419 60.6639Z"
                      fill="white"
                    />
                    <path
                      d="M14.3995 45.6637C15.6513 45.6637 16.6661 44.6489 16.6661 43.397C16.6661 42.1452 15.6513 41.1304 14.3995 41.1304C13.1476 41.1304 12.1328 42.1452 12.1328 43.397C12.1328 44.6489 13.1476 45.6637 14.3995 45.6637Z"
                      fill="white"
                    />
                    <path
                      d="M18.419 30.6639C19.6709 30.6639 20.6857 29.6491 20.6857 28.3973C20.6857 27.1454 19.6709 26.1306 18.419 26.1306C17.1672 26.1306 16.1523 27.1454 16.1523 28.3973C16.1523 29.6491 17.1672 30.6639 18.419 30.6639Z"
                      fill="white"
                    />
                    <path
                      d="M29.3995 19.683C30.6513 19.683 31.6661 18.6682 31.6661 17.4163C31.6661 16.1645 30.6513 15.1497 29.3995 15.1497C28.1476 15.1497 27.1328 16.1645 27.1328 17.4163C27.1328 18.6682 28.1476 19.683 29.3995 19.683Z"
                      fill="white"
                    />
                    <path
                      d="M44.3985 15.6637C45.6503 15.6637 46.6652 14.6489 46.6652 13.397C46.6652 12.1452 45.6503 11.1304 44.3985 11.1304C43.1467 11.1304 42.1318 12.1452 42.1318 13.397C42.1318 14.6489 43.1467 15.6637 44.3985 15.6637Z"
                      fill="white"
                    />
                    <path
                      d="M59.3995 19.6831C60.6513 19.6831 61.6661 18.6683 61.6661 17.4164C61.6661 16.1646 60.6513 15.1498 59.3995 15.1498C58.1476 15.1498 57.1328 16.1646 57.1328 17.4164C57.1328 18.6683 58.1476 19.6831 59.3995 19.6831Z"
                      fill="white"
                    />
                    <path
                      d="M70.379 30.6639C71.6308 30.6639 72.6456 29.6491 72.6456 28.3973C72.6456 27.1454 71.6308 26.1306 70.379 26.1306C69.1271 26.1306 68.1123 27.1454 68.1123 28.3973C68.1123 29.6491 69.1271 30.6639 70.379 30.6639Z"
                      fill="white"
                    />
                  </g>
                  <g opacity="0.04">
                    <path
                      d="M84.401 44.7972C85.1742 44.7972 85.801 44.1704 85.801 43.3972C85.801 42.624 85.1742 41.9972 84.401 41.9972C83.6278 41.9972 83.001 42.624 83.001 43.3972C83.001 44.1704 83.6278 44.7972 84.401 44.7972Z"
                      fill="white"
                    />
                    <path
                      d="M80.4391 62.1523C81.2123 62.1523 81.8391 61.5255 81.8391 60.7523C81.8391 59.9791 81.2123 59.3523 80.4391 59.3523C79.6659 59.3523 79.0391 59.9791 79.0391 60.7523C79.0391 61.5255 79.6659 62.1523 80.4391 62.1523Z"
                      fill="white"
                    />
                    <path
                      d="M69.3395 76.0703C70.1127 76.0703 70.7395 75.4435 70.7395 74.6703C70.7395 73.8971 70.1127 73.2703 69.3395 73.2703C68.5663 73.2703 67.9395 73.8971 67.9395 74.6703C67.9395 75.4435 68.5663 76.0703 69.3395 76.0703Z"
                      fill="white"
                    />
                    <path
                      d="M53.3014 83.7944C54.0746 83.7944 54.7014 83.1676 54.7014 82.3944C54.7014 81.6212 54.0746 80.9944 53.3014 80.9944C52.5282 80.9944 51.9014 81.6212 51.9014 82.3944C51.9014 83.1676 52.5282 83.7944 53.3014 83.7944Z"
                      fill="white"
                    />
                    <path
                      d="M35.4996 83.7944C36.2728 83.7944 36.8996 83.1676 36.8996 82.3944C36.8996 81.6212 36.2728 80.9944 35.4996 80.9944C34.7264 80.9944 34.0996 81.6212 34.0996 82.3944C34.0996 83.1676 34.7264 83.7944 35.4996 83.7944Z"
                      fill="white"
                    />
                    <path
                      d="M19.4605 76.0704C20.2337 76.0704 20.8605 75.4436 20.8605 74.6704C20.8605 73.8972 20.2337 73.2704 19.4605 73.2704C18.6873 73.2704 18.0605 73.8972 18.0605 74.6704C18.0605 75.4436 18.6873 76.0704 19.4605 76.0704Z"
                      fill="white"
                    />
                    <path
                      d="M8.36191 62.1523C9.13511 62.1523 9.76191 61.5255 9.76191 60.7523C9.76191 59.9791 9.13511 59.3523 8.36191 59.3523C7.58872 59.3523 6.96191 59.9791 6.96191 60.7523C6.96191 61.5255 7.58872 62.1523 8.36191 62.1523Z"
                      fill="white"
                    />
                    <path
                      d="M4.4 44.7972C5.1732 44.7972 5.8 44.1704 5.8 43.3972C5.8 42.624 5.1732 41.9972 4.4 41.9972C3.6268 41.9972 3 42.624 3 43.3972C3 44.1704 3.6268 44.7972 4.4 44.7972Z"
                      fill="white"
                    />
                    <path
                      d="M8.36191 27.4416C9.13511 27.4416 9.76191 26.8148 9.76191 26.0416C9.76191 25.2684 9.13511 24.6416 8.36191 24.6416C7.58872 24.6416 6.96191 25.2684 6.96191 26.0416C6.96191 26.8148 7.58872 27.4416 8.36191 27.4416Z"
                      fill="white"
                    />
                    <path
                      d="M19.4605 13.524C20.2337 13.524 20.8605 12.8972 20.8605 12.124C20.8605 11.3508 20.2337 10.724 19.4605 10.724C18.6873 10.724 18.0605 11.3508 18.0605 12.124C18.0605 12.8972 18.6873 13.524 19.4605 13.524Z"
                      fill="white"
                    />
                    <path
                      d="M35.4996 5.8C36.2728 5.8 36.8996 5.1732 36.8996 4.4C36.8996 3.6268 36.2728 3 35.4996 3C34.7264 3 34.0996 3.6268 34.0996 4.4C34.0996 5.1732 34.7264 5.8 35.4996 5.8Z"
                      fill="white"
                    />
                    <path
                      d="M53.3014 5.8C54.0746 5.8 54.7014 5.1732 54.7014 4.4C54.7014 3.6268 54.0746 3 53.3014 3C52.5282 3 51.9014 3.6268 51.9014 4.4C51.9014 5.1732 52.5282 5.8 53.3014 5.8Z"
                      fill="white"
                    />
                    <path
                      d="M69.3395 13.5239C70.1127 13.5239 70.7395 12.8971 70.7395 12.1239C70.7395 11.3507 70.1127 10.7239 69.3395 10.7239C68.5663 10.7239 67.9395 11.3507 67.9395 12.1239C67.9395 12.8971 68.5663 13.5239 69.3395 13.5239Z"
                      fill="white"
                    />
                    <path
                      d="M80.4391 27.4416C81.2123 27.4416 81.8391 26.8148 81.8391 26.0416C81.8391 25.2684 81.2123 24.6416 80.4391 24.6416C79.6659 24.6416 79.0391 25.2684 79.0391 26.0416C79.0391 26.8148 79.6659 27.4416 80.4391 27.4416Z"
                      fill="white"
                    />
                  </g>
                  <path
                    d="M35.5 42.5L44 34L52.5 42.5"
                    stroke="white"
                    stroke-opacity="0.4"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M38 48L44 42L50 48"
                    stroke="white"
                    stroke-opacity="0.4"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M41 53L44 50L47 53"
                    stroke="white"
                    stroke-opacity="0.4"
                    stroke-width="2"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}

const SvgHeaderBg = () => {
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
          stroke-opacity="0.5"
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
          <stop stop-color="#02071B" />
          <stop offset="1" stop-color="#02071B" stop-opacity="0.4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_51_56418"
          x1="195"
          y1="0"
          x2="195"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8C35FB" stop-opacity="0" />
          <stop offset="1" stop-color="#8C35FB" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const SvgFooterBg = () => {
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
          stroke-opacity="0.5"
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
          <stop stop-color="#120523" />
          <stop offset="1" stop-color="#120523" stop-opacity="0.4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_51_56588"
          x1="195"
          y1="52"
          x2="195"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#B6FF00" stop-opacity="0" />
          <stop offset="1" stop-color="#B6FF00" />
        </linearGradient>
      </defs>
    </svg>
  )
}
