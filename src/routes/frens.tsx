import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy, useMemo, useState } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { FallbackLoader } from '@/components/ui/fallback-loader'
import { useAccountMe } from '@/hooks/api/use-account'
import { convertTimestampToDaysUnit } from '@/utils'

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

  const { accountQuery } = useAccountMe()

  const accountClaimTime = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.claimTime) return 0
    return accountQuery.data.claimTime
  }, [accountQuery.data])

  const accountGiftTime = useMemo(() => {
    if (!accountQuery.data || !accountQuery.data.time) return 0

    const convertedTime = accountQuery.data.time * 1000 - Date.now()

    return convertedTime > 0 ? Math.floor(convertedTime / 1000) : 0
  }, [accountQuery.data])

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
            value={
              !isClaimEnd ? convertTimestampToDaysUnit(accountClaimTime) : 0
            }
            isClaimStart={isClaimStart}
            setIsClaimStart={setIsClaimStart}
          />
          <ReferralsLevelsBlock />
          <ReferralsCodeList />
          <ReferralsMembersList meTime={accountGiftTime} />
        </Container>
      </Suspense>
    </PageLayout>
  )
}
