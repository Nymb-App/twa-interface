import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { StarboardPreviewSection } from '@/components/starboard-page/starboard-preview-section'
import { StarboardTabsSection } from '@/components/starboard-page/starboard-tabs-section/starboard-tabs-section'

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <StarboardPreviewSection />
      <StarboardTabsSection />
    </Layout>
  )
}
