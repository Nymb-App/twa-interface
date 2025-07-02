import { createFileRoute } from '@tanstack/react-router';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import { useRef, useState } from 'react';
import type { AnimationEventHandler } from 'react';
import { PageLayout } from '@/components/ui/page-layout';
import { cn } from '@/utils';
import { GateElectricLines } from '@/components/ui/gate-electric-lines';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { GateInfoBlockNextLvl } from '@/components/gate-page/ui/info-block';

export const Route = createFileRoute('/unlock-gate')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isStartAnimation, setIsStartAnimation] = useState(true);

  return (
    <PageLayout
      useFooter={false}
      useUnlockGateCloseButton={!isStartAnimation}
      className='flex flex-col'
      classNameContent='relative flex-1 overflow-hidden'
    >
      <div
        className={cn(
          'absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2',
          !isStartAnimation && 'top-[180px] transition-all duration-1500',
        )}
      >
        <FlickeringGrid
          className='absolute top-0 left-[10px] mask-[radial-gradient(ellipse_220px_190px_at_center,black,transparent)]'
          squareSize={2}
          gridGap={12}
          color='#b7ff01'
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
        />
        <GateLevelBlock
          nextLevel={11}
          onAnimationEnd={() => setIsStartAnimation(false)}
          className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
        />
      </div>
      {!isStartAnimation && (
        <GateInfoBlockNextLvl
          className='absolute top-1/2 left-1/2 mt-24 w-full -translate-x-1/2 -translate-y-1/2 px-4'
          className1='animate-slide-up-fade-2'
          className2='animate-slide-up-fade-2'
          className3='animate-slide-up-fade-3'
          className4='animate-slide-up-fade-3'
          dailyReward={86400000}
          mining={21600000}
          maxEnergy={2600}
          swipePoints={20}
        />
      )}
      <style>{`
        @keyframes scaleUpGateBlock {
          0% {
            transform: scale(1);
            margin-right: 0;
          }
          40%, 100% {
            backdrop-filter: blur(0px); 
            background-color: transparent;
            box-shadow: none;
            border: 2px solid rgba(182, 255, 0, 0);
            margin-right: 7px;
          }
          100% {
            margin-right: 7px;
            transform: scale(3.5);
          }
        }

        .animation-scale-up-gate-block {
          animation: scaleUpGateBlock 1s ease-in-out 1s forwards;
        }

        @keyframes translateGateNumber {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-142px);
          }
        }
      `}</style>
    </PageLayout>
  );
}

const GateLevelBlock = ({
  nextLevel,
  className,
  onAnimationEnd,
}: {
  nextLevel: number;
  className?: string;
  onAnimationEnd?: (e?: AnimationEventHandler<SVGElement>) => void;
}) => {
  const gateNumberRef = useRef<HTMLDivElement | null>(null);

  const [isLockedAnimationFinished, setIsLockedAnimationFinished] = useState(false);

  const [isScaleBlockAnimation, setIsScaleBlockAnimation] = useState(false);

  return (
    <>
      <div ref={gateNumberRef} className={cn('relative size-[88px]', className)}>
        <div
          className={cn(
            'absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-[32px] border-2 border-[#B6FF00] shadow-[0_0_80px_rgba(182,255,0,0.56),_inset_0_0_16px_rgba(182,255,0,0.24)] backdrop-blur-[8px]',
            isScaleBlockAnimation && 'scale-[1.5] opacity-0 transition-all duration-1500',
          )}
        />
        <GateElectricLines
          svg1ClassName='top-[60px] left-[70px]'
          svg2ClassName='top-[-50px] left-[120px]'
          svg3ClassName='top-[-40px] -left-[130px]'
          svg4ClassName='top-[80px] -left-[90px]'
          className={cn(
            'opacity-0',
            isScaleBlockAnimation && 'opacity-100 transition-all !duration-3000',
          )}
        />

        <span
          className={cn(
            'font-pixel absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30px] text-[#B6FF00]',
            nextLevel.toString().startsWith('1') && '-ml-2',
            isScaleBlockAnimation && nextLevel.toString().startsWith('1') && '-ml-5',
            isScaleBlockAnimation &&
              'text-[100px] transition-all duration-1500 [text-shadow:0_0_80px_#B6FF00,0_0_130px_#B6FF00,0_0_150px_#B6FF00]',
          )}
        >
          {nextLevel || 1}
        </span>
        {!isLockedAnimationFinished ? (
          <HiLockClosed
            className='animation-twitching-locker absolute -bottom-2 left-1/2 -translate-x-1/2'
            color='#FFFFFF'
            fontSize={24}
            onAnimationEnd={() => {
              setIsLockedAnimationFinished(true);
            }}
          />
        ) : (
          <HiLockOpen
            className='animation-fade-out-locker absolute -bottom-2 left-1/2 -translate-x-1/2'
            color='#FFFFFF'
            fontSize={24}
            onAnimationEnd={(e) => {
              onAnimationEnd?.(e as unknown as AnimationEventHandler<SVGElement>);
              setIsScaleBlockAnimation(true);
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes twitchingLockerAnimation {
          0% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0px);
          }
        }

        .animation-twitching-locker {
          animation: twitchingLockerAnimation 0.1s ease-in-out 6 forwards;
        }

        @keyframes translateLockerAnimation  {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-40px);
          }
        }

        .animation-translate-locker {
          animation: translateLockerAnimation 1s ease-in-out forwards;
        }

        @keyframes fadeOutLockerAnimation {
          0% {
            opacity: 1;
          } 

          50% {
            transform: translateY(40px) rotateX(-45deg) rotateZ(-35deg);
          }

          100% {
            transform: translateY(40px) rotateX(-45deg) rotateZ(-35deg);
            opacity: 0;
          }
        }

        .animation-fade-out-locker {
          animation: fadeOutLockerAnimation 1.5s ease-in-out forwards;
        }

        .animation-translate-gate-number {
          animation: translateGateNumber 1s ease-in-out forwards;
        }

        @keyframes fadeInGateLinesAnimation {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animation-gate-lines {
          animation: fadeInGateLinesAnimation 2s 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};
