import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/ui/page-layout'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout useFooter={false}>
      <div className="text-white">Hello "/minigames/battle"!</div>
    </PageLayout>
  )
}
