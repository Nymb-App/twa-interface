import { FriendsIcon } from '@/assets/icons/menu-icons/friends-icon'
import { OptionalSVG } from '@/assets/svg/optional'
import { Card } from '@/components/ui/card'
import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { useReferrals } from '@/hooks/api/use-referrals'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'
import { useMint } from '@/hooks/use-mint'
import {
  ITEM_NFT_PRICE,
  RECEIVER_ADDRESS,
  TELEGRAM_APP_URL,
  TELEGRAM_URL,
  TWITTER_URL,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { shareURL } from '@tma.js/sdk'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaXTwitter } from 'react-icons/fa6'
import { RiTelegram2Line } from 'react-icons/ri'
import { TbReload } from 'react-icons/tb'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { LazyVideo } from './lazy-video'
import { NumberedItem, NumberedList } from './nymb-list'
import { StarsCard } from './stars-card'
import { TaskCompletedSvgIcon } from './tasks-page/task-icons'
import { TransferTonButton } from './transfer-ton-button'
import { CopyButton } from './ui/copy-button'
import { useTranslation } from 'react-i18next'

export function MintSection() {
  const { t } = useTranslation();
  const tonConnectUI = useTonConnectUI()
  const { mintProgress: mintProgressData, mint } = useMint()
  const { accountQuery } = useAccountMe()
  const { user } = useAccount()
  const { myCodes } = useReferrals()
  const { completeTask, tasksQuery } = useTasks()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  const [mintProgress, setMintProgress] = useState(false)
  const mintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const code = useMemo(() => {
    return myCodes && myCodes.length > 0
      ? myCodes[0]
      : {
          code: 'NYMB123',
          royalty: 10,
          referralsCount: 0,
        }
  }, [myCodes])

  const isMinted = useMemo(() => {
    if (accountQuery.data) {
      return accountQuery.data.isEarlyAccessMinted
    }
    return false
  }, [accountQuery.data])

  const isNftProgressFinished = useMemo(() => {
    return mintProgressData?.progress === 100
  }, [mintProgressData?.progress])

  const isSubscribedTelegram = useMemo(() => {
    return accountQuery.data?.isSubscribed
  }, [accountQuery])

  const isMintDisabled = useMemo(() => {
    if (isMinted) {
      return true
    }
    if (mintProgress) {
      return true
    }
    if (!tonConnectUI[0].connected) {
      return false
    }
    if (accountQuery.data) {
      return accountQuery.data.isEarlyAccessMinted
    }
    if (mintProgressData?.progress === 100) {
      return true
    }
    return false
  }, [
    accountQuery.data,
    mintProgress,
    mintProgressData?.progress,
    tonConnectUI[0].connected,
    isMinted,
  ])

  const handleTwitterTaskAction = (taskName: TaskNames) => {
    if (taskName === TaskNames.SubscribeTwitter) {
      window.open(TWITTER_URL, '_blank', 'noopener,noreferrer')
    }
    completeTask({ taskName })
  }

  const isCompletedTaskTwitter = (taskName: TaskNames) => {
    return tasksQuery.data?.some(
      (task) => task.name === taskName && task.status === 'completed',
    )
  }

  useEffect(() => {
    return () => stop()
  }, [play])

  useEffect(() => {
    return () => {
      if (mintIntervalRef.current) {
        clearInterval(mintIntervalRef.current)
        mintIntervalRef.current = null
      }
    }
  }, [])

  return (
    <section className="relative text-white scroll-mt-45">
      <StarsCard
        className="mt-10 animate-slide-up-fade-0 h-[180px] mask-no-clip mask-[linear-gradient(to_bottom,black_10%,transparent_60%)]"
        classNameDescription0="hidden"
        classNameDescription1="hidden"
        classNameTitle="hidden"
        classNameStar3="hidden"
        classNameAction="hidden"
        classNameStar0="hidden"
        classNameStar1="hidden"
        classNameStar2="hidden"
      />
      <div className="animate-slide-up-fade-0  absolute left-1/2 -translate-x-1/2 top-0 inline-flex h-[88px] w-full justify-center">
        <img
          src="/index-page/star-left.png"
          alt="Stars"
          className={cn('w-20 h-full object-cover mt-3')}
        />
        <img
          src="/index-page/star-center.png"
          alt="Stars"
          className={cn('w-[92px] h-full object-cover')}
        />
        <img
          src="/index-page/star-right.png"
          alt="Stars"
          className={cn('w-[78px] h-full object-cover mt-4')}
        />
      </div>

      <div className="animate-slide-up-fade-0 mb-10 absolute w-full top-28 left-0 uppercase">
        <h2 className="font-pixel text-2xl text-center">{t('stars-giveaway.join-description0', {amount: "1,000,000"})}</h2>
        <h2 className="font-pixel text-2xl text-center">{t('stars-giveaway.join-description1')}</h2>
      </div>

      <NumberedList
        showLine
        className="relative flex flex-col gap-3 w-full animate-slide-up-fade-1"
      >
        <NumberedItem className="w-full mb-3">
          <NumberedItem.Title>
            {t('stars-giveaway.list.0.title')}
          </NumberedItem.Title>
          <NumberedItem.Description className="whitespace-pre-line">
            {t('stars-giveaway.list.0.description')}
          </NumberedItem.Description>

          <div className="w-full mt-3 mb-4 flex flex-col gap-2">
            <div className="rounded-xl bg-linear-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
              <div className="inline-flex gap-4 items-center">
                <FaXTwitter className="text-white size-5" />
                <div className="flex flex-col">
                  <span className="text-base font-inter font-semibold text-white tracking-normal">
                    Nymb
                  </span>
                  <span className="text-xs font-pixel text-white/40 tracking-normal">
                    X
                  </span>
                </div>
              </div>

              <div className="inline-flex gap-2">
                {!isCompletedTaskTwitter(TaskNames.SubscribeTwitter) ? (
                  <>
                    <button
                      onClick={async () => {
                        play()
                        await tasksQuery.refetch()
                      }}
                      className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1"
                    >
                      <TbReload className="scale-x-[-1]" />
                    </button>
                    <button
                      onClick={() => {
                        play()
                        handleTwitterTaskAction(TaskNames.SubscribeTwitter)
                      }}
                      className="text-sm font-pixel text-black h-6 pt-1 bg-linear-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                    >
                      open
                    </button>
                  </>
                ) : (
                  <div className="bg-[#2c3816] text-[#B6FF00] size-6  flex justify-center items-center rounded-lg">
                    <TaskCompletedSvgIcon fill="none" stroke="#B6FF00" />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-linear-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
              <div className="inline-flex gap-4 items-center">
                <RiTelegram2Line className="text-white size-5" />
                <div className="flex flex-col">
                  <span className="text-base font-inter font-semibold text-white tracking-normal">
                    Nymb
                  </span>
                  <span className="text-xs font-pixel text-white/40 tracking-normal">
                    TELEGRAM
                  </span>
                </div>
              </div>

              <div className="inline-flex gap-2">
                {!isSubscribedTelegram ? (
                  <>
                    <button
                      onClick={async () => {
                        play()
                        await accountQuery.refetch()
                      }}
                      className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1"
                    >
                      <TbReload className="scale-x-[-1]" />
                    </button>
                    <a
                      onClick={() => {
                        play()
                      }}
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm font-pixel text-black h-6 pt-[1px] bg-gradient-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                    >
                      open
                    </a>
                  </>
                ) : (
                  <div className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg">
                    <TaskCompletedSvgIcon fill="none" stroke="#B6FF00" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </NumberedItem>

        <NumberedItem className="w-full mb-3">
          <NumberedItem.Title>
            {t('stars-giveaway.list.1.title')}
          </NumberedItem.Title>
          <NumberedItem.Description className="whitespace-pre-line">
            {t('stars-giveaway.list.1.description')}
          </NumberedItem.Description>

          <div className="w-full mt-3 mb-4 flex flex-col gap-2">
            <div className="rounded-xl bg-linear-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
              <div className="inline-flex gap-4 items-center">
                <FriendsIcon fillOpacity="1" className="size-5" />
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-base font-inter font-semibold text-white tracking-normal">
                      {code.code}
                    </span>
                    <CopyButton
                      content={`${TELEGRAM_APP_URL}?startapp=${user?.id}_${code.code}`}
                    />
                  </div>
                  <span className="text-xs font-pixel text-white/40 tracking-normal">
                    {code.referralsCount} FRENS
                  </span>
                </div>
              </div>

              <div className="inline-flex gap-2">
                {/* <button className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1">
                  <TbReload className="scale-x-[-1]" />
                </button> */}
                <button
                  onClick={() => {
                    play()
                    const telegramLink =
                      import.meta.env.VITE_TELEGRAM_APP_LINK ||
                      'https://t.me/nymb_twa_bot/nymb'
                    if (shareURL.isAvailable()) {
                      shareURL(
                        `${telegramLink}?startapp=${user?.id}_${code.code}`,
                        '🚀 Enter NYMB  -  where TIME turns into tokens!',
                      )
                    }
                  }}
                  content={`${TELEGRAM_APP_URL}?startapp=${user?.id}_${code.code}`}
                  className="w-fit min-w-[83px] text-sm font-pixel text-black h-6 bg-gradient-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                >
                  INVITE
                </button>
              </div>
            </div>
          </div>
        </NumberedItem>

        <NumberedItem>
          <NumberedItem.Title className="relative inline-flex gap-2 items-center">
            <span>{t('stars-giveaway.list.2.title')}</span>
            <div className="relative">
              <OptionalSVG className={cn("absolute -top-6", )} />
            </div>
          </NumberedItem.Title>
          <NumberedItem.Description className="whitespace-pre-line">
            {t('stars-giveaway.list.2.description')}
          </NumberedItem.Description>
        </NumberedItem>
      </NumberedList>

      <div className="inline-flex w-full gap-2 mt-6 animate-slide-up-fade-5">
        <Card className="w-full flex flex-col bg-[#161715]">
          <div className="relative">
            <LazyVideo
              className="mx-auto"
              src="/webm/nft.mp4"
              poster="/webm/mint-video-placeholder.png"
            />
            <div className="absolute w-full h-[90px] bg-linear-to-b from-[#0b0b0b]/50 from-20% to-[#161715] pointer-events-none -bottom-1" />
          </div>
          <div className="absolute w-full h-full bg-[url('/index-page/nft-bg.png')] bg-cover bg-top pointer-events-none" />
          <div className="inline-flex gap-2 items-center font-pixel mx-auto text-[#B6FF00] z-10 -mt-11">
            <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
              45%
            </h2>
            <div className="flex flex-col text-sm">
              <span>{t('mint.already')}</span>
              <span>{t('mint.minted')}</span>
            </div>
          </div>
          <div className="mt-6 px-4 relative">
            <TransferTonButton
              disabled={isMintDisabled}
              recipient={RECEIVER_ADDRESS}
              amount={ITEM_NFT_PRICE}
              className="py-4 w-full inline-flex justify-center items-center gap-1"
              onTransferSuccess={async (hash) => {
                // setMintProgress(true)

                // if (mintIntervalRef.current) {
                //   clearInterval(mintIntervalRef.current)
                //   mintIntervalRef.current = null
                // }

                // const id = setInterval(async () => {
                //   const res = await accountQuery.refetch()
                //   if (res.data?.isEarlyAccessMinted === true) {
                //     clearInterval(id)
                //     mintIntervalRef.current = null
                //     setMintProgress(false)
                //     // toast.success('NFT purchased!')
                //   }
                // }, 2000)

                // mintIntervalRef.current = id
                await mint(hash)
              }}
              // comment={`nymb.mint?type=nft&telegramId=${user?.id}`}
              onError={(e) => {
                setMintProgress(false)
                if (mintIntervalRef.current) {
                  clearInterval(mintIntervalRef.current)
                  mintIntervalRef.current = null
                }
                if (e.message === 'Insufficient balance') {
                  toast.error(e.message)
                } else if (e.message === "You can't send to yourself") {
                  toast.error(e.message)
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              {isMinted
                ? t('nft.status.already-minted')
                : mintProgress
                  ? t('nft.status.minting')
                  : isNftProgressFinished
                    ? t('nft.status.no-nft-left')
                    : t('nft.mint', { amount: ITEM_NFT_PRICE })}
            </TransferTonButton>
          </div>
          <span className="mt-3 text-[#B6FF00]/60 mx-auto">
            {t('nft.description')}
          </span>
        </Card>
      </div>
    </section>
  )
}
