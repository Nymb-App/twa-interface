import { lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/ui/page-layout';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

import StarBoardImage from '/starboard-img.webp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      <header className="relative flex min-h-[175px] flex-col items-center">
        <img
          src={StarBoardImage}
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
        <h1 className="font-pixel mb-10 text-center text-[24px] leading-[32px] font-[400] uppercase">
          star board
        </h1>
      </header>


      <StarboardTabsSection />
    </PageLayout>
  )
}


function StarBoardCard({
  name,
  time,
  avatarUrl,
  lvl,
  position,
}:{
  name: string,
  time: number,
  avatarUrl?: string,
  lvl?: number,
  position?: number,
}) {
  return (
    <div className='w-full rounded-2xl px-4 py-3 h-auto inline-flex items-center justify-between bg-linear-to-b from-white/0 to-white/5'>
      <div className='inline-flex items-center gap-4'>
        <Avatar className="rounded-[12px]">
          <AvatarImage src={avatarUrl ?? '/roulette-icons/default.webp'} />
          <AvatarFallback>{'ju'.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}