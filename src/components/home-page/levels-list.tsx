import { FlickeringGrid } from '../magicui/flickering-grid'
import { Carousel, CarouselContent } from '../ui/carousel'
// import MarqueeArrows from './marquee-arrows'
// import { LevelsListItem } from './levels-list-item'
import Marquee from "react-fast-marquee";
import { Link } from '@tanstack/react-router'
import { CarouselItem } from '../ui/carousel'
import { cn } from '@/utils'
import { LockIcon } from '@/assets/icons/lock';

export const LevelsList = ({className}:{className?: string}) => {
  const MAX_LVL = 12;
  const lvlArray = Array.from({length: MAX_LVL});

  return (
    <div className={cn('w-full px-6', className)}>
      <FlickeringGrid
      />
      <Carousel
        className="w-full h-[48px]"
        opts={{
          slidesToScroll: 4,
          align: 'center',
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-5 w-1/2 bg-[radial-gradient(ellipse_250px_4px_at_left,_rgba(182,255,0,0.3)_0%,_transparent_100%)]"
        />
        <CarouselContent className='h-[48px]'>
          {lvlArray.map((_, index) => (
            <CarouselLvlItem
              key={`lvl-${index}`}
              lvl={MAX_LVL - index}
              lockStatus={index === 0 ? 'unlocked' : index === 1 ? 'ready-to-unlock' : undefined}
            />
          ))}
        </CarouselContent>
        
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[70px] bg-gradient-to-l from-[#121312] to-transparent "
        />
      </Carousel>
    </div>
  )
}

function CarouselLvlItem({
  lvl,
  lockStatus = 'locked',
}: {
  lvl: number,
  lockStatus?: 'locked' | 'unlocked' | 'ready-to-unlock',
}) {
  return (
    <CarouselItem className="basis-1/4 relative h-full [&:nth-child(4n+1)]:pl-4 pl-0 last:flex-none last:w-12">
      <Link to="/gate">
        <div className={cn(
            'bg-[#171815] border border-[#323331] rounded-xl h-full aspect-square text-center absolute z-10 top-1/2 -translate-y-1/2 ',
            (lockStatus === 'locked' || lockStatus === 'ready-to-unlock') && 'h-[32px]',
            lockStatus === 'ready-to-unlock' && 'border-[#B6FF00] text-[#B6FF00] rounded-xl shadow-[0_0px_10px_#B6FF00]/60'
          )}
        >
          {lockStatus === 'locked'
            ?
            <LockIcon className='absolute left-1/2 top-1/2 -translate-1/2' />
            :
            <span className={cn(
                'leading-[48px]',
                lvl.toString()[0] === '1' && 'mr-2',
                lockStatus === 'ready-to-unlock' && 'leading-[30px]'
              )}
            >
              {lvl}
            </span>
          }
        </div>
        {lvl > 1 &&
          <Marquee
            className='absolute top-1/2 -translate-y-1/2 '
            autoFill
            direction='right'
          >
            <ArrowIcon />
          </Marquee>
        }
      </Link>
    </CarouselItem>
  );
}


const ArrowIcon = ({
  className,
}: {
  className?: string,
}) => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0.518233 1.31582C0.296715 0.98354 0.534911 0.538467 0.934259 0.538467H2.79815C3.1325 0.538467 3.44473 0.705569 3.6302 0.983767L5.6302 3.98377C5.85413 4.31967 5.85413 4.75727 5.6302 5.09317L3.6302 8.09317C3.44473 8.37137 3.1325 8.53847 2.79815 8.53847H0.934258C0.53491 8.53847 0.296715 8.09339 0.518233 7.76112L2.29687 5.09317C2.5208 4.75727 2.5208 4.31967 2.29687 3.98377L0.518233 1.31582Z"
      fill="#B6FF00"
    />
  </svg>
)