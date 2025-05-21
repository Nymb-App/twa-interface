import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/minigames/battle')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/minigames/battle"!</div>
}
