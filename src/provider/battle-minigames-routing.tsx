import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { toast } from 'sonner'

import { FallbackLoader } from '@/components/ui/fallback-loader'
import { useAccount, useAccountMe } from '@/hooks/api/use-account'

interface Params {
  invitedBy: string
  type: string
  bet: string
}

const parseParams = (str: string): Params => {
  return str.split('_').reduce((acc, part) => {
    const [key, value] = part.split('=')
    acc[key as keyof Params] = value
    return acc
  }, {} as Params)
}

export const BattleMinigamesRouting = ({
  children,
}: {
  children: ReactNode
}) => {
  const { parsedInitData, user } = useAccount()
  const { accountQuery } = useAccountMe()
  const navigate = useNavigate()
  useEffect(() => {
    if (!accountQuery.data) return
    if (accountQuery.data.joinedAt + 3600 > Math.floor(Date.now() / 1000)) {
      toast.error(`You are newbie`)
      return
    }
    // if (accountQuery.data.time < Math.floor(Date.now() / 1000)) {
    //   toast.error(`Your account is frozen`)
    //   return
    // }
    if (!parsedInitData || !parsedInitData.start_param) return
    if (!parsedInitData.start_param.includes('type=game-battle')) return
    const parsedParams = parseParams(parsedInitData.start_param)
    if (parsedParams.invitedBy === String(user?.id)) return

    if (
      accountQuery.data.time - Math.floor(Date.now() / 1000) <
      Number(parsedParams.bet)
    ) {
      toast.error(`Your time is not enough`)
      return
    }

    if (location.pathname !== '/') return

    navigate({
      to: '/minigames/battle',
      search: {
        invitedBy: Number(parsedParams.invitedBy),
        bet: Number(parsedParams.bet),
      },
    })
  }, [parsedInitData, accountQuery.data])

  if (!accountQuery.data) return <FallbackLoader />

  return children
}
