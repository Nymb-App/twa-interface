import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Layout>Hello "/star-board"!</Layout>
}
