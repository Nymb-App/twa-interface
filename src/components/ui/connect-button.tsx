import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react'
import { cn } from '@/utils'

export function ConnectButton({ className }: { className?: string }) {
  const address = useTonAddress()
  const { open } = useTonConnectModal()

  return (
    <button
      disabled={address.length > 0}
      onClick={open}
      className={cn(
        'font-pixel text-lg bg-gradient-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00] text-[#121312] rounded-xl py-4 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
        className,
      )}
    >
      CONNECT WALLET
    </button>
  )
}
