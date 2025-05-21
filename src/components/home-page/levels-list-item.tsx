import { Link } from '@tanstack/react-router'
import { CarouselItem } from '../ui/carousel'
import { cn } from '@/utils'

export const LevelsListItem = ({
  level,
}: {
  level: {
    num: number
    isLocked: boolean
    isCurrentLevel: boolean
    isNewUnlocked: boolean
  }
}) => {
  return (
    <CarouselItem className="basis-1/4 h-[80px] flex items-center justify-center">
      <>
        {!level.isLocked ? (
          <div className="flex justify-center">
            <Link
              to="/tasks"
              className={cn(
                'inline-flex items-center w-[32px] h-[32px] font-[400] text-sm justify-center border rounded-[12px] p-2 border-[#FFFFFF1F] bg-[#121312]',
                level.isCurrentLevel &&
                  'border-[#FFFFFF1F] w-[48px] h-[48px] rounded-[18px] shadow-none bg-[#161816]',
                level.isNewUnlocked &&
                  'shadow-[0px_0px_20px_rgba(182,255,0,0.4)] text-[#B6FF00] border-[#B6FF00]',
              )}
            >
              <span
                className={cn(
                  level.num > 20 && 'mr-0',
                  level.num >= 1 && level.num <= 19 && 'mr-1.5',
                )}
              >
                {level.num}
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center" key={level.num}>
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
          </div>
        )}
      </>
    </CarouselItem>
  )
}
