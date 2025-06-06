import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  BattlePreviewScreen,
  BattleTitle,
  CurrentUserBattleCard,
} from '@/components/battle-page/battle-preview-screen'
import { PageLayout } from '@/components/ui/page-layout'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { BattleResultGameScreen } from '@/components/battle-page/battle-result-game-screen'
import { GameBoardScreen } from '@/components/battle-page/battle-gameboard-screen'

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

  useEffect(() => {
    document.body.style.backgroundColor = '#03061a'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])

  useEffect(() => {
    if (isWasFoundOpponent) {
      setTimeout(() => {
        setIsStartGame(true)
      }, 3000)
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
        <PageLayout useFooter={false} className="bg-[#03061a] pb-30">
          <header className="font-pixel font-[400] text-center">
            <BattleTitle
              text={
                !isWasFoundOpponent
                  ? 'Finding the opponent'
                  : 'An opponent was found'
              }
            />
          </header>
          <div className="flex flex-col min-h-[calc(100vh-18rem)] items-center justify-between gap-3">
            <OpponentBattleCard
              isWasFoundOpponent={isWasFoundOpponent}
              setIsWasFoundOpponent={setIsWasFoundOpponent}
              className="relative z-0 w-full"
            />
            <div className="relative">
              <p className="relative z-2 font-pixel font-[400] text-[20px] leading-[24px] text-center">
                VS
              </p>
            </div>
            <CurrentUserBattleCard
              className="relative z-0 w-full"
              isStartFindingOpponent={isStartFindingOpponent}
            />
          </div>
          {!isWasFoundOpponent && (
            <div className="fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#03061a]">
              <ActionButton
                onClick={() => {
                  setIsStartFindingOpponent(false)
                  setIsWasFoundOpponent(false)
                }}
                className="bg-gradient-to-b from-[#FFFFFF] to-[#999999]"
              >
                <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
                  close
                </span>
              </ActionButton>
            </div>
          )}
        </PageLayout>
      )}
      {isStartGame && !isWinner && (
        <GameBoardScreen handleFinishGame={() => setIsWinner(true)} />
      )}
      {isWinner && (
        <BattleResultGameScreen
          rewardTimeValue={24}
          rewardTimeLabel="weeks"
          isWinner={isWinner}
          starsImgSrc="/minigames/winning-stars.png"
          handleResultGame={() => {
            setIsStartGame(false)
            setIsGameFinished(false)
            setIsWinner(false)
            setIsWasFoundOpponent(false)
            setIsStartFindingOpponent(false)
          }}
        />
      )}
      {isLoser && (
        <BattleResultGameScreen
          rewardTimeValue={24}
          rewardTimeLabel="weeks"
          handleResultGame={() => {
            setIsStartGame(false)
            setIsGameFinished(false)
            setIsWinner(false)
            setIsWasFoundOpponent(false)
            setIsStartFindingOpponent(false)
          }}
        />
      )}
    </>
  )
}

export const OpponentBattleCard = ({
  isWasFoundOpponent,
  setIsWasFoundOpponent,
  className,
}: {
  isWasFoundOpponent: boolean
  setIsWasFoundOpponent: (value: boolean) => void
  className?: string
}) => {
  useEffect(() => {
    setTimeout(() => {
      setIsWasFoundOpponent(true)
    }, 3000)
  }, [])

  return (
    <div
      className={cn(
        "font-pixel flex flex-col items-center gap-6 bg-[url('/minigames/battle-opponent-bg.png')] z-[-1] bg-no-repeat bg-bottom pt-[26px] h-[220px] uppercase",
        className,
      )}
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
        <FlickeringGrid
          className="absolute top-[-15px] left-[-134px] w-[450px] h-[220px] mask-[linear-gradient(to_right,transparent_0%,black_20%,black_70%,transparent_80%)]"
          squareSize={2}
          gridGap={12}
          color="#cdaff9"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={false}
          width={400}
          height={220}
        />
        {/* {isWasFoundOpponent && <ElectricLines />} */}
      </div>
      <p className={cn(!isWasFoundOpponent && 'hidden')}>teviall</p>
    </div>
  )
}

export const FindingTheOpponentPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center font-pixel mt-4">
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
