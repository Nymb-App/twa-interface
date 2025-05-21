import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/ui/page-layout'

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PageLayout>Hello tasks</PageLayout>
}
