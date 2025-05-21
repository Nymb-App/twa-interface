import { Button } from './button'
import { cn } from '@/utils'

export const ButtonFillProgress = ({
  className,
  progress = 0,
  elapsedHours,
  elapsedMinutes,
  elapsedSeconds,
  remainingHours,
  remainingMinutes,
  remainingSeconds,
}: {
  className?: string
  progress?: number
  elapsedHours: string
  elapsedMinutes: string
  elapsedSeconds: string
  remainingHours: string
  remainingMinutes: string
  remainingSeconds: string
}) => {
  return (
    <Button
      className={cn(
        'absolute inset-0 rounded-[16px] h-full bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00] overflow-hidden z-10',
        className,
        'transition-[width] ease-linear duration-1500 p-0 button-fill',
      )}
      style={{
        width: `${progress}%`,
      }}
    >
      <div className="absolute top-[9px] left-0 right-0 bottom-0 w-[369px]">
        <div className="flex gap-2 justify-center items-center mb-1">
          <div className="text-[#020115] text-[18px] font-[400] font-pixel leading-[24px] uppercase">
            farming
          </div>
          <div>
            <svg
              className="!w-[24px] !h-[24px]"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_51_6932)">
                <path
                  d="M16.4041 22.4683L16.3982 23.9683L7.39819 23.9293L7.40503 22.4293L16.4041 22.4683ZM19.4109 20.981L19.4041 22.481L16.4041 22.4683L16.4109 20.9683L19.4109 20.981ZM7.41089 20.9293L7.40503 22.4293L4.40503 22.4166L4.41089 20.9166L7.41089 20.9293ZM20.9167 19.4869L20.9109 20.9869L19.4109 20.981L19.4167 19.481L20.9167 19.4869ZM4.41772 19.4166L4.41089 20.9166L2.91089 20.9107L2.91772 19.4107L4.41772 19.4166ZM22.4294 16.4937L22.4167 19.4937L20.9167 19.4869L20.9294 16.4869L22.4294 16.4937ZM2.93042 16.4107L2.91772 19.4107L1.41772 19.4039L1.43042 16.4039L2.93042 16.4107ZM23.9685 7.49957L23.9294 16.4996L22.4294 16.4937L22.4685 7.49371L23.9685 7.49957ZM1.46851 7.40387L1.43042 16.4039L-0.0695801 16.398L-0.0314941 7.39801L1.46851 7.40387ZM11.9744 5.94879L11.949 11.9488L19.449 11.981L19.4431 13.481L10.4431 13.4429L10.4744 5.94293L11.9744 5.94879ZM22.4812 4.49371L22.4685 7.49371L20.9685 7.48688L20.9812 4.48688L22.4812 4.49371ZM2.9812 4.41071L2.96851 7.41071L1.46851 7.40387L1.4812 4.40387L2.9812 4.41071ZM20.9871 2.98688L20.9812 4.48688L19.4812 4.48102L19.4871 2.98102L20.9871 2.98688ZM4.48706 2.91754L4.4812 4.41754L2.9812 4.41071L2.98706 2.91071L4.48706 2.91754ZM19.4939 1.48102L19.4871 2.98102L16.4871 2.96832L16.4939 1.46832L19.4939 1.48102ZM7.4939 1.43024L7.48706 2.93024L4.48706 2.91754L4.4939 1.41754L7.4939 1.43024ZM16.4998 -0.0316772L16.4939 1.46832L7.4939 1.43024L7.49976 -0.0697632L16.4998 -0.0316772Z"
                  fill="#020115"
                />
              </g>
              <defs>
                <clipPath id="clip0_51_6932">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-[#020115] font-[400] font-pixel text-[18px] leading-[24px]">
            <span>{elapsedHours}</span>:<span>{elapsedMinutes}</span>:
            <span>{elapsedSeconds}</span>
          </div>
        </div>
        <div
          className={cn(
            'text-[#020115]/60 mr-3 font-[500] font-inter text-[10px] leading-[10px] tracking-[0.3px]',
            className,
          )}
        >
          <span>{remainingHours}</span>:<span>{remainingMinutes}</span>:
          <span>{remainingSeconds}</span>
        </div>
      </div>
    </Button>
  )
}
