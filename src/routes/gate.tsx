import { LvlUpButton } from '@/components/gate-page/ui/lvl-up-button'
import { FallbackLoader } from '@/components/ui/fallback-loader'
import { PageLayout } from '@/components/ui/page-layout'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
})

const GateMainSection = lazy(() =>
  import('@/components/gate-page/gate-main-section').then((m) => ({
    default: m.GateMainSection,
  })),
)

function RouteComponent() {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <PageLayout useFooter={false} useJumpToTheNextGateButton={true}>
        <header className="relative text-center font-[400]">
          <h1 className="font-pixel mb-2 text-[24px] leading-[32px] text-[#FFFFFF] uppercase">
            gates
          </h1>
          <p className="font-inter mb-4 text-[14px] leading-[140%] text-[#FFFFFF]/60">
            Upgrade gat levels to get more rewards. <br /> Lower the level, the
            closer you are to the main <br /> reward - airdrop
          </p>
        </header>
        <GateMainSection />
        <LvlUpButton />
      </PageLayout>
    </Suspense>
  )
}
