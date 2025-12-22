// import { HeroSection } from '@/components/hero-section'
import { MintSection } from '@/components/mint-section'
import { PageLayout } from '@/components/ui/page-layout'
import { createFileRoute } from '@tanstack/react-router'
// import { useAuth } from '@/hooks/api/use-api'
// import { useEffect } from 'react'
// import { AnimationStartOverlay } from '@/components/animation-start-overlay'
// import { FlickeringGrid } from '@/components/magicui/flickering-grid'
// import { cn } from '@/lib/utils'

export const Route = createFileRoute('/giveaway')({
  component: App,
})

function App() {
  // Legacy, delete after all approvals
  // const [isAppStarted, setAppStarted] = useState<boolean>(false)
  // const [isAnimationCountdownFinished, setAnimationCountdownFinished] =
  //   useState<boolean>(false)
  // const [
  //   isAnimationCountdownCooldownFinished,
  //   setAnimationCountdownCooldownFinished,
  // ] = useState<boolean>(false)
  // const { login, isAuthenticated } = useAuth()

  // useEffect(() => {
  //   if (isAuthenticated) return
  //   ;(async () => {
  //     await login()
  //   })()
  // }, [login, isAuthenticated])

  // Legacy, delete after all approvals
  // useEffect(() => {
  //   if (!isAppStarted) return
  //   const timerId0 = setTimeout(() => {
  //     setAnimationCountdownFinished(true)
  //   }, 5000)
  //   const timerId1 = setTimeout(() => {
  //     setAnimationCountdownCooldownFinished(true)
  //   }, 5500)

  //   return () => {
  //     clearTimeout(timerId0)
  //     clearTimeout(timerId1)
  //   }
  // }, [isAppStarted])

  // useEffect(() => {
  //   document.documentElement.style.overflow = 'hidden'

  //   if (isAppStarted && isAnimationCountdownFinished) {
  //     document.documentElement.style.overflow = 'auto'
  //   }

  //   return () => {
  //     document.documentElement.style.overflow = 'auto'
  //   }
  // }, [isAppStarted, isAnimationCountdownFinished])

  return (
    <PageLayout
      className="top-20 min-h-screen"
      classNameContent="!overflow-y-hidden overflow-x-hidden px-4"
      useFooter={false}
    >
      {/* {!isAppStarted && (
        <AnimationStartOverlay onStart={() => setAppStarted(true)} />
      )}
      {isAppStarted && (
        <>
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

            <div className="absolute size-full bg-linear-to-b from-transparent from-50% to-[#121312]" />
            <div className="absolute size-full bg-linear-to-b from-[#121312] to-transparent to-50%" />
            <div className="absolute size-full bg-[radial-gradient(ellipse_at_center,transparent_50%,#121312_95%)]" />
            <iframe
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] border-none outline-none duration-700',
                isAnimationCountdownFinished && 'scale-75',
              )}
              src="https://rive.app/s/kxIqyPB440W_N6jMnHDnCw/embed?runtime=rive-renderer&fit=cover"
            />
          </div>
        </>
      )}
      {isAppStarted && isAnimationCountdownCooldownFinished && ( */}
      <div className="flex flex-col gap-12">
        {/* <HeroSection /> */}
        <MintSection />
      </div>
      {/* )} */}
    </PageLayout>
  )
}
