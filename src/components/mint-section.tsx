import { useMemo } from 'react'
import { toast } from 'sonner'
import { FaXTwitter } from 'react-icons/fa6'
import { RiTelegram2Line } from 'react-icons/ri'
import { TbReload } from 'react-icons/tb'
import { TransferTonButton } from './transfer-ton-button'
import { NumberedItem, NumberedList } from './nymb-list'
import { CopyButton } from './ui/copy-button'
import { TaskCompletedSvgIcon } from './tasks-page/task-icons'
import { Card } from '@/components/ui/card'
import { useMint } from '@/hooks/use-mint'
import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { TELEGRAM_APP_URL } from '@/lib/constants'
import { useReferrals } from '@/hooks/api/use-referrals'
import { FriendsIcon } from '@/assets/icons/menu-icons/friends-icon'
import { OptionalSVG } from '@/assets/svg/optional'
import { TELEGRAM_URL, TWITTER_URL } from '@/constants'
import { TaskNames, useTasks } from '@/hooks/api/use-tasks'

function LazyVideo({
  src,
  className,
  style,
  poster,
}: {
  src?: string
  className?: string
  style?: React.CSSProperties
  poster?: string
}) {
  // Basic implementation of LazyVideo, you might want to enhance this
  return (
    <video
      src={src}
      className={className}
      style={style}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}

export function MintSection() {
  const { mintProgress, mint } = useMint()
  const { accountQuery } = useAccountMe()
  const { user } = useAccount()
  const { myCodes } = useReferrals()
  const { completeTask, tasksQuery } = useTasks()

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
    return mintProgress?.progress === 100
  }, [mintProgress?.progress])

  const isMintDisabled = useMemo(() => {
    if (accountQuery.data) {
      return accountQuery.data.isEarlyAccessMinted
    }
    if (mintProgress?.progress === 100) {
      return true
    }
    return false
  }, [accountQuery.data, mintProgress?.progress])

  const handleTwitterTaskAction = (taskName: TaskNames) => {
    if (taskName === TaskNames.SubscribeTwitter) {
      window.open(TWITTER_URL, '_blank', 'noopener,noreferrer')
    }
    completeTask({ taskName })
  }

  const isCompletedTaskTwitter = (taskName: TaskNames) => {
    return tasksQuery.data?.some(
      (task) => task.name === taskName && task.isCompleted,
    )
  }

  const isSubscribedTelegram = useMemo(() => {
    return accountQuery.data?.isSubscribed
  }, [accountQuery])

  return (
    <section id="join-giveaway" className="relative text-white px-3">
      <div className="animate-slide-up-fade-3">
        <h2 className="font-pixel text-2xl text-center">JOIN THE GIVEAWAY</h2>
        <h2 className="font-pixel text-2xl text-center">AND BE A WINNER</h2>
      </div>

      <NumberedList showLine className="relative flex flex-col gap-3 w-full">
        <NumberedItem className="w-full">
          <NumberedItem.Title>Subscribe to Nymb</NumberedItem.Title>
          <NumberedItem.Description>
            To participate in the giveaway, you must be
            <br />
            subscribed to social media
          </NumberedItem.Description>

          <div className="w-full mt-3 mb-4 flex flex-col gap-2">
            <div className="rounded-xl bg-gradient-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
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
                        await tasksQuery.refetch()
                      }}
                      className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1"
                    >
                      <TbReload className="scale-x-[-1]" />
                    </button>
                    <button
                      onClick={() =>
                        handleTwitterTaskAction(TaskNames.SubscribeTwitter)
                      }
                      className="text-sm font-pixel text-black h-6 bg-gradient-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                    >
                      SUBSCRIBE
                    </button>
                  </>
                ) : (
                  <div className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg">
                    <TaskCompletedSvgIcon fill="none" stroke="#B6FF00" />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
              <div className="inline-flex gap-4 items-center">
                <RiTelegram2Line className="text-white size-7" />
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
                        await accountQuery.refetch()
                      }}
                      className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1"
                    >
                      <TbReload className="scale-x-[-1]" />
                    </button>
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-pixel text-black h-6 bg-gradient-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                    >
                      SUBSCRIBE
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

        <NumberedItem className="w-full">
          <NumberedItem.Title>Invite your frens</NumberedItem.Title>
          <NumberedItem.Description>
            Increase your chances and receive game
            <br />
            bonuses for each friend you refer
          </NumberedItem.Description>

          <div className="w-full mt-3 mb-4 flex flex-col gap-2">
            <div className="rounded-xl bg-gradient-to-b from-transparent to-white/5 inline-flex items-center justify-between px-4 py-2 w-full">
              <div className="inline-flex gap-4 items-center">
                <FriendsIcon fillOpacity="1" className="size-6" />
                <div className="flex flex-col">
                  <span className="text-base font-inter font-semibold text-white tracking-normal">
                    {code.code}
                  </span>
                  <span className="text-xs font-pixel text-white/40 tracking-normal">
                    {code.referralsCount} FRENS
                  </span>
                </div>
              </div>

              <div className="inline-flex gap-2">
                <button className="bg-[#2c3816] text-[#B6FF00] size-6 flex justify-center items-center rounded-lg p-1">
                  <TbReload className="scale-x-[-1]" />
                </button>
                <CopyButton
                  content={`${TELEGRAM_APP_URL}?startapp=${user?.id}_${code.code}`}
                  className="w-fit min-w-[83px] text-sm font-pixel text-black h-6 bg-gradient-to-b from-[#A0D600] to-[#B6FF00] rounded-lg px-3"
                >
                  INVITE
                </CopyButton>
              </div>
            </div>
          </div>
        </NumberedItem>

        <NumberedItem>
          <NumberedItem.Title className="relative">
            Mint Nymb NFT
            <OptionalSVG className="absolute left-[51%] -top-4" />
          </NumberedItem.Title>
          <NumberedItem.Description>
            Increase your chances and get the best
            <br />
            deals and benefits along the way
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
            <div className="absolute w-full h-[90px] bg-gradient-to-b from-[#0b0b0b]/50 from-20% to-[#161715] pointer-events-none -bottom-1" />
          </div>
          <div className="absolute w-full h-full bg-[url('/index-page/nft-bg.png')] bg-cover bg-top pointer-events-none" />
          <div className="inline-flex gap-2 items-center font-pixel mx-auto text-[#B6FF00] z-10 -mt-11">
            <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
              45%
            </h2>
            <div className="flex flex-col text-sm">
              <span>ALREADY</span>
              <span>MINTED</span>
            </div>
          </div>
          <div className="mt-6 px-4">
            <TransferTonButton
              disabled={isMintDisabled}
              recipient="UQBLtmzfUtD0QDe6zLYJSOd_O9f3nwaD1kuNmuD1rrktyjNs"
              amount={1}
              className="py-4 w-full inline-flex justify-center items-center gap-1"
              onTransferSuccess={async (hash) => {
                toast.success('NFT purchased!')
                await mint(hash)
              }}
              onError={(e) => {
                if (e.message === 'Insufficient balance') {
                  toast.error('Insufficient balance')
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              {isMinted
                ? 'ALREADY MINTED'
                : isNftProgressFinished
                  ? 'NO NFT LEFT'
                  : 'MINT FOR 1 TON'}
            </TransferTonButton>
          </div>
          <span className="mt-3 text-[#B6FF00]/60 mx-auto">
            One for the wallet
          </span>
        </Card>
      </div>
    </section>
  )
}
