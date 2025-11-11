import { Skeleton } from '@/components/ui/skeleton'
import { TWITTER_URL } from '@/constants'
import { useAccount } from '@/hooks/api/use-account'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'
import Countdown from 'react-countdown'
import { TaskIcon } from '../task-icons'
import { TaskDailyBlock } from '../tasks-daily-block/tasks-daily-block'

const getButtonLabel = (taskName: string) => {
  switch (taskName) {
    case TaskNames.DailyComboLeaveCommentInTwitter:
      return 'open'
    case TaskNames.DailyComboBuyTicket:
      return 'buy'
    default:
      return 'go'
  }
}

export function TasksDaily() {
  const { user } = useAccount()
  const { dailyComboQuery, completeTask } = useTasks()
  const { data: dailyCombo, isLoading, isError } = dailyComboQuery

  // const isTwitterTaskSubscribeCompilitionKey = 'task_subscribe'
  const isTwitterTaskLeaveCommentInTwitterKey = 'task_comment'

  const parsedDailyComboTasks = dailyCombo?.tasks.map((task) => {
    if (task.name === TaskNames.DailyComboLeaveCommentInTwitter) {
      console.log(task.name, 'parsed daily combo tasks??')
      const isTaskCommentCompleted = localStorage.getItem('task_comment')
      return isTaskCommentCompleted
        ? {
            ...task,
            isCompleted: Date.now() > Number(isTaskCommentCompleted),
          }
        : task
    }
    return task
  })

  console.log(parsedDailyComboTasks, 'parsedDailyComboTasks')

  const isAllTasksCompleted =
    parsedDailyComboTasks?.every((task) => task.isCompleted) ?? false

  const handleTaskCompletion = (taskName: TaskNames) => {
    // Если это задача для Твиттера, формируем и открываем ссылку
    if (taskName === TaskNames.DailyComboLeaveCommentInTwitter) {
      const tweetText = `Exploring the Nymb ecosystem! 💎 This project is a game-changer for Web3 gaming. Join the movement! 🚀\nMy app id: ${user?.id}\n\n`
      const hashtags = 'nymb,nymb_app'
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=${hashtags}&url=${encodeURIComponent(TWITTER_URL)}`
      localStorage.setItem(
        isTwitterTaskLeaveCommentInTwitterKey,
        `${Date.now() + 1800 * 1000}`,
      )
      window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    }
    // Вызываем мутацию для завершения задачи на бэкенде
    completeTask({ taskName })
  }

  if (isLoading) {
    return (
      <section className="-mt-4">
        <div className="font-pixel mb-3 flex justify-center leading-[24px] font-[18px] uppercase">
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
        <div className="font-pixel mb-3 flex justify-center leading-[24px] font-[18px] uppercase">
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
      <div className="font-pixel relative mb-3 flex justify-center leading-[24px] font-[18px] uppercase">
        <h1 className="ml-4 text-lg">daily combo</h1>
        {isAllTasksCompleted && (
          <p className="absolute right-4 text-[#FFFFFF]/40">Done</p>
        )}
      </div>
      <div className="starboard-result-block-bg relative mb-6 rounded-[14px] px-4 py-3">
        <div className="flex justify-evenly gap-2">
          {parsedDailyComboTasks?.map((task) => (
            <TaskDailyBlock
              key={task.name}
              title={task.description} // Или task.name, в зависимости от того, что хотите отображать
              reward={task.reward}
              buttonActionLabel={getButtonLabel(task.name)}
              isTaskCompleted={task.isCompleted}
              onComplete={() => handleTaskCompletion(task.name as TaskNames)}
            >
              <TaskIcon taskName={task.name} />
            </TaskDailyBlock>
          ))}
        </div>
        {!isAllTasksCompleted ? (
          <div>
            <div className="my-3 h-[1px] bg-[#FFFFFF1F]" />
            <p className="font-inter text-center text-[14px] leading-[140%] font-[400] text-[#FFFFFF]">
              Complete all tasks and get an extra:
              <span className="font-pixel relative ml-2 leading-[120%] text-[#B6FF00] uppercase">
                <span className="absolute top-[1px] -left-1">+</span>
                <span>12</span>
                <span className="ml-1.5">H</span>
              </span>
            </p>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-[400] text-[#FFFFFF]">
            <p className="font-inter mb-1.5 text-[14px] leading-[140%]">
              Available via:
            </p>
            <div className="font-pixel text-[20px] leading-[24px]">
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
