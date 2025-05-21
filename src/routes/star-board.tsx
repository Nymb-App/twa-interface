import { createFileRoute } from '@tanstack/react-router'
import { StarboardPreviewSection } from '@/components/starboard-page/starboard-preview-section'
import { StarboardTabsSection } from '@/components/starboard-page/starboard-tabs-section/starboard-tabs-section'
import { PageLayout } from '@/components/ui/page-layout'

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <StarboardPreviewSection />
      <StarboardTabsSection />
    </PageLayout>
  )
}
