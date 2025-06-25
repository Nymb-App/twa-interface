import { useEffect, useRef, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTonAddress } from '@tonconnect/ui-react';
import { isAndroid } from 'react-device-detect';
import { useAuth } from '@/hooks/api/use-api';
import { useMint } from '@/hooks/use-mint';
import { Card } from '@/components/ui/card';
import { ConnectButton, DisconnectButton, MintButton } from '@/components/ui/mint-button';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { PageLayout } from '@/components/ui/page-layout';
import { cn } from '@/utils';

import SwipeAnimationLottie from '@/assets/lottie/swipe2.json';
import { TasksIcon } from '@/assets/icons/tasks';
import { StatisticsIcon } from '@/assets/icons/statistics';
import { SocialIcon } from '@/assets/icons/social'
import { SwipeCard } from '@/components/swipe-card';
import { GameCard } from '@/components/game-card';
import { BattleCard } from '@/components/battle-card';



export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [isAnimationCountdownFinished, setAnimationCountdownFinished] =
    useState<boolean>(false)
  const [
    isAnimationCountdownCooldownFinished,
    setAnimationCountdownCooldownFinished,
  ] = useState<boolean>(false)
  const { isAuthTokenValid, authorize } = useAuth()

  useEffect(() => {
    if (isAuthTokenValid) return
    ;(async () => {
      await authorize()
    })()
  }, [authorize, isAuthTokenValid])

  useEffect(() => {
    const timerId0 = setTimeout(() => {
      setAnimationCountdownFinished(true)
    }, 5000)
    const timerId1 = setTimeout(() => {
      setAnimationCountdownCooldownFinished(true)
    }, 5500)

    return () => {
      clearTimeout(timerId0)
      clearTimeout(timerId1)
    }
  }, [])

  return (
    <PageLayout useFooter={false}>
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)] duration-500',
          // isAnimationCountdownFinished && 'h-[300px]'
        )}
      />
      <div
        className={cn(
          'absolute size-full duration-700 overflow-clip',
          isAnimationCountdownFinished && 'h-[250px]',
        )}
      >
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full left-3"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={0.5}
          flickerChance={0.3}
          autoResize={!isAnimationCountdownFinished}
          width={450}
        />

        <div
          className={cn(
            'absolute size-full bg-gradient-to-b from-transparent from-50% to-[#121312]',
          )}
        />
        <div
          className={cn(
            'absolute size-full bg-gradient-to-b from-[#121312] to-transparent to-[50%]',
          )}
        />
        <div
          className={cn(
            'absolute size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)]',
          )}
        />
        <iframe
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] border-none outline-none duration-700',
            isAnimationCountdownFinished && 'scale-75',
          )}
          src="https://rive.app/s/kxIqyPB440W_N6jMnHDnCw/embed?runtime=rive-renderer&fit=cover"
        />
      </div>
      {isAnimationCountdownCooldownFinished && (
        <div className="flex flex-col gap-12">
          <HeroSection />
          <MintSection />
        </div>
      )}
    </PageLayout>
  )
}

function MintSection() {
  const address = useTonAddress();
  const { mintProgress } = useMint();

  const [isConnectHidden, setConnectHidden] = useState<boolean>(false);
  const [isDisconnectHidden, setDisconnectHidden] = useState<boolean>(false);

  useEffect(() => {
    if (mintProgress && mintProgress.isEarlyAccessMinted) {
      setConnectHidden(true);
    } else {
      if (address) {
        setConnectHidden(false);
      } else {
        setConnectHidden(true);
      }
    }
  }, [
    mintProgress,
    address,
  ]);

  useEffect(() => {
    if (mintProgress && mintProgress.isEarlyAccessMinted) {
      setDisconnectHidden(true);
    } else {
      if (!address) {
        setDisconnectHidden(true);
      } else {
        setDisconnectHidden(false);
      }
    }
  }, [
    mintProgress,
    address,
  ]);

  return (
    <section className="relative text-white px-3">
      <div className="animate-slide-up-fade-3">
        <h2 className="font-pixel text-2xl text-center">BE ONE OF</h2>
        <h2 className="font-pixel text-2xl text-center">THE BEST ALREADY</h2>
      </div>
      <div className="animate-slide-up-fade-4">
        <h3 className="text-white/60 text-sm text-center mt-2">
          Get the best deals and benefits
        </h3>
        <h3 className="text-white/60 text-sm text-center">along the way</h3>
      </div>
      <div className="inline-flex w-full gap-2 mt-6 animate-slide-up-fade-5">
        <Card className="w-full flex flex-col bg-[#161715]">
          <div className="relative">
            <LazyVideo
              className="mx-auto"
              src="/webm/nft.mp4"
              poster="/webm/mint-video-placeholder.png"
            />
            <div className="absolute w-full h-[90px] bg-gradient-to-b from-[#0b0b0b]/50 from-20% to-[#161715] pointer-events-none -bottom-1" />
          </div>

          <div className="inline-flex gap-2 items-center font-pixel mx-auto text-[#B6FF00] z-10 -mt-11">
            <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
              45%
            </h2>
            <div className="flex flex-col text-sm">
              <span>ALREADY</span>
              <span>MINTED</span>
            </div>
          </div>

          {isConnectHidden 
            ? <MintButton className="mt-6 w-[80%] mx-auto" /> 
            : <ConnectButton className="mt-6 w-[80%] mx-auto" />
          }
          
          {!isDisconnectHidden &&
            <DisconnectButton
              className="mt-2 w-[80%] mx-auto"
            />
          }
          <span className="mt-3 text-white/60 mx-auto">
            One for the wallet
          </span>
        </Card>
      </div>
    </section>
  )
}

function HeroSection() {
  return (
    <section className="relative mt-48 text-2xl text-white px-3">
      <h2 className="font-pixel text-center animate-slide-up-fade-0">
        WHAT AWAITS YOU
      </h2>

      <div className="flex flex-col gap-2">
        <Link to="/home" className="text-white z-50 text-xl">
          Home
        </Link>
      </div>

      <div className="inline-flex justify-between gap-2 w-full mt-7 animate-slide-up-fade-1">
        {isAndroid ? (
          <SwipeCard
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
          />
        ) : (
          <GameCard
            delay={1000}
            placeholderSrc="/lottie-placeholder/minigames/slide.png"
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
            title="Swipes"
            description={"let's see how"}
            subdescription="you react"
            animationData={SwipeAnimationLottie}
          />
        )}

        <BattleCard
          className="w-full"
          classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
          title="Battle"
          description="are you strong"
          subdescription="enough?"
        />
      </div>
      <div className="inline-flex w-full gap-2 mt-2 animate-slide-up-fade-2">
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <TasksIcon className="size-8" />
            <span className="text-xs text-white/60">Tasks</span>
          </div>
        </Card>
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <SocialIcon className="size-8" />
            <span className="text-xs text-white/60">Referals</span>
          </div>
        </Card>
        <Card className="w-full aspect-square flex justify-center">
          <div className="flex flex-col justify-center items-center gap-2 mt-5">
            <StatisticsIcon className="size-8" />
            <span className="text-xs text-white/60">Star Board</span>
          </div>
        </Card>
      </div>
    </section>
  )
}

function LazyVideo({
  src,
  className,
  style,
  poster,
}: {
  src?: string
  className?: string
  style?: React.CSSProperties
  poster?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isIntersecting, setIntersecting] = useState(false)

  // 1) Настраиваем IntersectionObserver
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Чтобы browser заранее загрузил видео для плавного старта
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.loop = true

    const obs = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.5 }, // как только 50% ролика в зоне — считаем видимым
    )

    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  // 2) Следим за видимостью таба/окна
  useEffect(() => {
    const handleVis = () => {
      const video = videoRef.current
      if (!video) return
      if (document.visibilityState === 'hidden') {
        video.pause()
      } else if (isIntersecting) {
        video.play().catch(() => {
          /* игнорим блок автоплея */
        })
      }
    }

    document.addEventListener('visibilitychange', handleVis)
    return () => document.removeEventListener('visibilitychange', handleVis)
  }, [isIntersecting])

  // 3) Запускаем или ставим на паузу при смене isIntersecting
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isIntersecting && document.visibilityState === 'visible') {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isIntersecting])

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={cn('rounded-2xl', className)}
      src={src}
      style={style}
      playsInline
      preload="auto"
      autoPlay
      loop
      muted
    />
  )
}