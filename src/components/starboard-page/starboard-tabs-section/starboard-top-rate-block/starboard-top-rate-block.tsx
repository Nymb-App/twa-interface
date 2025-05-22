import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'

export const StarboardTopRateBlock = ({
  gateUserData,
  idx,
}: {
  gateUserData: {
    name: string
    time: number
  }
  idx: number
}) => {
  return (
    <div className="relative flex gap-4 items-center rounded-[14px] py-[13px] px-[16px] starboard-result-block-bg">
      <Avatar className="rounded-[12px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{'ju'.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-auto">
        <span className="font-inter font-[600] text-[16px] leading-[20px] text-white">
          {gateUserData.name || 'unknown'}
        </span>
        <Countdown
          date={Number(Date.now() + gateUserData.time) || 0}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => <CountdownTimerDisplay {...props} />}
        />
      </div>
      <div className="font-inter font-[400] text-[14px] leading-[140%]">
        {idx === 0 && <span className="text-[#FFC800]">#{idx + 1}</span>}
        {idx === 1 && <span className="text-[#C4C4C4]">#{idx + 1}</span>}
        {idx === 2 && <span className="text-[#C47A49]">#{idx + 1}</span>}
        {idx > 2 && <span className="text-white">#{idx + 1}</span>}
      </div>
    </div>
  )
}
