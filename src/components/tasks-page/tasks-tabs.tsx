import { useAdsgram } from '@adsgram/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { isTMA, miniApp, popup, shareStory, shareURL } from '@tma.js/sdk'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { DrawerNft } from '@/components/ui/drawer-nft'
import { EmptyStateCard } from '@/components/ui/empty-state-card'
import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { useReferrals } from '@/hooks/api/use-referrals'
import {
  TaskNames,
  TasksDailyComboNames,
  useTasks,
} from '@/hooks/api/use-tasks'
import {
  ADSGRAM_APP_ID,
  FOUNDER_INSTAGRAM_URL,
  FOUNDER_TELEGRAM_URL,
  FOUNDER_TWITTER_URL,
  INSTAGRAM_URL,
  SELF_HOST_URL,
  TELEGRAM_APP_LINK,
  TELEGRAM_URL,
  TWITTER_URL,
  WEBSITE_URL,
  YOU_TUBE_URL,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { formatDurationFromSeconds } from '@/utils'

// Icons
import { CgWebsite } from 'react-icons/cg'
import { FaAd, FaArrowUp, FaCheck } from 'react-icons/fa'
import { MdOutlineShoppingBag } from 'react-icons/md'
import {
  TbBrandInstagram,
  TbBrandTelegram,
  TbBrandX,
  TbBrandYoutube,
  TbUsers,
} from 'react-icons/tb'

export function TasksTabs({ className }: { className?: string }) {
  // const router = useRouter()
  const { t } = useTranslation()

  const {
    tasksQuery: { data: tasks, isLoading, isError },
    completeTask,
  } = useTasks()
  const [play] = useSound('/sounds/Button.aac')

  const handleReward = useCallback(() => {
    completeTask({ taskName: TaskNames.WatchAd })
    completeTask({ taskName: TasksDailyComboNames.WatchAd })
  }, [completeTask])

  const adsConfig = useMemo(
    () => ({ blockId: ADSGRAM_APP_ID, debug: false, onReward: handleReward }),
    [handleReward],
  )

  const { show } = useAdsgram(adsConfig)

  const showAdClick = async () => {
    try {
      const result = await show()
      console.log('Реклама просмотрена:', result)
    } catch (error: any) {
      const message = error.message
      if (
        message.toLowerCase().includes('session is too long') ||
        message.toLowerCase().includes('сессия слишком долгая')
      ) {
        popup
          .show({
            title: t('tasks.ads.session-expired.title'),
            message: t('tasks.ads.session-expired.message'),
            buttons: [
              {
                id: 'close',
                type: 'default',
                text: t('tasks.ads.session-expired.close'),
              },
            ],
          })
          .then((buttonId) => {
            if (buttonId === 'close') {
              miniApp.close()
            }
          })
      }
    }
  }

  const progressTasks =
    tasks
      ?.filter((task) => task.status !== 'completed')
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)) ?? []
  const completedTasks =
    tasks
      ?.filter((task) => task.status === 'completed')
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)) ?? []

  const handleTaskAction = useCallback(
    (name: TaskNames) => {
      // Checks
      if (!isTMA()) {
        return toast.error(
          t('tasks.errors.only-telegram'),
        )
      }
      if (progressTasks.length === 0) {
        return toast.info(t('tasks.info.all-completed'))
      }

      // Tasks that complete via external actions
      // if (name === TaskNames.MintNFT) {
      //   if (!isDone) {
      //     return
      //   }
      // }
      if (name === TaskNames.WatchAd) {
        // const getRandomInt = (min: number, max: number): number => {
        //   return Math.floor(Math.random() * (max - min + 1)) + min
        // }

        showAdClick()
        // show()

        // setTimeout(
        //   () => completeTask({ taskName: name }),
        //   getRandomInt(25000, 30000),
        // )
        return
      }

      // Rest of tasks that complete via link opening
      // or other direct actions
      if (name === TaskNames.VisitWebsite) {
        // openLink(WEBSITE_URL, {
        //   tryBrowser: 'chrome',
        //   tryInstantView: true,
        // })
        window.open(WEBSITE_URL, '_blank')
      }
      if (name === TaskNames.SubscribeTwitter) {
        // openLink(TWITTER_URL, {
        //   tryBrowser: 'chrome',
        //   tryInstantView: true,
        // })
        window.open(TWITTER_URL, '_blank')
      }
      if (name === TaskNames.SubscribeTelegram) {
        window.open(TELEGRAM_URL, '_blank')
      }
      if (name === TaskNames.SubscribeInstagram) {
        // openLink(INSTAGRAM_URL, {
        //   tryBrowser: 'chrome',
        //   tryInstantView: true,
        // })
        window.open(INSTAGRAM_URL, '_blank')
      }
      if (name === TaskNames.SubscribeYoutube) {
        // openLink(YOU_TUBE_URL, {
        //   tryBrowser: 'chrome',
        //   tryInstantView: true,
        // })
        window.open(YOU_TUBE_URL, '_blank')
      }

      if(name === TaskNames.SubscribeTelegramFounder) {
        window.open(FOUNDER_TELEGRAM_URL, '_blank')
      }
      if(name === TaskNames.SubscribeInstagramFounder) {
        window.open(FOUNDER_INSTAGRAM_URL, '_blank')
      }
      if(name === TaskNames.SubscribeTwitterFounder) {
        window.open(FOUNDER_TWITTER_URL, '_blank')
      }


      if (name === TaskNames.PostTelegramStory) {
        shareStory(`${SELF_HOST_URL}/telegram/stories.jpg`, {
          text: 'Exploring the Nymb ecosystem! 💎 This project is a game-changer for Web3 gaming. Join the movement! 🚀',
          widgetLink: {
            url: TELEGRAM_URL,
            name: 'NYMB - time is money',
          },
        })
        // completeTask({ taskName: TasksDailyComboNames.PostTelegramStory })
      }
      completeTask({ taskName: name as TaskNames })
    },
    [progressTasks, t],
  )

  if (isError) return <div>{t('tasks.errors.loading')}</div>

  return (
    <Tabs
      defaultValue="new-tasks"
      className={cn('flex flex-col flex-1', className)}
      onValueChange={() => play()}
    >
      <TabsList className="inline-flex gap-2 items-center justify-center">
        <TabsTrigger
          className="font-pixel rounded-full text-xs leading-[120%] px-4 py-2 bg-white/10 text-white data-[state=active]:bg-[#B6FF00] data-[state=active]:text-black"
          value="new-tasks"
        >
          {t('tasks.tabs.new')}
        </TabsTrigger>
        <TabsTrigger
          className="font-pixel rounded-full text-xs leading-[120%] px-4 py-2 bg-white/10 text-white data-[state=active]:bg-[#B6FF00] data-[state=active]:text-black"
          value="completed-tasks"
        >
          {t('tasks.tabs.completed')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new-tasks" className="mt-7">
        <h2 className="text-base font-pixel text-white">
          {t('tasks.tabs.title')}
        </h2>
        <div className="mt-3">
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </>
          )}

          {!isLoading && progressTasks.length === 0 && (
            <EmptyStateCard
              title={t('tasks.empty.all')}
              description={t('tasks.empty.completed')}
            />
          )}

          {progressTasks.map((task) => (
            <TaskCard
              key={task.name}
              name={task.name}
              description={task.description}
              reward={task.reward}
              status={task.status}
              onClick={handleTaskAction}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="completed-tasks" className="mt-7">
        <h2 className="text-base font-pixel text-white">
          {t('tasks.tabs.title')}
        </h2>
        <div className="mt-3">
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </>
          )}

          {!isLoading && completedTasks.length === 0 && (
            <EmptyStateCard
              title={t('tasks.empty.none')}
              description={t('tasks.empty.completed')}
            />
          )}

          {completedTasks.map((task) => (
            <TaskCard
              key={task.name}
              name={task.name}
              description={task.description}
              reward={task.reward}
              status={'completed'}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

const TaskIcon = ({
  taskName,
  className,
}: {
  taskName: string
  className?: string
}) => {
  if (
    taskName === TaskNames.SubscribeTwitter ||
    taskName === TaskNames.SubscribeTwitterFounder
  ) {
    return <TbBrandX className={className} />
  }
  if (
    taskName === TaskNames.SubscribeTelegram ||
    taskName === TaskNames.SubscribeTelegramFounder
  ) {
    return <TbBrandTelegram className={className} />
  }
  if (
    taskName === TaskNames.SubscribeInstagram ||
    taskName === TaskNames.SubscribeInstagramFounder
  ) {
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

  if (
    taskName === TaskNames.Invite1Friends ||
    taskName === TaskNames.Invite3Friends ||
    taskName === TaskNames.Invite5Friends ||
    taskName === TaskNames.Invite10Friends
  ) {
    return <TbUsers className={className} />
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

const TaskCard = ({
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
  onClick?: (name: TaskNames, isDone?: boolean) => void
}) => {
  const { myReferrals, myCodes } = useReferrals()
  const { user } = useAccount()
  const { accountQuery } = useAccountMe()

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

    const referralsCount = myReferrals?.countVoucherReferrals0 || 0
    const mintLabel = accountQuery.data?.isEarlyAccessMinted ? 'check' : 'mint'
    const inviteFriendsLabel =
      referralsCount >=
      parseInt(name.replace('task-invite-', '').replace('-friends', ''))
        ? 'check'
        : 'invite'

    switch (name) {
      case TaskNames.SubscribeTwitter:
      case TaskNames.SubscribeTelegram:
      case TaskNames.SubscribeInstagram:
      case TaskNames.SubscribeYoutube:
      case TaskNames.SubscribeInstagramFounder:
      case TaskNames.SubscribeTelegramFounder:
      case TaskNames.SubscribeTwitterFounder:
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
        return mintLabel
      case TaskNames.PostTelegramStory:
        return 'post'
      case TaskNames.Invite1Friends:
      case TaskNames.Invite3Friends:
      case TaskNames.Invite5Friends:
      case TaskNames.Invite10Friends:
        return inviteFriendsLabel
      default:
        return 'go'
    }
  }, [
    name,
    status,
    myReferrals?.countVoucherReferrals0,
    accountQuery.data?.isEarlyAccessMinted,
  ])

  const isDisabledActionButton = useMemo(() => {
    if (status === 'pending') return true
    if (!accountQuery.data) return true

    if (name === TaskNames.ReachLevel11) {
      return accountQuery.data.lvl > 11
    }
    if (name === TaskNames.ReachLevel10) {
      return accountQuery.data.lvl > 10
    }
    if (name === TaskNames.ReachLevel9) {
      return accountQuery.data.lvl > 9
    }
    if (name === TaskNames.ReachLevel7) {
      return accountQuery.data.lvl > 7
    }

    return accountQuery.data.time * 1000 < Date.now()
  }, [accountQuery.data, name, status])

  return (
    <div
      className={cn(
        'w-full rounded-2xl px-4 py-3 h-auto inline-flex items-center justify-between bg-linear-to-b from-white/0 to-white/5',
        status === 'completed' && 'to-white/0',
        className,
      )}
    >
      <div className="inline-flex items-center gap-4">
        <TaskIcon taskName={name} className="size-6 text-white" />

        <div className="flex flex-col">
          <span className="font-semibold text-base leading-5">
            {description}
          </span>
          <span className="font-pixel text-xs uppercase opacity-40 inline-flex items-center gap-1">
            +{formattedReward.value}
            <span>{formattedReward.unit}</span>
          </span>
        </div>
      </div>
      {status === 'completed' ? (
        <div className="mt-2 inline-flex items-center justify-center text-sm rounded-xl bg-[#2b371a] text-[#B6FF00] size-8">
          <FaCheck />
        </div>
      ) : (
        <>
          {name === TaskNames.MintNFT && formatedButtonLabel !== 'check' ? (
            <DrawerNft asChild>
              <Button
                disabled={isDisabledActionButton}
                variant={'nymb-green'}
                className="text-black text-xs px-2 py-1 rounded-[8px] w-auto h-6 mt-2 uppercase active:opacity-50"
              >
                {formatedButtonLabel}
              </Button>
            </DrawerNft>
          ) : (
            <Button
              onClick={() => {
                if (formatedButtonLabel === 'invite') {
                  if (shareURL.isAvailable()) {
                    shareURL(
                      `${TELEGRAM_APP_LINK}?startapp=${user?.id}_${myCodes?.[0].code}`,
                      '🚀 Enter NYMB  -  where TIME turns into tokens!',
                    )
                  }
                  return
                }
                if (formatedButtonLabel === 'check') {
                  onClick?.(name as TaskNames, true)
                  return
                }
                onClick?.(name as TaskNames)
              }}
              disabled={isDisabledActionButton}
              variant={'nymb-green'}
              className="text-black text-xs px-2 py-1 rounded-[8px] w-auto h-6 mt-2 uppercase active:opacity-50"
            >
              {formatedButtonLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}

const TaskCardSkeleton = () => {
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
