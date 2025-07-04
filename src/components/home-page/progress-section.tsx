import Countdown from 'react-countdown'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CountdownTimerDisplay } from '../ui/countdown-timer-display'
import { LevelsList } from './levels-list'
import EnergyIcon from '@/assets/icons/energy'
import { useAccountMe } from '@/hooks/api/use-account'
import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

/**
 * Анимирует время от одного значения до другого,
 * передавая анимированную метку времени в Countdown.
 */
const AnimatedCountdown = ({
  from,
  to,
  onEnd,
}: {
  from: number
  to: number
  onEnd: () => void
}) => {
  // Анимируем метку времени от начальной до конечной
  const [animatedTimestamp, setAnimatedTimestamp] = useState(from * 1000)

  useEffect(() => {
    const controls = animate(from * 1000, to * 1000, {
      duration: 2, // Длительность анимации в секундах
      ease: 'easeOut',
      onUpdate: latest => {
        setAnimatedTimestamp(latest)
      },
      onComplete: onEnd,
    })

    return () => controls.stop()
  }, [from, to, onEnd])

  return (
    <Countdown
      date={animatedTimestamp}
      renderer={props => <CountdownTimerDisplay isCountdownHeaderView {...props} />}
    />
  )
}

const ProgressSection = ({
  isClaimStart,
  setIsClaimEnd,
}: {
  isClaimStart?: boolean
  setIsClaimEnd: (value: boolean) => void
}) => {
  const { accountQuery, user } = useAccountMe();
  const {
    data: account,
    isLoading: isAccountLoading,
    refetch,
  } = accountQuery;
  const [timeBeforeClaim, setTimeBeforeClaim] = useState<number | null>(null)

  useEffect(() => {
    if (isClaimStart) {
      // Сохраняем текущее время и запускаем refetch
      setTimeBeforeClaim(account?.time ?? 0)
      refetch();
    }
  }, [isClaimStart, refetch, account?.time])

  /**
   * Рендерит компонент обратного отсчета в зависимости от состояния.
   */
  const renderCountdown = () => {
    const isClaiming = isClaimStart && timeBeforeClaim !== null
    const newTime = account?.time

    // --- Логика Клейма ---
    if (isClaiming) {
      // Если рефетч прошел и время изменилось, показываем анимацию
      if (newTime !== undefined && newTime > timeBeforeClaim) {
        return (
          <AnimatedCountdown
            from={timeBeforeClaim}
            to={newTime}
            onEnd={() => {
              setIsClaimEnd(true)
              setTimeBeforeClaim(null) // Сбрасываем состояние клейма
            }}
          />
        )
      }
      // Если все еще ждем refetch, показываем старое время статично
      return (
        <Countdown
          date={timeBeforeClaim * 1000}
          renderer={props => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      )
    }

    // --- Стандартная Логика (не клейм) ---
    if (isAccountLoading || !account?.time) {
      return (
        <CountdownTimerDisplay
          isCountdownHeaderView
          days={0}
          hours={0}
          minutes={0}
          seconds={0}
        />
      )
    }

    return (
      <Countdown
        date={account.time * 1000}
        intervalDelay={10}
        precision={3}
        renderer={props => (
          <CountdownTimerDisplay isCountdownHeaderView {...props} />
        )}
      />
    )
  }

  return (
    <header className="relative w-full font-pixel px-3 bg-[url('/home-bg.png')] bg-no-repeat bg-bottom pb-6">
      {/* Top part */}
      <div className="inline-flex justify-between w-full">
        {/* Left card */}
        <div className="inline-flex items-center justify-between bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
          <EnergyIcon className="size-[28px]" />
          <span className="text-base">{account?.energy ?? '...'}</span>
        </div>

        <h1 className="text-2xl">HOME</h1>

        {/* Right card */}
        <div className="inline-flex items-center justify-between gap-2 bg-[#1D1F1D] rounded-2xl h-[40px] pl-2 pr-3">
          <Avatar className="rounded-lg size-[28px]">
            <AvatarImage
              src={user?.photo_url ?? 'https://github.com/shadcn.png'}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-inter text-base font-semibold max-w-[60px] truncate">
            {user?.username}
          </span>
        </div>
      </div>

      <LevelsList />

      {renderCountdown()}
    </header>
  )
}

export default ProgressSection;