import { createFileRoute } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { shareURL } from '@telegram-apps/sdk'
import { WatchesIcon } from '@/assets/icons/watches'
import EnergyIcon from '@/assets/icons/energy'
import HeaderBg from '@/assets/svg/header-bg'
import BombField from '@/components/minigames/playground'
import { PageLayout } from '@/components/ui/page-layout'
import { cn } from '@/lib/utils'
import { ActionButton } from '@/components/ui/action-button'
// import { SettingsPanel } from './settings-pannel';

export const Route = createFileRoute('/minigames/slide')({
  component: RouteComponent,
})

export function RouteComponent() {
  const defaultMinutesWinAmount = 2
  const defaultX2DoubleAmount = defaultMinutesWinAmount * 2
  const defaultX2TimerDuration = 8_000

  const [minutesWinAmount, setMinutesWinAmount] = useState<number>(2)
  const [minutesWinned, setMinutesWinned] = useState<number>(0)
  const [energy, setEnergy] = useState<number>(1200)

  // X2 time
  const [isX2Time, setX2Time] = useState<boolean>(false)
  const [x2TimerDuration, setX2TimerDuration] = useState<number>(0)

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false)
  const [isGameFinishedForce, setIsGameFinishedForce] = useState<boolean>(false)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const [pointerReach, setPointerReach] = useState<number>(80)
  const [trailingRadius, setTrailingRadius] = useState<number>(10)
  const [gameKey, setGameKey] = useState<number>(0)

  const gameStartDate = useMemo(() => Date.now() + 30_000, [isGameStarted])

  const resetGame = useCallback(() => {
    setMinutesWinAmount(defaultMinutesWinAmount)
    setMinutesWinned(0)
    setX2Time(false)
    setX2TimerDuration(0)
    setIsGameFinished(false)
    setIsGameFinishedForce(false)
    setIsGameStarted(false)
    setPointerReach(80)
    setTrailingRadius(10)
    setGameKey((prev) => prev + 1)
  }, [defaultMinutesWinAmount])

  const handleGameFinished = useCallback(() => {
    console.log(isGameStarted)
    if (isGameFinished) {
      return
    }

    if (isGameStarted) {
      setIsGameFinished(true)
      setIsGameFinishedForce(true)
    }
  }, [isGameStarted, isGameFinished])

  useEffect(() => {
    if (!isGameFinished) {
      return
    }
    if (!isX2Time) {
      return
    }

    setX2Time(false)
  }, [isGameFinished])

  useEffect(() => {
    if (energy <= 0) {
      handleGameFinished()
    }
  }, [energy])

  return (
    <PageLayout
      useFooter={false}
      className={cn('h-[calc(100vh-7.5rem)] flex flex-col overflow-hidden', isGameFinished && 'h-screen top-0')}
    >
      {/* ───────── header ───────── */}
      {!isGameFinished &&
        <header className="relative z-10 flex flex-col items-center justify-around h-16 shrink-0">
          {/* фон расширяем безопасно, чтобы не создавать горизонтальный скролл */}
          <HeaderBg className="absolute inset-0 w-full h-full scale-110" />

          <div className="relative flex items-center justify-between w-full h-full px-4">
            <div className="flex items-center justify-center w-1/3">
              <EnergyIcon />
              <span className="font-pixel text-xl text-[#B6FF00]">
                {energy}
              </span>
            </div>

            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {!isGameStarted ? <span className="font-pixel text-2xl text-white">00:30</span> :
              <Countdown
                key={'game-timer'}
                date={gameStartDate}
                intervalDelay={1000}
                precision={0}
                onComplete={() => {
                  setIsGameFinished(true);
                }}
                renderer={({ seconds }) => (
                  <span className="font-pixel text-2xl text-white">
                    00:{seconds.toString().padStart(2, "0")}
                  </span>
                )}
              />
            }

            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="flex items-center justify-center w-1/3">
              <WatchesIcon className="size-9" />
              <span className="font-pixel text-2xl text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
                {minutesWinned}
              </span>
            </div>
          </div>

          {/* Underheader with x2 time */}

          <Countdown
            key={`x2-timer-${isX2Time ? Date.now() : 'disabled'}`}
            date={x2TimerDuration}
            intervalDelay={1000}
            precision={0}
            onComplete={() => {
              setX2Time(false);
              setPointerReach(80);
              setTrailingRadius(10);
              setMinutesWinAmount(defaultMinutesWinAmount);
            }}
            renderer={({ seconds }) => (
              <div className={cn(
                'px-4 py-1 flex gap-2 items-center justify-center absolute left-1/2 -translate-x-1/2 rounded-b-2xl border-e border-b border-l border-[#343534] bg-gradient-to-b from-[#111311] to-[#1B1C1B] text-sm transition-all duration-300 -z-10',
                isX2Time ? 'translate-y-12 opacity-100' : 'opacity-0'
              )}>
                <span className='font-pixel text-xl text-[#A1A2A1]'>
                  00:0{seconds}
                </span>
                <span className='font-pixel text-xl text-[#B6FF00]'>
                  <span className='font-inter font-bold'>x</span>
                  2
                </span>
              </div>
            )}
          />

        </header>
      }

      {/* ───────── игровое поле ───────── */}
      <div className={cn("flex-1 h-[calc(100vh-12rem)]", isGameFinished && 'h-screen')}>
        <BombField
          key={gameKey}
          trailingRadius={trailingRadius}
          reach={pointerReach}
          isForcePause={isGameFinishedForce}
          onPointerUp={handleGameFinished}
          x2SpawnProbability={100}
          winAmount={minutesWinAmount}
          startCooldown={4000}
          gameDuration={34_000}
          className="w-full h-full"
          onInteractionEnter={({ item }) => {
            if (item === 'time') {
              setMinutesWinned(minutesWinned + minutesWinAmount)
              setEnergy(energy - 1)
            } else if (item === 'bomb') {
              const newEnergy = Math.floor(energy - energy * 0.1)
              setEnergy(newEnergy)
            } else if (item === 'x2') {
              if (minutesWinAmount !== defaultX2DoubleAmount) {
                setMinutesWinAmount(defaultX2DoubleAmount)
              }

              setTrailingRadius(13)
              setX2TimerDuration(Date.now() + defaultX2TimerDuration)
              setX2Time(true)
              setPointerReach(120)
            }
          }}
        />
        {!isGameStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Countdown
              date={Date.now() + 4000}
              intervalDelay={1000}
              precision={0}
              renderer={({ seconds }) => (
                <span
                  key={seconds}
                  className={cn(
                    'font-pixel text-[7.5rem] text-white [-webkit-text-stroke:3px_rgba(182,255,0,1)] [text-shadow:0px_0px_100px_rgba(182,255,0,0.4)] animate-[number-change_0.5s_ease-out]',
                    seconds === 2 && 'mr-12',
                    seconds === 1 && 'ml-12',
                  )}
                >
                  {seconds > 1 ? seconds - 1 : 'GO!'}
                </span>
              )}
              onComplete={() => {
                setIsGameStarted(true)
              }}
            />
          </div>
        )}
      </div>

      {isGameFinished && (
        <GameFinished
          minutesWinned={minutesWinned}
          useRestart={energy > 0}
          onRestart={resetGame}
          onShare={() => {
            if (shareURL.isAvailable()) {
              const telegramLink =
                import.meta.env.VITE_TELEGRAM_APP_LINK ||
                'https://telegram-apps.com'
              shareURL(
                telegramLink,
                `Check out my score in the game! ${minutesWinned} in 30 seconds. I'm playing with @nymb_bot`,
              )
            }
          }}
        />
      )}

      <style>{`
        @keyframes number-change {
          0% { opacity: 0; transform: scale(1.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </PageLayout>
  )
}

function GameFinished({
  minutesWinned = 0,
  useRestart = true,
  onRestart,
  onShare,
  className,
}:{
  useRestart?: boolean,
  minutesWinned?: number,
  onRestart?: () => void,
  onShare?: () => void,
  className?: string,
}) {
  return (
    <div className={cn('absolute inset-0 flex flex-col items-center justify-between font-pixel bg-black/30 z-50', className)}>
      <header className='relative w-full h-[310px] top-20'>
        <img
          src={'/minigames/winning-stars.png'}
          className='w-full h-auto p-6 object-cover bg-blend-lighten absolute'
        />

        <div className="relative overflow-hidden size-[104px] rounded-[36px] left-1/2 top-[100px] -translate-x-1/2 shadow-[0_0px_50px_rgba(182,_255,_0,_0.3)]">
          <img
            src={'/roulette-icons/default.png'}
            className="w-full h-auto object-cover absolute"
          />
          <h2 className="absolute left-1/2 top-1/2 -translate-1/2 text-3xl text-white font-bold">
            NA
          </h2>
        </div>

        <div className="relative flex flex-col gap-2 items-center justify-center top-[110px]">
          <h2 className="relative font-pixel text-xl text-white text-center">
            ABSOLUTE
            <br />
            CHAMPION!
          </h2>
          <h3 className="relative font-inter text-sm text-white/50 text-center">
            You showed everyone how to play!
          </h3>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center gap-1">
        <h2 className="font-inter text-sm text-white/50">Your reward:</h2>
        <div className="inline-flex items-center justify-center">
          <WatchesIcon className="size-10" />
          <div className="inline-flex items-baseline gap-1">
            <h1 className="font-pixel text-4xl text-white [-webkit-text-stroke:1px_rgba(182,255,0,1)] [text-shadow:0px_0px_10px_rgba(182,255,0,1)]">
              {minutesWinned}
            </h1>
            <span className="text-sm text-white/50">MIN</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-full px-4 pb-10">
        <ActionButton
          onClick={onShare}
          className="text-black bg-gradient-to-b from-white to-[#999999] active:from-[#999999] active:to-[#535353] disabled:from-[#999999] disabled:to-[#535353] disabled:cursor-not-allowed"
        >
          SHARE AND GET +20%
        </ActionButton>

        {useRestart && (
          <ActionButton
            onClick={onRestart}
            className="text-black active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed"
          >
            PLAY MORE
          </ActionButton>
        )}
      </div>
    </div>
  )
}
