import { Link, createFileRoute } from '@tanstack/react-router'
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { PageLayout } from '@/components/ui/page-layout';
import { TELEGRAM_APP_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth-error')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout
      className='top-0 min-h-screen w-full max-w-full relative'
      classNameContent='absolute size-full'
      useFooter={false}
    >
      <div className='absolute size-full overflow-hidden'>
        <FlickeringGrid
          className='absolute inset-0 w-full h-full mask-[radial-gradient(ellipse_50%_50%_at_center,black,transparent)]'
          squareSize={2}
          gridGap={12}
          color='#b7ff01'
          maxOpacity={1}
          flickerChance={0.2}
          autoResize={true}
        />
      </div>

      <div className='relative top-1/3 -translate-y-1/2 flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-2xl font-bold'>
          Open App in Telegram
        </h1>
        <img
          className='mt-8 size-52 rounded-lg'
          src='/web-app-qr.png'
          alt='Auth QR'
        />

        <Link
          className='w-full max-w-[212px]'
          to={TELEGRAM_APP_URL}
          target='_blank'
        >
          <Button variant={'nymb-green'} className='w-full h-14'>
            <span className='mix-blend-difference'>OPEN APP</span>
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
}
