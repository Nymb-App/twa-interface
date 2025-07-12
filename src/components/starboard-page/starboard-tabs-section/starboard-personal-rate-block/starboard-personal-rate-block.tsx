import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarboardCountdownDisplay } from '@/components/ui/starboard-countdown-display'
import { useAccount } from '@/hooks/api/use-account'

export const StarboardPersonalRateBlock = ({
  gateCurrentUserData,
}: {
  gateCurrentUserData:
    | { gate: number; ratePosition: number; time: number }
    | undefined
}) => {
  const { user } = useAccount()

  return (
    <div className="relative flex gap-4 items-center rounded-[14px] py-[13px] px-[16px] starboard-result-block-bg">
      <Avatar className="rounded-[12px]">
        <AvatarImage src={user?.photo_url ?? '/roulette-icons/default.webp'} />
        <AvatarFallback>{'ju'.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-auto">
        <span className="font-inter font-[600] text-[16px] leading-[20px] text-white">
          {user?.username ?? 'unknown'}
        </span>
        <Countdown
          date={Number(
            gateCurrentUserData ? gateCurrentUserData.time * 1000 : 0,
          )}
          intervalDelay={1000}
          precision={2}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return (
                <StarboardCountdownDisplay
                  days={0}
                  hours={0}
                  minutes={0}
                  seconds={0}
                  completed
                />
              )
            }
            return (
              <StarboardCountdownDisplay
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
              />
            )
          }}
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
