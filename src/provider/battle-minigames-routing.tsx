import { useAccount } from '@/hooks/api/use-account'
import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

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
  const navigate = useNavigate()

  useEffect(() => {
    if (!parsedInitData || !parsedInitData.start_param) return
    if (!parsedInitData.start_param.includes('type=game-battle')) return
    const parsedParams = parseParams(parsedInitData.start_param)
    if (parsedParams.invitedBy === String(user?.id)) return
    navigate({
      to: '/minigames/battle',
      search: {
        invitedBy: Number(parsedParams.invitedBy),
        bet: Number(parsedParams.bet),
      },
    })
  }, [parsedInitData])

  return children
}
