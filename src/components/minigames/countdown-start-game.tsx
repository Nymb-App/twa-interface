import Countdown from 'react-countdown'
import { cn } from '@/utils'

export const CountdownStartGame = ({
  onComplete,
}: {
  onComplete: () => void
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Countdown
        date={Date.now() + 4000}
        intervalDelay={1000}
        precision={0}
        renderer={({ seconds }) => (
          <span
            key={seconds}
            className={cn(
              'font-pixel text-[7.5rem] text-white [-webkit-text-stroke:3px_rgba(182,255,0,1)] [text-shadow:0px_0px_100px_rgba(182,255,0,0.4)] animate-[number-change_0.5s_ease-out]',
              seconds === 2 && 'mr-12',
              seconds === 1 && 'ml-12',
            )}
          >
            {seconds > 1 ? seconds - 1 : 'GO!'}
          </span>
        )}
        onComplete={onComplete}
      />
    </div>
  )
}
