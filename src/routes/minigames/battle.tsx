import { createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import {
  BattlePreviewScreen,
  BattleTitle,
} from '@/components/battle-page/battle-preview-screen'
import { PageLayout } from '@/components/ui/page-layout'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { GameBoardScreen } from '@/components/battle-page/battle-gameboard-screen'
import { BattleResultGameScreen } from '@/components/battle-page/battle-result-game-screen'
import { AppContext } from '@/context/app-context'
import { BattleResultGameBg } from '@/components/battle-page/battle-result-game-bg'
import { BattleAnimatedMiddleLine } from '@/components/battle-page/battle-animated-middle-line'
import { BattleCard } from '@/components/battle-page/opponent-battle-card'
import { CountdownStartGame } from '@/components/minigames/countdown-start-game'
import { BattleAnimatedBoostButton } from '@/components/battle-page/battle-animated-boost-button'
import { BattlePushIcon } from '@/assets/icons/battle-push'
import { BattleScene } from '@/components/battle-page/battle-scene'

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
  // const [isFinalAnimationBeforeGame, setIsFinalAnimationBeforeGame] =
  // useState(false)
  const [isTranslateCardsAnimationStart, setIsTranslateCardsAnimationStart] =
    useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = '#03061a'
    return () => {
      document.body.style.backgroundColor = '#121312'
    }
  }, [])

  useEffect(() => {
    setIsTranslateCardsAnimationStart(false)
  }, [isGameFinished])

  const [isMorphAnimation, setIsMorphAnimation] = useState(false)
  const [isClosingAnimation, setIsClosingAnimation] = useState(false)
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false)
  const [isOpeningAnimationDelayed, setIsOpeningAnimationDelayed] =
    useState(false)
  const [isCountdownCompleted, setIsCountDownCompleted] = useState(false)

  useEffect(() => {
    if (!isStartFindingOpponent) return
    setTimeout(() => {
      setIsClosingAnimation(true)
    }, 1000)
  }, [isStartFindingOpponent])

  useEffect(() => {
    if (!isOpeningAnimation) return
    setTimeout(() => {
      setIsOpeningAnimationDelayed(true)
    }, 5000)
  }, [isOpeningAnimation])

  // useEffect(() => {
  //   if (!isCountdownCompleted) return
  //   setTimeout(() => {
  //     setIsLoser(true)
  //   }, 3000)
  // }, [isCountdownCompleted])

  const isBoostActive = false

  return (
    <PageLayout
      useFooter={false}
      className="flex flex-col justify-between bg-transparent pb-0"
      classNameContent="flex flex-col justify-between flex-1"
    >
      <IntroScene onFindingOpponent={() => setIsStartFindingOpponent(true)} />
      <MainScene />
      <ResultScene />
    </PageLayout>
  )
}

const IntroScene = ({
  onFindingOpponent,
}:{
  onFindingOpponent?: () => void,
}) => {

  return (
    <BattlePreviewScreen
      onClick={onFindingOpponent}
    />
  )
}

const MainScene = () => {
  return (
    <>
    <header
      className={cn(
        'font-pixel font-[400] text-center',
        // isFinalAnimationBeforeGame &&
        // '!animate-battle-finding-button-fade-out',
        isTranslateCardsAnimationStart && 'hidden',
      )}
    >
      <BattleTitle
        className={'opacity-0 animate-battle-preview-title-fade'}
        text={
          !isMorphAnimation
            ? 'Finding the opponent'
            : 'An opponent was found'
        }
      />
    </header>
    <div className="flex flex-col gap-2 justify-between flex-1">
      <div className="relative flex flex-col h-full flex-1 items-center justify-between mask-[linear-gradient(to_bottom,transparent_0%,black_1%,black_99%,transparent_100%)]">
        <BattleCard
          nickname="igorivanov"
          isMe={false}
          isRow={isMorphAnimation}
          isBgVisible={!isOpeningAnimation}
          className={cn(
            'transition-all duration-5000',
            isClosingAnimation &&
            !isOpeningAnimation &&
            'flex-1 min-h-[220px]',
            isOpeningAnimation && 'h-[54px]',
          )}
          classNameBg={cn(
            'transition-all duration-3000 delay-1500',
            isOpeningAnimation && 'opacity-0',
          )}
        />
        {isOpeningAnimationDelayed && !isCountdownCompleted && (
          <CountdownStartGame
            onComplete={() => {
              setIsCountDownCompleted(true)
              // setIsCountdownStarted(false)
              // setAutoClick(true)
            }}
          />
        )}

        {isCountdownCompleted && <BattleScene />}

        <BattleAnimatedMiddleLine
          className={cn(
            'absolute top-1/2 left-1/2 -translate-1/2 z-1 w-[calc(100%-50px)] opacity-0 animate-battle-finding-versus-fade',
          )}
          classNameForLine={cn(
            'opacity-0',
            isClosingAnimation &&
            'animate-battle-finding-line-width-fade-in-out',
          )}
          onAnimationEnd={() => {
            setIsClosingAnimation(false)
            setIsMorphAnimation(true)
            setIsOpeningAnimation(true)
          }}
        />
        <BattleCard
          nickname="tevial"
          isRow={isMorphAnimation}
          isBgVisible={!isOpeningAnimation}
          className={cn(
            'transition-all duration-5000 w-full h-[220px]',
            isClosingAnimation &&
            !isOpeningAnimation &&
            'flex-1 min-h-[220px]',
            isOpeningAnimation && 'h-[54px]',
          )}
          classNameBg={cn(
            'transition-all duration-3000 delay-1500',
            isOpeningAnimation && 'opacity-0',
          )}
        />
      </div>
      <div
        className={cn(
          'transition-all duration-4000 delay-1500 h-0',
          isOpeningAnimation && 'h-[200px]',
        )}
      >
        {isCountdownCompleted && (
          <div className="flex justify-evenly items-center h-full">
            <BattleAnimatedBoostButton
            // onBoostActivate={() => setIsLeftBoostActive(true)}
            // isBoostActive={isLeftBoostActive}
            // setIsBoostDisable={() => setIsLeftBoostDisable(true)}
            // resetBoost={() => {
            // setLeftBoostfillPercentage(0)
            // setIsLeftBoostActive(false)
            // setIsLeftBoostDisable(false)
            // }}
            // boostReady={leftBoostfillPercentage === 100}
            // fillPercentage={leftBoostfillPercentage}
            />
            {/* {isCountdownStarted ? ( */}
            <BattlePushIcon />
            <BattleAnimatedBoostButton />
            {/* ) : ( */}
            {/* <BattleAnimatedPushButton
                  handleClick={handleClick}
                  leftBoostFillPercentage={leftBoostfillPercentage}
                  rightBoostFillPercentage={rightBoostfillPercentage}
                  setLeftBoostfillPercentage={setLeftBoostfillPercentage}
                  setRightBoostfillPercentage={setRightBoostfillPercentage}
                /> */}
            {/* )} */}
            {/* {!isCountdownStarted && isBuyTurboBoost ? (
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
              )} */}
          </div>
        )}
        {isLoser && (
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
      </div>
    </div>
    {/* <div
      className={cn(
        'fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#03061a]',
        !isAnimationsEnd && 'pointer-events-none',
        !isMorphAnimation
          ? 'opacity-0 animate-battle-finding-button-fade-in'
          : 'animate-battle-finding-button-fade-out pointer-events-none',
      )}
      onAnimationEnd={() => setIsAnimationsEnd(true)}
    > */}
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
    {/* </div> */}
    </>
  );
}

const ResultScene = () => {
  return (
    <BattleResultGameScreen
      rewardTimeValue={battleGameRewardRadioValue.split(' ')[0]}
      rewardTimeLabel={battleGameRewardRadioValue.split(' ')[1]}
    />
  )
}
