import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import ButtonFarming from '@/components/ui/button-farming'
import { CardContent } from '@/components/ui/card-content'
import { SwipeCard } from '@/components/swipe-card'
import { BattleCard } from '@/components/battle-card'
import ProgressSection from '@/components/home-page/progress-section'
import { Container } from '@/components/ui/container'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <ProgressSection />
      <Container>
        <div className="grid grid-cols-2 gap-2">
          <SwipeCard
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(183,_255,_0,_1)_15%,_rgba(183,_255,_0,_0.9)_30%,_rgba(183,_255,_0,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Swipes"
            description={"let's see how you react"}
          />
          <BattleCard
            className="w-full"
            classNameBg="bg-[radial-gradient(ellipse_at_center,_rgba(133,_59,_241,_1)_15%,_rgba(133,_59,_241,_0.9)_30%,_rgba(133,_59,_241,_0.4)_50%,_transparent_70%)] w-[120%] h-[110%] -top-[50%] opacity-30"
            title="Battle"
            description="are you strong enough?"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-[26px]">
          <CardContent isLocked={false} />
          <CardContent />
        </div>
        <ButtonFarming />
      </Container>
    </Layout>
  )
}
