import { createFileRoute } from '@tanstack/react-router';
import Marquee from 'react-fast-marquee';
import { useContext } from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import { WatchesIcon } from '@/assets/icons/watches';
import {
  GateContentBlock,
  GateNextDisplayBlock,
  GateProgressDisplay,
} from '@/components/gate-page/gate-header';
import { TicketIcon } from '@/assets/icons/ticket';
import { GateContext } from '@/context/gate-context';
import { cn } from '@/utils';
import { ArrowIcon } from '@/assets/icons/arrow';
import { GateStatisticsInfoBlock } from '@/components/gate-page/ui/info-block';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

export const Route = createFileRoute('/gate')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout useFooter={false} useJumpToTheNextGateButton={true}>
      <header className='relative text-center font-[400]'>
        <h1 className='font-pixel mb-2 text-[24px] leading-[32px] text-[#FFFFFF] uppercase'>
          gates
        </h1>
        <p className='font-inter mb-4 text-[14px] leading-[140%] text-[#FFFFFF]/60'>
          Upgrade gat levels to get more rewards. <br /> Lower the level, the closer you are to the
          main <br /> reward - airdrop
        </p>
      </header>
      <MainSection />
    </PageLayout>
  );
}

const MainSection = () => {
  const { year, ticket, currentLevel, isLockedNewGate } = useContext(GateContext);
  return (
    <div className='px-4'>
      <div className='relative flex items-center justify-between px-6.5 pb-[56px]'>
        <FlickeringGrid
          className='absolute -top-[120px] h-[345px] mask-[radial-gradient(ellipse_200px_200px_at_center,black,transparent)]'
          squareSize={2}
          gridGap={12}
          color='#FFFFFF'
          maxOpacity={0.7}
          flickerChance={0.3}
          autoResize={false}
          width={450}
        />
        <MarqueeVertical className='absolute top-[260px] left-1/2 h-[350px] w-[46px] -translate-x-1/2 -translate-y-1/2' />
        <GateProgressDisplay icon={<WatchesIcon />} current={year} max={1} label='years' />
        <GateNextDisplayBlock
          className='z-1 mr-4 rounded-[32px] border-2 backdrop-blur-[8px]'
          isLockedNewGate={isLockedNewGate}
          currentLevel={currentLevel}
        />
        <GateProgressDisplay
          icon={<TicketIcon className='h-[45px] w-[45px]' />}
          current={ticket}
          max={1}
          label='ticket'
        />
      </div>
      <Statistics />
    </div>
  );
};

function Statistics() {
  const { currentLevel } = useContext(GateContext);
  return (
    <section className='font-pixel relative rounded-[32px] border-1 border-white/12 bg-[#161816]/80 p-4 pt-3 text-center font-[400] backdrop-blur-[6px]'>
      <h2 className='mb-2 flex items-center justify-center text-[14px] leading-[120%] text-white/40 uppercase'>
        you on the
        <span
          className={cn(
            'px-4 text-[48px] leading-[120%] text-white',
            currentLevel > 9 && '-ml-5.5',
            currentLevel === 1 && '-ml-5.5',
          )}
        >
          {currentLevel}
        </span>
        gate level
      </h2>
      <div className='grid grid-cols-2 gap-3'>
        <GateStatisticsInfoBlock value={3600} description='Daily reward' />
        <GateStatisticsInfoBlock value={5} description='Mining' />
        <GateStatisticsInfoBlock value={2001} description='in Battle' isZeroPad={false} />
        <GateStatisticsInfoBlock
          value={2000}
          description='In Swipe'
          isZeroPad={false}
          unit='points'
        />
      </div>
    </section>
  );
}

const MarqueeVertical = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative', className)}>
      <div className='absolute size-full bg-[#B6FF00]/15 blur-[8px]' />
      <div className='absolute left-1/2 h-full w-[4px] -translate-x-1/2 bg-[#B6FF00]/15 blur-[3px]' />
      <Marquee
        speed={2}
        className='absolute top-1/2 left-1/2 !w-[350px] -translate-x-1/2 -translate-y-1/2 rotate-90'
      >
        <ArrowIcon className='h-[15px] w-[15px] rotate-180 text-[#B6FF00]' />
      </Marquee>
    </div>
  );
};

export function GateStatisticsSection() {
  const { currentLevel } = useContext(GateContext);
  return (
    <section className='relative'>
      <GateContentBlock className='font-pixel p-4 pt-3 text-center font-[400]'>
        <h2 className='mb-2 flex items-center justify-center text-[14px] leading-[120%] text-[#FFFFFF]/40 uppercase'>
          you on the
          <span
            className={cn(
              'px-4 text-[48px] leading-[120%] text-[#FFFFFF]',
              currentLevel > 9 && '-ml-5.5',
              currentLevel === 1 && '-ml-5.5',
            )}
          >
            {currentLevel}
          </span>
          gate level
        </h2>
        <div className='grid grid-cols-2 gap-3'>
          <GateStatisticsInfoBlock value={3} description='Daily reward' />
          <GateStatisticsInfoBlock value={6} description='Mining' />
          <GateStatisticsInfoBlock value={5} description='in Battle' />
          <GateStatisticsInfoBlock value={2} description='In Swipe' />
        </div>
      </GateContentBlock>
    </section>
  );
}
