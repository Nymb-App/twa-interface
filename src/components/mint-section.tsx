import { Suspense } from 'react'

import { Skeleton } from './ui/skeleton'
import MintWidget from './mint-widget'
import { Card } from '@/components/ui/card'

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
  // Basic implementation of LazyVideo, you might want to enhance this
  return (
    <video
      src={src}
      className={className}
      style={style}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

// const MintWidget = lazy(() => import('@/components/mint-widget'))

export function MintSection() {
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
          <Suspense
            fallback={
              <Skeleton className="h-10 w-[80%] mx-auto mt-6 rounded-lg" />
            }
          >
            <MintWidget />
          </Suspense>
          <span className="mt-3 text-white/60 mx-auto">One for the wallet</span>
        </Card>
      </div>
    </section>
  )
}
