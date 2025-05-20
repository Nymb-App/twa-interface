import { cn } from '@/utils'

export function MintButton({
  minted,
  className,
}: {
  minted?: boolean
  className?: string
}) {
  return (
    <button
      className={cn(
        'font-pixel text-lg bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] text-[#121312] rounded-xl py-4',
        minted && 'bg-gradient-to-b from-white to-[#999999]',
        className,
      )}
    >
      {minted ? 'ALREADY MINTED' : 'MINT FOR 1 TON'}
    </button>
  )
}
