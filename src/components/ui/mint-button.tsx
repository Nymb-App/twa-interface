import { useEffect, useState } from 'react'
import {
  useTonAddress,
  useTonConnectModal,
} from '@tonconnect/ui-react'
import { TextWithAppearingDots } from './appearing-dots'
import { useMint } from '@/hooks/use-mint'
import { cn } from '@/utils'
import { useTransferTon } from '@/hooks/use-transfer-ton'

export default function MintButton({
  onMinted,
  className,
}: {
  onMinted?: (isSuccess: boolean) => void
  className?: string
}) {
  const address = useTonAddress()
  const { open } = useTonConnectModal()

  const {
    transfer,
    isLoading: isTransferLoading,
    isSuccess: isTransferSuccess,
    isError: isTransferError,
    isTransactionSuccess,
    isTransactionError,
    isTransactionLoading,
    hash,
  } = useTransferTon()
  const { collectionData, mintProgress, mint } = useMint()

  const [isMinting, setMinting] = useState<boolean>(false)
  const [isMinted, setMinted] = useState<boolean>(false)

  const handleTransferTon = async () => {
    if (isMinting || !collectionData) {
      return
    }

    if (!address) {
      open()
      return
    }

    setMinting(true)
    await transfer(collectionData.owner, 0.1)
  }

  useEffect(() => {
    if (mintProgress && mintProgress.isEarlyAccessMinted) {
      setMinted(true)
    }
  }, [mintProgress])

  // ⬇️ Transferring TON to the `MINTER` wallet
  useEffect(() => {
    if (isTransferError) {
      setMinting(false)
      return
    }

    if (isTransactionError) {
      setMinting(false)
    }
    if (isTransactionSuccess && hash) {
      ;(async () => {
        await mint(hash)
        onMinted?.(true)
        setMinted(true)
        setMinting(false)
      })()
    }
  }, [
    isTransferLoading,
    isTransferSuccess,
    isTransferError,
    isTransactionSuccess,
    isTransactionError,
    isTransactionLoading,
    hash,
  ])

  return (
    <button
      disabled={isMinted || isMinting}
      onClick={handleTransferTon}
      className={cn(
        'font-pixel text-lg bg-gradient-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00] text-[#121312] rounded-xl py-4 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
        isMinted &&
          'bg-gradient-to-b from-white to-[#999999] disabled:from-white disabled:to-[#999999]',
        className,
      )}
    >
      {isMinting ? (
        <TextWithAppearingDots
          text={
            isTransferLoading || isTransactionLoading
              ? 'TRANSFER TON'
              : 'MINTING'
          }
        />
      ) : isMinted ? (
        'ALREADY MINTED'
      ) : (
        `MINT FOR ${collectionData?.mintAmount ?? 1} TON`
      )}
    </button>
  )
}

