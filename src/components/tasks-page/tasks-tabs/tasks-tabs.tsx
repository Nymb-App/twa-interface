import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { TaskCompletedSvgIcon } from '../tasks-daily-block/tasks-daily-block'
import type { ReactNode } from 'react'
import { ActionButton } from '@/components/ui/action-button'
import { cn } from '@/utils'
import { useTasks, TaskNames } from '@/hooks/api/use-tasks'
import type { ITask } from '@/hooks/api/use-tasks'
import { TWITTER_URL } from '@/constants'
import { formatTimeReward } from '@/utils'

const TaskItemSkeleton = () => {
  return (
    <div className="rounded-[14px] py-2 px-4 starboard-result-block-bg backdrop-blur-[16px] h-[56px]">
      <div className="flex justify-between items-center h-full animate-pulse">
        <div className="flex gap-4 items-center">
          <div className="w-5 h-5 bg-white/20 rounded"></div>
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-48 bg-white/20 rounded"></div>
            <div className="h-4 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="h-[24px] w-[50px] bg-white/20 rounded-[8px]"></div>
      </div>
    </div>
  )
}

export function TasksTabs() {
  const { tasksQuery, completeTask } = useTasks();
  const { data: tasks, isLoading, isError } = tasksQuery;

  const unfinishedTasks = tasks?.filter(task => !task.isCompleted) ?? [];
  const completedTasks = tasks?.filter(task => task.isCompleted) ?? [];

  const handleTaskAction = (task: ITask) => {
    if (task.name === TaskNames.SubscribeTwitter) {
      window.open(TWITTER_URL, '_blank', 'noopener,noreferrer');
    }
    completeTask({ taskName: task.name as TaskNames });
  }

  if (isError) return <div>Error loading tasks.</div>

  return (
    <section className='flex flex-col flex-1'>
      <Tabs defaultValue="new tasks" className='flex flex-col flex-1'>
        <TabsList className="flex justify-center gap-2 uppercase font-pixel mb-7">
          <TabsTrigger
            value="new tasks"
            className="data-[state=active]:bg-[#FFFFFF]
      data-[state=active]:text-[#121312] h-[30px] w-auto py-2 shrink-0
      bg-[#FFFFFF14] rounded-[64px] text-[#FFFFFF] font-pixel font-[400]
      text-[12px] leading-[120%] uppercase px-4"
          >
            <span>new tasks</span>
          </TabsTrigger>
          <TabsTrigger
            value="completed tasks"
            className="data-[state=active]:bg-[#FFFFFF]
      data-[state=active]:text-[#121312] h-[30px] w-auto py-2 shrink-0
      bg-[#FFFFFF14] rounded-[64px] text-[#FFFFFF] font-pixel font-[400]
      text-[12px] leading-[120%] uppercase px-4"
          >
            <span>completed</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent className='flex flex-col flex-1' value="new tasks">
          <h3 className="ml-4 font-pixel uppercase font-[400] text-[18px] leading-[24px] mb-3">
            Tasks
          </h3>
          {isLoading ? (
            <ul className="flex flex-col gap-2">
              <TaskItemSkeleton />
              <TaskItemSkeleton />
            </ul>
          ) : unfinishedTasks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              <AnimatePresence>
                {unfinishedTasks.map(task => (
                  <motion.li
                    key={task.name}
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem
                      title={task.description}
                      subtitle={
                        task.reward.type === 'time'
                          ? formatTimeReward(task.reward.value)
                          : `${task.reward.value} ENERGY`
                      }
                      buttonActionLabel={task.name === TaskNames.SubscribeTwitter ? 'join' : 'invite'}
                      icon={task.name === TaskNames.SubscribeTwitter ? <TwitterSvgIcon /> : <InviteFrenSvgIcon />}
                      setIsTaskCompleted={() => handleTaskAction(task)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <NoTasksBlock className='h-full flex-1' title="THERE ARE" subtitle="NO TASKS FOR TODAY" />
          )}
        </TabsContent>
        <TabsContent value="completed tasks">
          {completedTasks.length > 0 && (
            <h3 className="ml-4 font-pixel uppercase font-[400] text-[18px] leading-[24px] mb-3">
              Tasks
            </h3>
          )}
          {completedTasks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.name}
                  isTaskCompleted
                  title={task.description}
                  subtitle={
                    task.reward.type === 'time'
                      ? formatTimeReward(task.reward.value)
                      : `${task.reward.value} ENERGY`
                  }
                  buttonActionLabel={task.name === TaskNames.SubscribeTwitter ? 'join' : 'invite'}
                  icon={task.name === TaskNames.SubscribeTwitter ? <TwitterSvgIcon /> : <InviteFrenSvgIcon />}
                />
              ))}
            </ul>
          ) : (
            <NoTasksBlock title="THERE ARE" subtitle="NO TASKS FOR TODAY" />
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}

export const TaskItem = ({
  isTaskCompleted = false,
  setIsTaskCompleted,
  title,
  subtitle,
  buttonActionLabel,
  icon,
}: {
  setIsTaskCompleted?: () => void
  isTaskCompleted?: boolean
  title: string
  subtitle: string
  buttonActionLabel: string
  icon: ReactNode
}) => {
  return (
    <div
      className={cn(
        'rounded-[14px] py-2 px-4',
        !isTaskCompleted && 'starboard-result-block-bg backdrop-blur-[16px]',
      )}
    >
      <div className="flex justify-between items-center font-[400]">
        <div className="font-inter flex gap-4 items-center">
          <div className={cn(isTaskCompleted && 'opacity-40')}>{icon}</div>
          <div>
            <p
              className={cn(
                'mr-2 font-[600] text-[16px] leading-5',
                isTaskCompleted && 'text-[#FFFFFF]/40',
              )}
            >
              {title}
            </p>
            <span className="font-pixel text-[14px] leading-[120%] text-[#FFFFFF]/40 uppercase">
              <span>+</span>
              <span>{subtitle}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTaskCompleted ? (
            <TaskCompletedSvgIcon />
          ) : (
            <ActionButton
              onClick={setIsTaskCompleted}
              className="rounded-[8px] font-[400] w-auto h-[24px] text-[#121312] uppercase leading-[16%] text-[12px]"
            >
              <span>{buttonActionLabel}</span>
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  )
}

export const TwitterSvgIcon = ({ fill = 'white' }: { fill?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2035 1.875H17.9602L11.9377 8.75833L19.0227 18.125H13.4752L9.13017 12.4442L4.1585 18.125H1.40017L7.84183 10.7625L1.04517 1.875H6.7335L10.661 7.0675L15.2035 1.875ZM14.236 16.475H15.7635L5.9035 3.43833H4.26433L14.236 16.475Z"
        fill={fill}
      />
    </svg>
  )
}

export const InviteFrenSvgIcon = ({ fill = 'white' }: { fill?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.1875 11.5623C9.94884 11.5623 12.1874 13.8009 12.1875 16.5623V17.4998C12.1875 18.0175 11.7678 18.4373 11.25 18.4373C10.7322 18.4373 10.3125 18.0175 10.3125 17.4998V16.5623C10.3124 14.8365 8.91331 13.4373 7.1875 13.4373H5.3125C3.58669 13.4373 2.18763 14.8365 2.1875 16.5623V17.4998C2.1875 18.0175 1.76777 18.4373 1.25 18.4373C0.732233 18.4373 0.3125 18.0175 0.3125 17.4998V16.5623C0.312632 13.8009 2.55116 11.5623 5.3125 11.5623H7.1875ZM14.6875 9.06226C17.4488 9.06236 19.6874 11.301 19.6875 14.0623V14.9998C19.6875 15.5175 19.2677 15.9372 18.75 15.9373C18.2323 15.9372 17.8125 15.5175 17.8125 14.9998V14.0623C17.8124 12.3365 16.4132 10.9374 14.6875 10.9373H12.8125C12.2847 10.9373 11.7894 11.0675 11.3555 11.2966C10.8977 11.5382 10.3306 11.3628 10.0889 10.905C9.84749 10.4473 10.0228 9.88012 10.4805 9.63843C11.1776 9.27033 11.9723 9.06228 12.8125 9.06226H14.6875ZM6.25 2.91675C8.09087 2.91675 9.58288 4.40892 9.58301 6.24976C9.58301 8.0907 8.09095 9.58276 6.25 9.58276C4.40905 9.58276 2.91699 8.0907 2.91699 6.24976C2.91712 4.40892 4.40913 2.91675 6.25 2.91675ZM6.25 4.58276C5.32961 4.58276 4.58314 5.32939 4.58301 6.24976C4.58301 7.17023 5.32953 7.91675 6.25 7.91675C7.17047 7.91675 7.91699 7.17023 7.91699 6.24976C7.91686 5.32939 7.17039 4.58276 6.25 4.58276ZM12.5 0.416748C14.3407 0.416896 15.8339 1.90901 15.834 3.74976C15.834 5.59061 14.3408 7.08262 12.5 7.08276C12.0399 7.08259 11.667 6.70989 11.667 6.24976C11.6671 5.78974 12.04 5.41692 12.5 5.41675C13.4203 5.4166 14.167 4.67014 14.167 3.74976C14.1669 2.82948 13.4203 2.08291 12.5 2.08276C12.077 2.08284 11.6926 2.24024 11.3984 2.49976C11.0534 2.80429 10.5262 2.77151 10.2217 2.42651C9.91715 2.08148 9.94993 1.55432 10.2949 1.24976C10.8819 0.731775 11.6555 0.416828 12.5 0.416748Z"
        fill={fill}
      />
    </svg>
  )
}

export const NoTasksBlock = ({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle: string
  className?: string
}) => {
  return (
    <div className={cn("h-[246px] flex flex-col items-center justify-center font-pixel mt-4", className)}>
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-[#B6FF0014] blur-[28px] shadow-[0px_0px_0px_3px_#B6FF00]" />
        <div className="relative flex items-center justify-center">
          <div className="text-[#B6FF00] text-[76px] font-[400] leading-[120%]">
            :
          </div>
        </div>
      </div>
      <div className="text-center text-[#FFFFFF] font-[400] leading-[24px] text-[18px]">
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}
