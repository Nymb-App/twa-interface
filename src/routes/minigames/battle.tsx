import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  BattlePreviewScreen,
  BattleTitle,
  CurrentUserBattleCard,
} from '@/components/battle-page/battle-preview-screen'
import { PageLayout } from '@/components/ui/page-layout'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { GameBoardScreen } from '@/components/battle-page/battle-gameboard-screen'
import { BattleResultGameScreen } from '@/components/battle-page/battle-result-game-screen'
import { AppContext } from '@/context/app-context'
import { BattleResultGameBg } from '@/components/battle-page/battle-result-game-bg'
import { BattleRainSplitLine } from '@/components/battle-page/battle-rain-split-line'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isStartFindingOpponent, setIsStartFindingOpponent] = useState(false)
  const [isWasFoundOpponent, setIsWasFoundOpponent] = useState(false)
  const [isStartGame, setIsStartGame] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)
  const [isWinner, setIsWinner] = useState(false)
  const [isLoser, setIsLoser] = useState(false)
  const { battleGameRewardRadioValue } = useContext(AppContext)

  const [isAnimationsEnd, setIsAnimationsEnd] = useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = '#03061a'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])

  useEffect(() => {
    if (isWasFoundOpponent) {
      setTimeout(() => {
        // setIsStartGame(true)
      }, 4500)
    }
  }, [isWasFoundOpponent])

  const [cardHeight, setCardHeight] = useState(220)
  const [cardWidth, setCardWidth] = useState(450)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isWasFoundOpponent && containerRef.current) {
      const resize = () => {
        const height = Math.floor(containerRef.current!.clientHeight / 2)
        const width = Math.floor(containerRef.current!.clientWidth - 50)
        setCardHeight(height)
        setCardWidth(width)
      }

      resize()

      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }
  }, [isWasFoundOpponent])

  return (
    <>
      {!isStartFindingOpponent && (
        <BattlePreviewScreen
          setIsStartFindingOpponent={setIsStartFindingOpponent}
        />
      )}
      {isStartFindingOpponent && !isStartGame && (
        <PageLayout
          useFooter={false}
          className="bg-[#03061a] pb-30 overflow-hidden"
        >
          <header className="font-pixel font-[400] text-center">
            <BattleTitle
              className="opacity-0 animate-battle-preview-title-fade"
              text={
                !isWasFoundOpponent
                  ? 'Finding the opponent'
                  : 'An opponent was found'
              }
            />
          </header>
          <div
            ref={containerRef}
            className={cn(
              'flex flex-col min-h-[calc(100vh-18rem)] items-center justify-between gap-3',
              isWasFoundOpponent && 'gap-0',
            )}
          >
            <OpponentBattleCard
              cardHeight={cardHeight}
              style={
                isWasFoundOpponent ? { height: `${cardHeight}px` } : undefined
              }
              isWasFoundOpponent={isWasFoundOpponent}
              setIsWasFoundOpponent={setIsWasFoundOpponent}
              className={cn(
                'relative z-0 w-full opacity-0 animate-battle-finding-slide-top-fade',
                isWasFoundOpponent &&
                  'duration-1300 linear transition-all pt-18',
              )}
            />
            <div className="relative">
              <div
                className={cn(
                  'relative z-2 font-pixel font-[400] text-[20px] leading-[24px] text-center opacity-0 animate-battle-finding-versus-fade',
                  isWasFoundOpponent &&
                    'absolute -translate-x-1/2 -translate-y-1/2',
                )}
              >
                VS
                {isWasFoundOpponent && (
                  <BattleRainSplitLine
                    className={cn(
                      `absolute -translate-y-1/2 -translate-x-1/2 z-[-1]`,
                      'opacity-0 animate-battle-finding-line-width-fade',
                    )}
                    style={{ width: `${cardWidth}px` }}
                  />
                )}
              </div>
            </div>
            <CurrentUserBattleCard
              isWasFoundOpponent={isWasFoundOpponent}
              cardHeight={cardHeight}
              style={
                isWasFoundOpponent ? { height: `${cardHeight}px` } : undefined
              }
              className={cn(
                'relative z-0 w-full opacity-0 animate-battle-preview-slide',
                isWasFoundOpponent &&
                  'duration-1300 linear pt-17 transition-all',
              )}
              isStartFindingOpponent={isStartFindingOpponent}
            />
          </div>
          <div
            className={cn(
              'fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#03061a]',
              !isAnimationsEnd && 'pointer-events-none',
              !isWasFoundOpponent
                ? 'opacity-0 animate-battle-finding-button-fade-in'
                : 'animate-battle-finding-button-fade-out pointer-events-none',
            )}
            onAnimationEnd={() => setIsAnimationsEnd(true)}
          >
            <ActionButton
              onClick={() => {
                setIsStartFindingOpponent(false)
                setIsWasFoundOpponent(false)
                setIsAnimationsEnd(false)
              }}
              className={cn('bg-gradient-to-b from-[#FFFFFF] to-[#999999]')}
            >
              <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
                close
              </span>
            </ActionButton>
          </div>
        </PageLayout>
      )}
      {isStartGame && !isGameFinished && (
        <GameBoardScreen
          handleFinishGame={() => setIsGameFinished(true)}
          setIsWinner={setIsWinner}
          setIsLoser={setIsLoser}
        />
      )}
      {isGameFinished && isWinner && (
        <BattleResultGameScreen
          classNameForBg="rotate-180"
          rewardTimeValue={battleGameRewardRadioValue.split(' ')[0]}
          rewardTimeLabel={battleGameRewardRadioValue.split(' ')[1]}
          isWinner={true}
          starsImgSrc="/minigames/winning-stars.png"
          handleResultGame={() => {
            setIsStartGame(false)
            setIsGameFinished(false)
            setIsWinner(false)
            setIsWasFoundOpponent(false)
            setIsStartFindingOpponent(false)
          }}
          battleResultGameBgComponent={
            <BattleResultGameBg
              className="rotate-180 bg-[#0a1309]"
              glowColor="#0a1309"
              gradColor1="rgba(10, 19, 9, 0)"
              gradColor2="#1e4020"
              gradColor3="#58c77a"
            />
          }
        />
      )}
      {isGameFinished && isLoser && (
        <BattleResultGameScreen
          rewardTimeValue={battleGameRewardRadioValue.split(' ')[0]}
          rewardTimeLabel={battleGameRewardRadioValue.split(' ')[1]}
          handleResultGame={() => {
            setIsStartGame(false)
            setIsGameFinished(false)
            setIsLoser(false)
            setIsWasFoundOpponent(false)
            setIsStartFindingOpponent(false)
          }}
          battleResultGameBgComponent={<BattleResultGameBg />}
        />
      )}
    </>
  )
}

export const OpponentBattleCard = ({
  cardHeight,
  style,
  isWasFoundOpponent,
  setIsWasFoundOpponent,
  className,
}: {
  cardHeight?: number
  style?: React.CSSProperties
  isWasFoundOpponent: boolean
  setIsWasFoundOpponent: (value: boolean) => void
  className?: string
}) => {
  useEffect(() => {
    setTimeout(() => {
      setIsWasFoundOpponent(true)
    }, 4500)
  }, [])

  return (
    <div
      className={cn(
        "font-pixel flex flex-col items-center gap-6 bg-[url('/minigames/battle-opponent-bg.png')] z-[-1] bg-no-repeat bg-bottom bg-[length:100%_100%] pt-[26px] h-[220px] uppercase",
        className,
      )}
      style={style}
    >
      <div className="relative size-[104px] rounded-[34px]">
        {isWasFoundOpponent ? (
          <div>
            <img
              src={'/roulette-icons/default.png'}
              className="w-full h-auto object-cover absolute z-1 rounded-[34px] shadow-[0px_0px_59.8px_#8C35FB]"
            />
            <p className="absolute z-1 left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
              NA
            </p>
          </div>
        ) : (
          <FindingTheOpponentPlaceholder />
        )}
        {/* {isWasFoundOpponent && <ElectricLines />} */}
      </div>
      <FlickeringGrid
        className={cn(
          'absolute top-[6px] left-[25px] w-[450px] mask-[linear-gradient(to_right,transparent_0%,black_20%,black_70%,transparent_80%)]',
          isWasFoundOpponent && 'transition-[height] duration-1700 linear',
        )}
        squareSize={2}
        gridGap={12}
        color="#cdaff9"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={cardHeight}
        style={{ height: `${cardHeight}px` }}
      />
      <p className={cn(!isWasFoundOpponent && 'hidden')}>teviall</p>
    </div>
  )
}

export const FindingTheOpponentPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center font-pixel mt-4 animate-battle-finding-dots-pulse">
      <div className="relative mb-4">
        <div className="absolute z-0 inset-0 rounded-full bg-[#8c35fb66] blur-[20px] shadow-[0px_0px_59.8px_#8C35FB]" />
        <div className="relative flex items-center justify-center">
          <div className="text-[#FFFFFF] text-[104px] font-[400] leading-[120%]">
            :
          </div>
        </div>
      </div>
    </div>
  )
}
