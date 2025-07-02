import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/ui/page-layout';
import { Container } from '@/components/ui/container';
import { TasksHeader } from '@/components/tasks-page/tasks-header/tasks-header';
import { TasksDaily } from '@/components/tasks-page/tasks-daily/tasks-daily';
import { TasksTabs } from '@/components/tasks-page/tasks-tabs/tasks-tabs';

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout className='flex flex-1 flex-col' classNameContent='flex flex-col flex-1 h-full'>
      <Container className='flex flex-1 flex-col'>
        <TasksHeader />
        <TasksDaily />
        <TasksTabs />
      </Container>
    </PageLayout>
  );
}
