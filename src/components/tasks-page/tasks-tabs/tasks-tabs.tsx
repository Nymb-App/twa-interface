import { useEffect, useMemo } from 'react'
import { ActionButton } from '@/components/ui/action-button'
import { TWITTER_URL } from '@/constants'
import { useAccountMe } from '@/hooks/api/use-account'
import type { ITask } from '@/hooks/api/use-tasks'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'
import { cn, formatTimeReward } from '@/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import useSound from 'use-sound'
import { InviteFrenSvgIcon } from '../task-icons'
import { TaskCompletedSvgIcon } from '../tasks-daily-block/tasks-daily-block'

// Icons
import { FaAd, FaArrowUp  } from 'react-icons/fa';
import { TbBrandTelegram, TbBrandInstagram, TbBrandYoutube, TbBrandX } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useReferrals } from '@/hooks/api/use-referrals'
import { shareURL } from '@tma.js/sdk'
import { ADSGRAM_APP_ID } from '@/lib/constants'
import { useAdsgram } from '@adsgram/react'
import { useRouter } from '@tanstack/react-router'



export function TasksTabs() {
  const { tasksQuery, completeTask } = useTasks()
  const { data: tasks, isLoading, isError } = tasksQuery
  const [play, { stop }] = useSound('/sounds/Button.aac')

  const unfinishedTasks = tasks?.filter((task) => !task.isCompleted) ?? []
  const completedTasks = tasks?.filter((task) => task.isCompleted) ?? []

  const handleTaskAction = (task: ITask) => {
    if (task.name === TaskNames.SubscribeTwitter) {
      window.open(TWITTER_URL, '_blank', 'noopener,noreferrer')
    }
    if (task.name === TaskNames.SubscribeTelegram) {
      const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://telegram-apps.com/nymb'
      window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer')
    }
    completeTask({ taskName: task.name as TaskNames })
  }

  useEffect(() => {
    return () => stop()
  }, [play])

  if (isError) return <div>Error loading tasks.</div>

  return (
    <section className="flex flex-col flex-1">
      <Tabs
        defaultValue="new tasks"
        onValueChange={() => play()}
        className="flex flex-col flex-1"
      >
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
        <TabsContent className="flex flex-col flex-1" value="new tasks">
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
                {unfinishedTasks.map((task) => (
                  <motion.li
                    key={task.name}
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem
                      taskName={task.name as TaskNames}
                      title={task.description}
                      subtitle={
                        task.reward.type === 'time'
                          ? formatTimeReward(task.reward.value)
                          : `${task.reward.value} ENERGY`
                      }
                      buttonActionLabel={getButtonLabel(task.name)}
                      icon={<TaskIcon taskName={task.name} className='size-6' />}
                      setIsTaskCompleted={() => handleTaskAction(task)}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <NoTasksBlock
              className="h-full flex-1"
              title="THERE ARE"
              subtitle="NO TASKS FOR TODAY"
            />
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
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.name}
                  isTaskCompleted
                  title={task.description}
                  subtitle={
                    task.reward.type === 'time'
                      ? formatTimeReward(task.reward.value)
                      : `${task.reward.value} ENERGY`
                  }
                  buttonActionLabel={getButtonLabel(task.name)}
                  icon={<TaskIcon taskName={task.name} className='size-6' />}
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

const getButtonLabel = (taskName: string) => {
  switch (taskName) {
    case TaskNames.SubscribeTwitter:
    case TaskNames.SubscribeTelegram:
    case TaskNames.SubscribeInstagram:
    case TaskNames.SubscribeYoutube:
      return 'join'
    case TaskNames.WatchAd:
      return 'watch'
    case TaskNames.ReachLevel10:
    case TaskNames.ReachLevel11:
    case TaskNames.ReachLevel9:
    case TaskNames.ReachLevel7:
      return 'check'
    case TaskNames.VisitWebsite:
      return 'visit'
    case TaskNames.MintNFT:
      return 'mint'
    case TaskNames.PostTelegramStory:
      return 'post'
    case TaskNames.Invite1Friends:
    case TaskNames.Invite3Friends:
    case TaskNames.Invite5Friends:
    case TaskNames.Invite10Friends:
      return 'invite'
    default:
      return 'go'
  }
}

const TaskIcon = ({ taskName, className }: { taskName: string; className?: string }) => {
  if (taskName === TaskNames.SubscribeTwitter) {  
    return <TbBrandX className={className} />
  }
  if (taskName === TaskNames.SubscribeTelegram) {
    return <TbBrandTelegram className={className} />
  }
  if (taskName === TaskNames.SubscribeInstagram) {
    return <TbBrandInstagram className={className} />
  }
  if (taskName === TaskNames.SubscribeYoutube) {
    return <TbBrandYoutube className={className} />
  }

  if (taskName === TaskNames.VisitWebsite) {
    return <CgWebsite className={className} />
  }

  if (taskName === TaskNames.MintNFT) {
    return <MdOutlineShoppingBag className={className} />
  }


  if (taskName === TaskNames.Invite1Friends ||
      taskName === TaskNames.Invite3Friends ||
      taskName === TaskNames.Invite5Friends ||
      taskName === TaskNames.Invite10Friends) {
    return <InviteFrenSvgIcon className={className} />
  }
  if (taskName === TaskNames.WatchAd) {
    return <FaAd className={className} />
  }

  if (
      taskName === TaskNames.ReachLevel10 ||
      taskName === TaskNames.ReachLevel11 ||
      taskName === TaskNames.ReachLevel9 ||
      taskName === TaskNames.ReachLevel7
    ) {
    return <FaArrowUp className={className} />
  }

  if (taskName === TaskNames.PostTelegramStory) {
    return <TbBrandTelegram className={className} />
  }
  return null
}

export const TaskItem = ({
  taskName,
  isTaskCompleted = false,
  setIsTaskCompleted,
  title,
  subtitle,
  buttonActionLabel,
  icon,
}: {
  taskName?: TaskNames
  setIsTaskCompleted?: () => void
  isTaskCompleted?: boolean
  title: string
  subtitle: string
  buttonActionLabel: string
  icon: ReactNode
}) => {
  const router = useRouter()
  const { accountQuery } = useAccountMe();
  const { myReferrals } = useReferrals();
  const { show } = useAdsgram({
    blockId: ADSGRAM_APP_ID,
    debug: false,
    onReward: setIsTaskCompleted,
  });
  const referralsCount = myReferrals?.countVoucherReferrals0 || 0;

  const isWatchAd = taskName === TaskNames.WatchAd;
  const isInviteFriendsTask = taskName?.startsWith('task-invite-');
  const buttonActionLabelFinal = !isInviteFriendsTask ? buttonActionLabel : referralsCount >= parseInt(taskName!.replace('task-invite-', '').replace('-friends', '')) ? 'check' : buttonActionLabel;

  const isDisabledActionButton = useMemo(() => {
    if (!accountQuery.data) return true
    if(taskName !== undefined) {
      if(taskName === TaskNames.ReachLevel11) {
        return accountQuery.data.lvl > 11
      }
      if(taskName === TaskNames.ReachLevel10) {
        return accountQuery.data.lvl > 10
      }
      if(taskName === TaskNames.ReachLevel9) {
        return accountQuery.data.lvl > 9
      }
      if(taskName === TaskNames.ReachLevel7) {
        return accountQuery.data.lvl > 7
      }
    }
    return accountQuery.data.time * 1000 < Date.now()
  }, [accountQuery.data, taskName])

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
              disabled={isDisabledActionButton}
              onClick={() => {
                if(taskName === TaskNames.MintNFT) {
                  router.navigate({ to: '/shop' });
                  return;
                }

                if(isWatchAd) {
                  show();
                  return;
                }
                if(isInviteFriendsTask && referralsCount < parseInt(taskName!.replace('task-invite-', '').replace('-friends', ''))) {
                  const telegramLink = import.meta.env.VITE_TELEGRAM_APP_LINK || 'https://telegram-apps.com'
                  if (shareURL.isAvailable()) {
                    shareURL(telegramLink, 'Check out this cool app!')
                  }
                  return;
                }
                setIsTaskCompleted?.();
              }}
              className="disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] font-[400] w-auto h-[24px] text-[#121312] uppercase leading-[16%] text-[12px]"
            >
              <span>{buttonActionLabelFinal}</span>
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  )
}

export const NoTasksBlock = ({
  title,
  subtitle,
  className,
  classNameText,
}: {
  title: string
  subtitle?: string
  className?: string
  classNameText?: string
}) => {
  return (
    <div
      className={cn(
        'h-[246px] flex flex-col items-center justify-center font-pixel mt-4',
        className,
      )}
    >
      <div className="relative mb-4 animate-battle-finding-dots-pulse">
        <div className="absolute inset-0 rounded-full bg-[#B6FF0014] blur-[28px] shadow-[0px_0px_0px_3px_#B6FF00]" />
        <div className="relative flex items-center justify-center">
          <div className="text-[#B6FF00] text-[76px] font-[400] leading-[120%]">
            :
          </div>
        </div>
      </div>
      <div
        className={cn(
          'text-center text-[#FFFFFF] font-[400] leading-[24px] text-[18px]',
          classNameText,
        )}
      >
        <p>{title}</p>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

export const TaskItemSkeleton = () => {
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
