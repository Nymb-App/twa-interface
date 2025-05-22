import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/send-gift')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/send-gift"!</div>
}
