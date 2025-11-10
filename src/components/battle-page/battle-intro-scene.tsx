import { useAccount, useAccountMe } from '@/hooks/api/use-account'
import { cn, convertTimestampToDaysUnit } from '@/utils'
import { useMemo, useState } from 'react'
import { ActionButton } from '../ui/action-button'
import { BattleCard } from './battle-card'
import { BattleGameRewardSection, BattleTitle } from './battle-preview-screen'
import { BattleBustButtons } from './ui/battle-bust-buttons'

import ChooseOpponent from '@/assets/svg/choose-opponent'
import { FaRandom } from 'react-icons/fa'
import { PiShareFatBold } from 'react-icons/pi'
import { ShareBattleInviteButton } from '../ui/share-button'

export const BattleIntroScene = ({
  className,
  onFindingOpponent,
  onAnimationEnd,
  onJoinGame,
}: {
  className?: string
  onFindingOpponent?: () => void
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
  onJoinGame?: (bet: number, isPrivate?: boolean) => void
}) => {
  const [isAnimationsBustButtonsEnd, setIsAnimationsBustButtonsEnd] =
    useState(false)

  const [isAnimationsFindButtonEnd, setIsAnimationsFindButtonEnd] =
    useState(false)

  const [isIntroSceneAnimationsStart, setIsIntroSceneAnimationsStart] =
    useState(false)

  const { user: meUserData } = useAccount()
  const { accountQuery } = useAccountMe()

  const [bet, setBet] = useState(60 * 60 * 24 * 7)

  const isDisabledFindingButton = useMemo(() => {
    if (!accountQuery.data) return true
    if (accountQuery.data.time * 1000 < Date.now()) return true

    if (
      convertTimestampToDaysUnit(accountQuery.data.time - Date.now() / 1000) < 1
    )
      return true

    return false
  }, [accountQuery.data])

  return (
    <div
      className={cn(
        'flex flex-col justify-between',
        isIntroSceneAnimationsStart &&
          '!animate-battle-intro-section-slide-fade-out',
        className,
      )}
      onAnimationEnd={(e) => {
        onAnimationEnd?.(e)
        if (e.animationName === 'battle-intro-section-slide-fade-out') {
          onFindingOpponent?.()
        }
      }}
    >
      <header className="font-pixel font-[400] text-center">
        <BattleTitle
          className="opacity-0 animate-battle-preview-title-fade mb-4"
          text={
            <>
              Enter the
              <br />
              bet amount
            </>
          }
        />
        <BattleCard
          showElectricsLines={false}
          nickname={meUserData?.username}
          photoUrl={meUserData?.photo_url}
          className="opacity-0 animate-battle-intro-slide-card-fade"
        />
      </header>
      <div className="flex-1">
        <BattleGameRewardSection onChange={setBet} />
        <BattleBustButtons
          className={cn(
            'opacity-0 animate-battle-preview-bust-fade',
            !isAnimationsBustButtonsEnd && 'pointer-events-none',
          )}
          onAnimationEnd={() => setIsAnimationsBustButtonsEnd(true)}
        />
      </div>
      <div className="px-4">
        <div
          className="inline-flex gap-3 w-full relative opacity-0 animate-battle-preview-find-button-fade"
          onAnimationEnd={() => setIsAnimationsFindButtonEnd(true)}
        >
          <ShareBattleInviteButton
            onClick={() => {
              onJoinGame?.(bet, true)
              setIsIntroSceneAnimationsStart(true)
            }}
            comment={[
              '🔥⚔️ Hey there! Ready to prove your strength?',
              '💪Join the battle with me if you’re strong enough!⚔️🔥',
              '🛡️ Let’s see who’s the real champion! 🏆',
            ].join('\n')}
            className={cn(
              'font-pixel text-white rounded-[16px] uppercase bg-gradient-to-b from-[#8C35FB] to-[#6602E7] disabled:cursor-not-allowed disabled:from-[#8C35FB]/50 disabled:to-[#6602E7]/50',
              !isAnimationsFindButtonEnd && 'pointer-events-none',
            )}
            inviteParam={`invitedBy=${meUserData?.id}_type=game-battle_bet=${bet}`}
          >
            <PiShareFatBold className="size-6" /> FRIEND
          </ShareBattleInviteButton>
          <ActionButton
            className={cn(
              'font-pixel text-[#121312] rounded-[16px] uppercase disabled:cursor-not-allowed disabled:from-[#ADFA4B]/50 disabled:to-[#B6FF00]/50',
              !isAnimationsFindButtonEnd && 'pointer-events-none',
            )}
            disabled={isDisabledFindingButton}
            onClick={() => {
              onJoinGame?.(bet)
              setIsIntroSceneAnimationsStart(true)
            }}
          >
            <FaRandom className="size-5" /> RANDOM
          </ActionButton>
          <ChooseOpponent className="absolute right-0 bottom-16" />
        </div>

        <p className="font-inter text-[#FFFFFF]/40 text-[14px] font-[400] mt-4 leading-[140%] text-center mb-4 opacity-0 animate-battle-preview-find-text-fade">
          The opponent will be <br /> randomly selected. Commission 1%
        </p>
      </div>
    </div>
  )
}
