import { Link } from '@tanstack/react-router'
import Marquee from 'react-fast-marquee'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { cn } from '@/utils'

const levels = [
  { num: 12, isLocked: false, isCurrentLevel: true, isNewUnlocked: false },
  { num: 13, isLocked: false, isCurrentLevel: false, isNewUnlocked: true },
  { num: 14, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 15, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 16, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 17, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 18, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 19, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 20, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
]

export const LevelsList = () => {
  return (
    <div className="relative">
      <ul className="pt-4 px-3 pb-6 flex justify-between items-center text-center w-full overflow-auto">
        {levels.map((level) =>
          !level.isLocked ? (
            <li className="flex-shrink-0 w-1/4" key={level.num}>
              <Link to="/tasks" className="inline-block h-full">
                <span
                  className={cn(
                    'inline-flex text-center text-[16px] leading-[20px] border rounded-[12px] p-1 font-[400] w-[32px] h-[32px] border-[#FFFFFF1F] bg-[#121312]',
                    level.isCurrentLevel &&
                      'border-[#FFFFFF1F] w-[48px] h-[48px] rounded-[18px] shadow-none bg-[#161816]',
                    level.isNewUnlocked &&
                      'shadow-[0px_0px_20px_rgba(182,255,0,0.4)] text-[#B6FF00] border-[#B6FF00]',
                  )}
                >
                  {level.num}
                </span>
              </Link>
            </li>
          ) : (
            <li className="flex-shrink-0 w-1/4" key={level.num}>
              <span className="p-2.5 inline-flex font-[400] text-[16px] leading-[20px] border border-[#FFFFFF1F] rounded-[12px] w-[32px] h-[32px] bg-[#161816]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.52958 4.23525V3.5295C9.52958 1.5825 7.94633 0 6.00008 0C4.05383 0 2.47058 1.58325 2.47058 3.5295V4.23525C1.69058 4.23525 1.05908 4.8675 1.05908 5.64675V10.5885C1.05908 11.3685 1.69058 12 2.47058 12H9.52958C10.3096 12 10.9411 11.3678 10.9411 10.5885V5.64675C10.9411 4.86675 10.3088 4.23525 9.52958 4.23525ZM3.88208 3.5295C3.88208 2.36175 4.83233 1.4115 6.00008 1.4115C7.16783 1.4115 8.11808 2.36175 8.11808 3.5295V4.23525H3.88133L3.88208 3.5295ZM6.70583 8.4705C6.70583 8.65768 6.63148 8.83719 6.49912 8.96954C6.36677 9.10189 6.18726 9.17625 6.00008 9.17625C5.81291 9.17625 5.6334 9.10189 5.50104 8.96954C5.36869 8.83719 5.29433 8.65768 5.29433 8.4705V7.059C5.29433 6.87182 5.36869 6.69231 5.50104 6.55996C5.6334 6.42761 5.81291 6.35325 6.00008 6.35325C6.18726 6.35325 6.36677 6.42761 6.49912 6.55996C6.63148 6.69231 6.70583 6.87182 6.70583 7.059V8.4705Z"
                    fill="white"
                    fillOpacity="0.6"
                  />
                </svg>
              </span>
            </li>
          ),
        )}
        <FlickeringGrid
          className="absolute z-[-1] h-[116px] left-0 right-0 bottom-0 top-[10px]"
          squareSize={2}
          gridGap={18}
          color="#b7ff01"
          flickerChance={0.3}
        />
        <div className="absolute bottom-[44px] w-full z-[-1]">
          <Marquee direction="right" speed={10}>
            {arrows.map((_, idx) => (
              <Arrow key={idx} />
            ))}
          </Marquee>
        </div>
      </ul>
    </div>
  )
}

const arrows = Array.from({ length: 15 })

const Arrow = () => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.518233 1.31582C0.296715 0.98354 0.534911 0.538467 0.934259 0.538467H2.79815C3.1325 0.538467 3.44473 0.705569 3.6302 0.983767L5.6302 3.98377C5.85413 4.31967 5.85413 4.75727 5.6302 5.09317L3.6302 8.09317C3.44473 8.37137 3.1325 8.53847 2.79815 8.53847H0.934258C0.53491 8.53847 0.296715 8.09339 0.518233 7.76112L2.29687 5.09317C2.5208 4.75727 2.5208 4.31967 2.29687 3.98377L0.518233 1.31582Z"
      fill="#B6FF00"
    />
  </svg>
)
