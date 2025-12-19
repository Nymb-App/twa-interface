import { Skeleton } from '@/components/ui/skeleton'
import { TWITTER_URL } from '@/constants'
import { TasksDailyComboNames, useTasks } from '@/hooks/api/use-tasks'
import { useEffect, useMemo } from 'react'
import Countdown from 'react-countdown'
import useSound from 'use-sound'
import { TaskIcon } from '../task-icons'
import { TaskDailyBlock } from '../tasks-daily-block/tasks-daily-block'
import { ADSGRAM_APP_ID } from '@/lib/constants'
import { useAdsgram } from '@adsgram/react'
import { shareStory } from '@tma.js/sdk'


const getButtonLabel = (taskName: string): string => {
  switch (taskName) {
    case TasksDailyComboNames.WatchAd:
      return 'open'
    case TasksDailyComboNames.ViewTwitterNews:
      return 'open'
    case TasksDailyComboNames.PostTelegramStory:
      return 'post'
    default:
      return 'go'
  }
}

export function TasksDaily() {
  const { dailyComboQuery, completeTask } = useTasks();
  const { show } = useAdsgram({
    blockId: ADSGRAM_APP_ID,
    debug: false,
    onReward: () => {
      completeTask({ taskName: TasksDailyComboNames.WatchAd })
    }
  })

  const { data: dailyCombo, isLoading, isError } = dailyComboQuery

  const [play, { stop }] = useSound('/sounds/Button.aac')

  const isAllTasksCompleted = useMemo(() => {
    if (!dailyCombo) return false
    return dailyCombo.tasks.every((task) => task.isCompleted)
  }, [dailyCombo])

  const handleTaskCompletion = (taskName: TasksDailyComboNames) => {
    play()
    // Если это задача для Твиттера, формируем и открываем ссылку
    // if (taskName === TasksDailyComboNames.PostTelegramStory) {
    //   const tweetText = `Exploring the Nymb ecosystem! 💎 This project is a game-changer for Web3 gaming. Join the movement! 🚀\nMy app id: ${user?.id}\n\n`
    //   const hashtags = 'nymb,nymb_app'
    //   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${hashtags}&url=${encodeURIComponent(TWITTER_URL)}`
    //   window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    // }
    if(
      taskName === TasksDailyComboNames.PostTelegramStory &&
      shareStory.isAvailable()
    ) {
      shareStory('https://render.fineartamerica.com/images/rendered/medium/print/6/8/break/images-medium-5/awesome-solitude-bess-hamiti.jpg', {
        text: 'Exploring the Nymb ecosystem! 💎 This project is a game-changer for Web3 gaming. Join the movement! 🚀',
        widgetLink: {
          url: 'https://t.me/nymb_app',
          name: 'NYMB - time is money', 
        }
      });
    }

    if(taskName === TasksDailyComboNames.ViewTwitterNews) {
      window.open(TWITTER_URL, '_blank', 'noopener,noreferrer')
    }
    if(taskName === TasksDailyComboNames.WatchAd) {
      show();
      return;
    }
    // Вызываем мутацию для завершения задачи на бэкенде
    completeTask({ taskName })
  }

  useEffect(() => {
    return () => stop()
  }, [play])

  if (isLoading) {
    return (
      <section className="-mt-4">
        <div className="font-pixel mb-3 flex justify-center leading-6 font-[18px] uppercase">
          <h1 className="ml-4 text-lg">daily combo</h1>
        </div>
        <div className="starboard-result-block-bg relative mb-6 rounded-[14px] px-4 py-3">
          <div className="flex justify-evenly gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex basis-1/3 flex-col items-center justify-center gap-3 py-1 text-center"
              >
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (isError || !dailyCombo) {
    return (
      <section className="-mt-4">
        <div className="font-pixel mb-3 flex justify-center leading-6 font-[18px] uppercase">
          <h1 className="ml-4 text-lg">daily combo</h1>
        </div>
        <div className="starboard-result-block-bg relative mb-6 rounded-[14px] px-4 py-3">
          Error loading daily combo.
        </div>
      </section>
    )
  }

  return (
    <section className="-mt-4">
      <div className="font-pixel relative mb-3 flex justify-center leading-6 font-[18px] uppercase">
        <h1 className="ml-4 text-lg">daily combo</h1>
        {isAllTasksCompleted && (
          <p className="absolute right-4 text-[#FFFFFF]/40">Done</p>
        )}
      </div>
      <div className="starboard-result-block-bg relative mb-6 rounded-[14px] px-4 py-3">
        <div className="flex justify-evenly gap-2">
          {dailyCombo?.tasks.map((task) => (
            <TaskDailyBlock
              key={task.name}
              title={task.description} // Или task.name, в зависимости от того, что хотите отображать
              reward={task.reward}
              buttonActionLabel={getButtonLabel(task.name)}
              isTaskCompleted={task.isCompleted}
              onComplete={() => handleTaskCompletion(task.name as TasksDailyComboNames)}
            >
              <TaskIcon className='size-[27px]' taskName={task.name} />
            </TaskDailyBlock>
          ))}
        </div>
        {!isAllTasksCompleted ? (
          <div>
            <div className="my-3 h-px bg-[#FFFFFF1F]" />
            <p className="font-inter text-center text-[14px] leading-[140%] font-normal text-[#FFFFFF]">
              Complete all tasks and get an extra:
              <span className="font-pixel relative ml-4 leading-[120%] text-[#B6FF00] uppercase">
                <span className="absolute top-px -left-3">+</span>
                <span>4</span>
                <span className="ml-1.5">D</span>
              </span>
            </p>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-normal text-[#FFFFFF]">
            <p className="font-inter mb-1.5 text-[14px] leading-[140%]">
              Available via:
            </p>
            <div className="font-pixel text-[20px] leading-6">
              <Countdown date={dailyCombo.resetAt * 1000} renderer={renderer} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
}) => {
  const totalHours = days * 24 + hours
  const format = (value: number) => String(value).padStart(2, '0')

  return (
    <span>
      {format(totalHours)}:{format(minutes)}:{format(seconds)}
    </span>
  )
}
