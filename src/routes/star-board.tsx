import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { FallbackLoader } from '@/components/ui/fallback-loader'
import { PageLayout } from '@/components/ui/page-layout'

const StarboardPreviewSection = lazy(() =>
  import('@/components/starboard-page/starboard-preview-section').then((m) => ({
    default: m.StarboardPreviewSection,
  })),
)

const StarboardTabsSection = lazy(() =>
  import(
    '@/components/starboard-page/starboard-tabs-section/starboard-tabs-section'
  ).then((m) => ({ default: m.StarboardTabsSection })),
)

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout
      className="flex flex-col"
      classNameContent="flex flex-col flex-1 h-full"
    >
      <Suspense fallback={<FallbackLoader />}>
        <StarboardPreviewSection />
        <StarboardTabsSection />
      </Suspense>
    </PageLayout>
  )
}
