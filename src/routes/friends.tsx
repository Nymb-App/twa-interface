import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>Hello "/friends"!</Layout>
}
