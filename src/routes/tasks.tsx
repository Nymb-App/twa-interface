import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { FallbackLoader } from '@/components/ui/fallback-loader'

const TasksHeader = lazy(() =>
  import('@/components/tasks-page/tasks-header/tasks-header').then((m) => ({
    default: m.TasksHeader,
  })),
)
const TasksDaily = lazy(() =>
  import('@/components/tasks-page/tasks-daily/tasks-daily').then((m) => ({
    default: m.TasksDaily,
  })),
)
const TasksTabs = lazy(() =>
  import('@/components/tasks-page/tasks-tabs/tasks-tabs').then((m) => ({
    default: m.TasksTabs,
  })),
)

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout
      className="flex flex-1 flex-col"
      classNameContent="flex flex-col flex-1 h-full px-4"
    >
      <Suspense fallback={<FallbackLoader />}>
        <TasksHeader />
        <TasksDaily />
        <TasksTabs />
      </Suspense>
    </PageLayout>
  )
}
