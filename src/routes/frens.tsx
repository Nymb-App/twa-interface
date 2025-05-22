import { createFileRoute } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'

export const Route = createFileRoute('/frens')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <header className="relative w-full font-pixel font-[400] px-3 bg-[url('/frens-bg.png')] bg-no-repeat bg-bottom pb-6">
        <h1 className="text-center text-[24px] leading-8 uppercase mb-6">
          Invite frens <br /> and get more time
        </h1>
        <p className="font-inter text-center text-[14px] text-[#FFFFFF99] leading-[140%] mb-2">
          Total Earnings:
        </p>
        <Countdown
          date={Number(Date.now() + 443345)}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      </header>
      <Container>
        <div>Hello "/frens"!</div>
      </Container>
    </PageLayout>
  )
}
