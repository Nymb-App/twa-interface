import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'

export const StarboardPersonalRateBlock = ({
  gateCurrentUserData,
}: {
  gateCurrentUserData:
    | { gate: number; ratePosition: number; time: number }
    | undefined
}) => {
  return (
    <div className="relative flex gap-4 items-center rounded-[14px] py-[13px] px-[16px] starboard-result-block-bg">
      <Avatar className="rounded-[12px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{'ju'.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-auto">
        <span className="font-inter font-[600] text-[16px] leading-[20px] text-white">
          tevial
        </span>
        <Countdown
          date={Number(Date.now() + (gateCurrentUserData?.time ?? 0))}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => <CountdownTimerDisplay {...props} />}
        />
      </div>

      <div className="flex flex-col text-right">
        <p className="text-[#FFFFFF99] font-pixel font-[400] text-[12px] leading-[120%] uppercase">
          {gateCurrentUserData?.gate ?? '??'} gate
        </p>
        <span className="font-inter text-[#FFFFFF66] font-[400] leading-[140%]">
          #{gateCurrentUserData?.ratePosition ?? '??'}
        </span>
      </div>
    </div>
  )
}
