import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/ui/page-layout'

import { Container } from '@/components/ui/container'
import { GateHeader } from '@/components/gate-page/gate-header'
import { GateStatisticsSection } from '@/components/gate-page/gate-statistics-section'

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
})

function RouteComponent() {
  const currentLevel = 12
  return (
    <PageLayout
      useFooter={false}
      useJumpToTheNextGateLockedButton={true}
      useJumpToTheNextGateButton={false}
    >
      <Container>
        <GateHeader />
        <GateStatisticsSection currentLevel={currentLevel} />
      </Container>
    </PageLayout>
  )
}
