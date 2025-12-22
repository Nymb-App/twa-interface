import { useAdsgram } from '@adsgram/react'
import { isTMA, openLink, shareStory } from '@tma.js/sdk'
import { useCallback, useEffect, useMemo } from 'react'
import Countdown from 'react-countdown'
import { toast } from 'sonner'

import { TasksDailyComboNames, useTasks } from '@/hooks/api/use-tasks'
import { ADSGRAM_APP_ID, SELF_HOST_URL, TWITTER_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { formatDurationFromSeconds } from '@/utils'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { FaCheck } from 'react-icons/fa'
import { LuTicket } from 'react-icons/lu'
import { TbBrandTelegram, TbBrandX } from 'react-icons/tb'


export function TasksDaily() {
  const {
    dailyComboQuery: { data: dailyCombo, isLoading, isError },
    completeTask,
  } = useTasks()
  const { show } = useAdsgram({
    blockId: ADSGRAM_APP_ID,
    debug: false,
    onReward: () => {
      completeTask({ taskName: TasksDailyComboNames.WatchAd })
    },
  })

  const isAllTasksCompleted = useMemo(() => {
    if (!dailyCombo) return false;
    return dailyCombo.tasks.filter(task =>
      task.name !== TasksDailyComboNames.DailyComboCompleteAllTasks
    ).every((task) => task.status === 'completed');
  }, [dailyCombo])

  const handleTaskCompletion = useCallback(
    (taskName: TasksDailyComboNames) => {
      if (!isTMA()) {
        return toast.error(
          'This action is only available in the Telegram Mobile App.',
        )
      }
      if (isAllTasksCompleted) {
        return toast.info('All daily combo tasks are already completed.')
      }

      if (taskName === TasksDailyComboNames.PostTelegramStory) {
        if (!shareStory.isAvailable()) {
          toast.error('Sharing stories is not supported in your browser.')
          return
        }
        shareStory(`${SELF_HOST_URL}/telegram/stories.jpg`, {
          text: 'Exploring the Nymb ecosystem! 💎 This project is a game-changer for Web3 gaming. Join the movement! 🚀',
          widgetLink: {
            url: 'https://t.me/nymb_app',
            name: 'NYMB - time is money',
          },
        })
      }

      if (taskName === TasksDailyComboNames.ViewTwitterNews) {
        openLink(TWITTER_URL, {
          tryBrowser: 'chrome',
          tryInstantView: true,
        })
      }
      if (taskName === TasksDailyComboNames.WatchAd) {
        show()
        return
      }

      completeTask({ taskName })
    },
    [isAllTasksCompleted, completeTask, show],
  )

  useEffect(() => {
    if (!isAllTasksCompleted) return
    completeTask({
      taskName: TasksDailyComboNames.DailyComboCompleteAllTasks,
    })
  }, [isAllTasksCompleted])

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
    <div className="w-full rounded-[14px] px-4 py-3 h-auto bg-linear-to-b from-white/0 to-white/5 relative">
      <div className="inline-flex justify-evenly w-full py-3">
        {dailyCombo.tasks.map((task) => {
          return task.name !==
            TasksDailyComboNames.DailyComboCompleteAllTasks ? (
            <TaskDailyCard
              key={task.name}
              name={task.name}
              description={task.description}
              reward={task.reward}
              status={task.status}
              onClick={(taskName) =>
                handleTaskCompletion(taskName as TasksDailyComboNames)
              }
              className="basis-1/3 max-w-[103.33px]"
            />
          ) : null
        })}
      </div>

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          !isAllTasksCompleted && 'hidden',
        )}
      >
        <Countdown
          date={dailyCombo.resetAt * 1000}
          renderer={({ days, hours, minutes, seconds }) => {
            const totalHours = days * 24 + hours
            const format = (value: number) => String(value).padStart(2, '0')
            return (
              <div className="text-center text-white">
                <span className="font-inter text-sm">Available via:</span>
                <br />
                <span className="font-pixel text-xl">
                  {format(totalHours)}:{format(minutes)}:{format(seconds)}
                </span>
              </div>
            )
          }}
        />
      </div>

      <p
        className={cn(
          'pt-3 w-full font-inter text-sm text-white inline-flex items-center justify-center border-t border-white/10',
          isAllTasksCompleted && 'hidden',
        )}
      >
        Complete all tasks and get an extra:
        <span className="font-pixel relative ml-4 leading-[120%] text-[#B6FF00] uppercase">
          <span className="absolute top-px -left-3">+</span>
          <span>4</span>
          <span className="ml-1.5">D</span>
        </span>
      </p>
    </div>
  )
}

const TaskDailyCard = ({
  name,
  description,
  reward,
  status,
  className,
  onClick,
}: {
  name: string
  description: string
  reward: { type: string; value: number }
  status: 'pending' | 'completed' | 'in-progress'
  className?: string
  onClick?: (name: string) => void
}) => {
  const formattedReward = useMemo(() => {
    if (reward.type === 'time') {
      const data = formatDurationFromSeconds(reward.value).split(' ')
      return {
        value: data[0],
        unit: data[1],
      }
    }

    return {
      value: String(reward.value),
      unit: 'e',
    }
  }, [reward])

  const formatedButtonLabel = useMemo(() => {
    if (status === 'pending') {
      return status
    }

    switch (name) {
      case TasksDailyComboNames.WatchAd:
      case TasksDailyComboNames.ViewTwitterNews:
        return 'open'
      case TasksDailyComboNames.PostTelegramStory:
        return 'post'
      default:
        return 'go'
    }
  }, [name, status])

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between text-center',
        status === 'completed' && 'opacity-20',
        className,
      )}
    >
      {name === TasksDailyComboNames.PostTelegramStory ? (
        <TbBrandTelegram className="size-[30px] text-[#b8b8b8]" />
      ) : name === TasksDailyComboNames.ViewTwitterNews ? (
        <TbBrandX className="size-[30px] text-[#b8b8b8]" />
      ) : name === TasksDailyComboNames.WatchAd ? (
        <LuTicket className="size-[30px] text-[#b8b8b8]" />
      ) : null}
      <span className="font-semibold text-base max-w-[90px]">
        {description}
      </span>
      <span className="font-pixel text-sm text-white/40 uppercase inline-flex items-center gap-1 mt-1">
        +{formattedReward.value}
        <span>{formattedReward.unit}</span>
      </span>

      {status === 'completed' ? (
        <div className="mt-2 inline-flex items-center justify-center text-sm rounded-xl bg-[#2b371a] text-[#B6FF00] size-8">
          <FaCheck />
        </div>
      ) : (
        <Button
          onClick={() => onClick?.(name)}
          disabled={status === 'pending'}
          variant={'nymb-green'}
          className="text-black text-xs px-2 py-1 rounded-[8px] w-auto h-6 mt-2 uppercase"
        >
          {formatedButtonLabel}
        </Button>
      )}
    </div>
  )
}
