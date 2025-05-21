import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/ui/page-layout'

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageLayout>Hello "/friends"!</PageLayout>
}
