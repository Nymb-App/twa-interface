import { createFileRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { PageLayout } from '@/components/ui/page-layout'
import { FallbackLoader } from '@/components/ui/fallback-loader'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import TasksImage from '/tasks-img.webp'
import { useTasks } from '@/hooks/api/use-tasks'
import { TasksDaily } from '@/components/tasks-page/tasks-daily/tasks-daily'
import { TasksTabs } from '@/components/tasks-page/tasks-tabs/tasks-tabs'


// const TasksDaily = lazy(() =>
//   import('@/components/tasks-page/tasks-daily/tasks-daily').then((m) => ({
//     default: m.TasksDaily,
//   })),
// )
// const TasksTabs = lazy(() =>
//   import('@/components/tasks-page/tasks-tabs/tasks-tabs').then((m) => ({
//     default: m.TasksTabs,
//   })),
// )

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout
      className="flex flex-1 flex-col"
      classNameContent="flex flex-col flex-1 h-full px-4"
    >
      <header className="relative flex min-h-[175px] flex-col items-center">
        <img
          src={TasksImage}
          alt="preview-image"
          width={191}
          height={155}
          className="-mt-5 animate-[wiggle_3s_ease-in-out_infinite]"
        />
        <FlickeringGrid
          className="absolute inset-0 mask-[radial-gradient(ellipse_180px_100px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#b7ff01"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
          width={450}
          height={250}
        />
      </header>
      {/* <Suspense fallback={<FallbackLoader />}> */}
        <TasksDaily />
        <TasksTabs />
      {/* </Suspense> */}
    </PageLayout>
  )
}
