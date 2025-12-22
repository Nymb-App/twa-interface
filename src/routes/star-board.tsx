import { lazy, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/ui/page-layout';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

import StarBoardImage from '/starboard-img.webp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Countdown, { zeroPad } from 'react-countdown';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import useSound from 'use-sound';

const StarboardTabsSection = lazy(() =>
  import(
    '@/components/starboard-page/starboard-tabs-section/starboard-tabs-section'
  ).then((m) => ({ default: m.StarboardTabsSection })),
)

export const Route = createFileRoute('/star-board')({
  component: RouteComponent,
})

const formatDuration = (totalMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));

  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
  const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
  const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY;
  const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY; // без високосных

  let remaining = totalSeconds;

  const years = Math.floor(remaining / SECONDS_IN_YEAR);
  remaining %= SECONDS_IN_YEAR;

  const weeks = Math.floor(remaining / SECONDS_IN_WEEK);
  remaining %= SECONDS_IN_WEEK;

  const days = Math.floor(remaining / SECONDS_IN_DAY);
  remaining %= SECONDS_IN_DAY;

  const hours = Math.floor(remaining / SECONDS_IN_HOUR);
  remaining %= SECONDS_IN_HOUR;

  const minutes = Math.floor(remaining / SECONDS_IN_MINUTE);
  const seconds = remaining % SECONDS_IN_MINUTE;

  return {
    years,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
};


function RouteComponent() {
  const lvlList = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1).reverse(), []);
  const [play] = useSound('/sounds/Button.aac');

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
        <h1 className="font-pixel mb-10 text-center text-2xl uppercase">
          star board
        </h1>
      </header>


      <Tabs
        defaultValue={'12'}
        className='flex flex-col flex-1'
        onValueChange={() => play()}
      >
        <TabsList className="inline-flex gap-2 items-center justify-center">
          {lvlList.map(lvl => 
          <TabsTrigger
            key={lvl}
            className="font-pixel rounded-full text-xs leading-[120%] px-4 py-2 bg-white/10 text-white data-[state=active]:bg-[#B6FF00] data-[state=active]:text-black"
            value="completed-tasks"
          >
            {lvl} GATE
          </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="new-tasks" className="mt-7">
          <h2 className="text-base font-pixel text-white">TASKS</h2>
          <div className="mt-3">
            {/* {isLoading && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TaskCardSkeleton key={index} />
                ))}
              </>
            )}

            {!isLoading && progressTasks.length === 0 && (
              <EmptyStateCard title="All tasks" description="completed" />
            )} */}

            {/* {progressTasks.map((task) => (
              <TaskCard
                key={task.name}
                name={task.name}
                description={task.description}
                reward={task.reward}
                status={task.status}
                onClick={(name) => handleTaskAction(name)}
              />
            ))} */}
          </div>
        </TabsContent>
      </Tabs>
      {/* <StarBoardCard
        name="nice_arti"
        time={0}
        position={0}
        lvl={12}
      /> */}
      {/* <StarboardTabsSection /> */}
    </PageLayout>
  )
}


function StarBoardCard({
  name,
  time,
  avatarUrl,
  lvl,
  position,
}: {
  name: string,
  time: number,
  position: number,
  avatarUrl?: string,
  lvl?: number,
}) {
  const p = position < 1 ? 1 : position;
  return (
    <div className='w-full rounded-2xl px-4 py-3 h-auto inline-flex items-center justify-between bg-linear-to-b from-white/0 to-white/5'>
      <div className='inline-flex items-center gap-4'>
        <Avatar className="relative size-8 rounded-[12px]">
          <AvatarImage src={avatarUrl ?? '/roulette-icons/default.webp'} />
          <span className='font-pixel text-xs absolute left-1/2 top-1/2 -translate-1/2'>NA</span>
        </Avatar>

        <div className='flex flex-col'>
          <span className='text-white font-semibold text-base'>{name}</span>
          {
            time * 1000 <= Date.now() ?
              <div className="font-pixel text-xs inline-flex font-normal text-white/60">
                <span>000</span>:
                <span>00</span>:
                <span>00</span>:
                <span>00</span>:
                <span>00</span>:
                <span>00</span>
              </div>
              :
              <Countdown
                date={time}
                intervalDelay={1000}
                renderer={({ total }) => {
                  const {
                    years,
                    weeks,
                    days,
                    hours,
                    minutes,
                    seconds,
                  } = formatDuration(total);

                  return (
                    <div className="font-pixel text-xs inline-flex font-normal text-white/60">
                      <span className={cn(years > 0 && 'text-[#B6FF00]')}>{zeroPad(years, 3)}</span>:
                      <span className={cn(weeks > 0 && 'text-[#B6FF00]')}>{zeroPad(weeks, 2)}</span>:
                      <span className={cn(days > 0 && 'text-[#B6FF00]')}>{zeroPad(days, 2)}</span>:
                      <span className={cn(hours > 0 && 'text-[#B6FF00]')}>{zeroPad(hours, 2)}</span>:
                      <span className={cn(minutes > 0 && 'text-[#B6FF00]')}>{zeroPad(minutes, 2)}</span>:
                      <span className={cn(seconds > 0 && 'text-[#B6FF00]')}>{zeroPad(seconds, 2)}</span>
                    </div>
                  )
                }}
              />
          }
        </div>
      </div>

      <div className='flex flex-col justify-center items-end'>
        <span className='text-white/60 font-pixel text-xs text-left'>{lvl} GATE</span>
        <span className={cn(
          'text-white/60 text-sm text-left',
          p === 1 && 'text-[#FFC800]',
          p === 2 && 'text-[#C4C4C4]',
          p === 3 && 'text-[#C47A49]',
        )}>#{p}</span>
      </div>
    </div>
  );
}