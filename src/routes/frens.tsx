import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy, useState } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { FallbackLoader } from '@/components/ui/fallback-loader'

export const Route = createFileRoute('/frens')({
  component: RouteComponent,
})

const FrensHeader = lazy(() =>
  import('@/components/frens-page/frens-header').then((m) => ({
    default: m.FrensHeader,
  })),
)

const TotalEarningsBlock = lazy(() =>
  import('@/components/frens-page/total-earnings-block').then((m) => ({
    default: m.TotalEarningsBlock,
  })),
)

const ReferralsLevelsBlock = lazy(() =>
  import('@/components/frens-page/referrals-levels-block').then((m) => ({
    default: m.ReferralsLevelsBlock,
  })),
)

const ReferralsCodeList = lazy(() =>
  import('@/components/frens-page/referrals-code-list').then((m) => ({
    default: m.ReferralsCodeList,
  })),
)

const ReferralsMembersList = lazy(() =>
  import('@/components/frens-page/referrals-members-list').then((m) => ({
    default: m.ReferralsMembersList,
  })),
)

function RouteComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)
  const [isClaimEnd, setIsClaimEnd] = useState(false)

  const totalEarnings = 1610000

  return (
    <PageLayout>
      <Suspense fallback={<FallbackLoader />}>
        <FrensHeader
          isClaimStart={isClaimStart}
          isClaimEnd={isClaimEnd}
          setIsClaimEnd={setIsClaimEnd}
        />
        <Container>
          <TotalEarningsBlock
            totalEarnings={!isClaimEnd ? totalEarnings : 0}
            isClaimStart={isClaimStart}
            setIsClaimStart={setIsClaimStart}
          />
          <ReferralsLevelsBlock />
          <ReferralsCodeList />
          <ReferralsMembersList meTime={7400} />
        </Container>
      </Suspense>
    </PageLayout>
  )
}
