import { FlickeringGrid } from '../magicui/flickering-grid'
import { Carousel, CarouselContent } from '../ui/carousel'
// import MarqueeArrows from './marquee-arrows'
// import { LevelsListItem } from './levels-list-item'
import Marquee from "react-fast-marquee";
import { Link } from '@tanstack/react-router'
import { CarouselItem } from '../ui/carousel'
import { cn } from '@/utils'
import { LockIcon } from '@/assets/icons/lock';



const levels = [
  { num: 12, isLocked: false, isCurrentLevel: true, isNewUnlocked: false },
  { num: 11, isLocked: true, isCurrentLevel: false, isNewUnlocked: true },
  { num: 10, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 9, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 8, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 7, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 6, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 5, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 4, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 3, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 2, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 1, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
]

export const LevelsList = () => {
  return (
    <div className='w-full overflow-hidden px-6'>
      <Carousel
        className="w-full h-[48px]"
        opts={{
          slidesToScroll: 4,
          align: 'center',
        }}
      >
        <CarouselContent className='h-[48px]'>
          {levels.map((level, index) => (
            <CarouselLvlItem
              key={level.num}
              lvl={12 - index}
              isLocked={index !== 0}
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
  isLocked = true,
}:{
  lvl: number,
  isLocked?: boolean,
}) {
  return (
    // [&:nth-child(4n+1)]:pl-4 pl-0 last:flex-none last:w-12
    <CarouselItem className="basis-1/4 relative h-full [&:nth-child(4n+1)]:pl-4 pl-0 last:flex-none last:w-12">
      <div className={cn('bg-[#171815] border border-[#323331] rounded-xl h-full aspect-square text-center absolute z-10 top-1/2 -translate-y-1/2 ', isLocked && 'h-[32px]')}>
        {isLocked 
        ?
          <LockIcon className='absolute left-1/2 top-1/2 -translate-1/2' />
        :
          <span className={cn('leading-[48px]', lvl.toString()[0] === '1' && 'mr-2')}>
            {lvl}
          </span>
        }
      </div>
      <Marquee
        className='absolute top-1/2 -translate-y-1/2'
        autoFill
        direction='right'
      >
        <ArrowIcon />
      </Marquee>
    </CarouselItem>
  );
}

// export const LevelsListItem = ({
//   level,
// }: {
//   level: {
//     num: number
//     isLocked: boolean
//     isCurrentLevel: boolean
//     isNewUnlocked: boolean
//   }
// }) => {
//   return (
//     <CarouselItem className="basis-1/4 h-[80px] flex items-center justify-center">
//       <>
//         {!level.isLocked ? (
//           <div className="flex justify-center">
//             <Link
//               to="/tasks"
//               className={cn(
//                 'inline-flex items-center w-[32px] h-[32px] font-[400] text-sm justify-center border rounded-[12px] p-2 border-[#FFFFFF1F] bg-[#121312]',
//                 level.isCurrentLevel &&
//                   'border-[#FFFFFF1F] w-[48px] h-[48px] rounded-[18px] shadow-none bg-[#161816]',
//                 level.isNewUnlocked &&
//                   'shadow-[0px_0px_20px_rgba(182,255,0,0.4)] text-[#B6FF00] border-[#B6FF00]',
//               )}
//             >
//               <span
//                 className={cn(
//                   level.num > 20 && 'mr-0',
//                   level.num >= 1 && level.num <= 19 && 'mr-1.5',
//                 )}
//               >
//                 {level.num}
//               </span>
//             </Link>
//           </div>
//         ) : (
//           <div className="flex justify-center" key={level.num}>
//             <LockIcon />
//           </div>
//         )}
//       </>
//     </CarouselItem>
//   )
// }


const ArrowIcon = ({
  className,
}:{
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