import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>Hello "/gate"!</Layout>
}
