import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>Hello "/tasks"!</Layout>
}
