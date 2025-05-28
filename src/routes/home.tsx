import { createFileRoute } from '@tanstack/react-router'
import { isAndroid } from 'react-device-detect'
import { useState } from 'react'
import { FarmingButton } from '@/components/ui/button-farming'
import { CardContent } from '@/components/ui/card-content'
import { SwipeCard } from '@/components/swipe-card'
import { BattleCard } from '@/components/battle-card'
import ProgressSection from '@/components/home-page/progress-section'
import { Container } from '@/components/ui/container'
import { GameCard } from '@/components/game-card'
import SwipeAnimationLottie from '@/assets/lottie/swipe2.json'
import { PageLayout } from '@/components/ui/page-layout'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)
  const [isClaimEnd, setIsClaimEnd] = useState(false)

  return (
    <PageLayout>
      <ProgressSection
        isClaimStart={isClaimStart}
        isClaimEnd={isClaimEnd}
        setIsClaimEnd={setIsClaimEnd}
      />
      <Container className="mt-5">
        <div className="grid grid-cols-2 gap-2">
          {isAndroid ? (
            <SwipeCard
              className="w-full font-pixel font-[400]"
              classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
              title="Swipes"
              description={"let's see how you react"}
            />
          ) : (
            <GameCard
              delay={1000}
              placeholderSrc="/lottie-placeholder/minigames/slide.png"
              className="w-full font-pixel font-[400]"
              classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[130%] -top-[50%] opacity-20"
              title="Swipes"
              description={"let's see how you react"}
              animationData={SwipeAnimationLottie}
            />
          )}
          <BattleCard
            className="w-full font-pixel"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Battle"
            description="are you strong enough?"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-[26px] mt-2">
          <CardContent isLocked={false} />
          <CardContent />
        </div>
        <FarmingButton
          className="w-full"
          setIsClaimStart={setIsClaimStart}
          setIsClaimEnd={setIsClaimEnd}
        />
      </Container>
    </PageLayout>
  )
}
