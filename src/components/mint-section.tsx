import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { TransferTonButton } from './transfer-ton-button'
import { toast } from 'sonner'
import { useMint } from '@/hooks/use-mint'
import { useAccountMe } from '@/hooks/api/use-account'

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
  const { mintProgress, mint } = useMint();
  const { accountQuery } = useAccountMe();

  const isMinted = useMemo(() => {
    if (accountQuery.data) {
      return accountQuery.data.isEarlyAccessMinted;
    }
    return false;
  }, [accountQuery.data]);

  const isNftProgressFinished = useMemo(() => {
    return mintProgress?.progress === 100;
  }, [mintProgress?.progress]);

  const isMintDisabled = useMemo(() => {
    if (accountQuery.data) {
      return accountQuery.data.isEarlyAccessMinted;
    }
    if (mintProgress?.progress === 100) {
      return true;
    }
    return false;
  }, [accountQuery.data, mintProgress?.progress]);


  return (
    <section className="relative text-white px-3">
      <div className="animate-slide-up-fade-3">
        <h2 className="font-pixel text-2xl text-center">BE ONE OF</h2>
        <h2 className="font-pixel text-2xl text-center">THE BEST ALREADY</h2>
      </div>
      <div className="animate-slide-up-fade-4">
        <h3 className="text-white/60 text-sm text-center mt-2">
          Get the best deals and benefits
        </h3>
        <h3 className="text-white/60 text-sm text-center">along the way</h3>
      </div>
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
                await mint(hash);
              }}
              onError={(e) => {
                if (e.message === 'Insufficient balance') {
                  toast.error('Insufficient balance')
                } else {
                  toast.error('An error occurred during payment')
                }
              }}
            >
              {isMinted ? 'ALREADY MINTED' : isNftProgressFinished ? 'NO NFT LEFT' : 'MINT FOR 1 TON'}
            </TransferTonButton>

          </div>
          <span className="mt-3 text-white/60 mx-auto">One for the wallet</span>
        </Card>
      </div>
    </section>
  )
}
