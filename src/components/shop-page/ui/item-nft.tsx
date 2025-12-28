import { DrawerNft } from '@/components/ui/drawer-nft'
import { cn } from '@/lib/utils'

export function ItemNFT({ className }: { className?: string }) {
  return (
    <DrawerNft
      className={cn(
        'w-full h-[166px] bg-linear-to-b from-[#A2F21D] via-[#1B9E98]/50 to-[#162016]/10 rounded-3xl p-[1px] cursor-pointer outline-none',
        className,
      )}
    >
      <div className="relative flex items-end gap-2 bg-[#0E140E] rounded-3xl px-6 py-2 h-full">
        <div className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 overflow-hidden rounded-3xl">
          <div className="absolute left-[-120px] bottom-[15px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute right-[-50px] top-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute left-[-105px] top-14 bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute left-[-120px] top-0 bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute right-[10px] top-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute right-[-50px] bottom-[-45px] bg-[#B6FF00] blur-[30px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute left-[-60px] bottom-[-25px] bg-[#B6FF00]/50 blur-[30px] w-full h-[50px] rounded-full" />
        </div>

        <div className="inline-flex justify-between w-full font-pixel">
          <div className="flex flex-col items-start justify-between h-[166px]">
            <div className="flex flex-col items-start mt-9 relative z-10">
              <span className="text-white text-base uppercase">Nymb NFT</span>
              <span className="text-white/40 text-xs font-inter">
                One for the wallet
              </span>
            </div>
            <div className="inline-flex relative z-20 gap-2 items-center font-pixel mx-auto text-[#B6FF00] -mt-1">
              <h2 className="text-[32px] text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
                {/* {mintProgress ? `${mintProgress.progress.toFixed()}%` : '45%'} */}
                45%
              </h2>
              <div className="flex flex-col text-sm">
                <span className="ml-2">ALREADY</span>
                <span>MINTED</span>
              </div>
            </div>
          </div>

          <img
            src="/shop/nft4x.webp"
            alt="time"
            className="absolute bottom-0 right-2.5 max-w-40 h-auto"
          />
          <div className="absolute left-0 rounded-3xl bottom-0 overflow-hidden size-full">
            <div className="absolute left-[-60px] bottom-[-25px] bg-[#B6FF00]/50 blur-[30px] w-full h-[50px] rounded-full" />
          </div>
        </div>
      </div>
    </DrawerNft>
  )
}
