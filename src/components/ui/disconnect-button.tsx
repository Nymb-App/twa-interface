import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { cn } from '@/utils'

export function DisconnectButton({ className }: { className?: string }) {
  const address = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()

  return (
    <button
      disabled={!address}
      onClick={() => tonConnectUI.disconnect()}
      className={cn(
        'font-pixel text-lg text-[#121312] rounded-xl py-4 cursor-pointer bg-gradient-to-b from-white to-[#999999] active:from-white/50 active:to-[#999999]/20 disabled:from-white/20 disabled:to-[#999999]/20 disabled:cursor-not-allowed',
        className,
      )}
    >
      DISCONNECT
    </button>
  )
}
