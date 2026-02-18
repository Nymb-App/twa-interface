import { useBalance } from '@/hooks/use-balance'
import { useTransferTon } from '@/hooks/use-transfer-ton'
import { cn } from '@/lib/utils'
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import useSound from 'use-sound'

export type TransferTonButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onTransferSuccess?: (hash: string) => void
    onClick?: () => void
    onConnect?: () => void
    onError?: (error: any) => void
    recipient: string
    amount: number
    comment?: string
  }

export function TransferTonButton({
  onTransferSuccess,
  onError,
  onClick,
  onConnect,
  children,
  recipient,
  amount,
  className,
  comment,
  ...props
}: TransferTonButtonProps) {
  const [isTransferTonSuccess, setIsTransferTonSuccess] = useState<boolean>(false)
  const address = useTonAddress()
  const { open } = useTonConnectModal()
  const { getBalance } = useBalance()
  const [play] = useSound('/sounds/Button.aac')
  const {
    transfer,
    isTransactionLoading,
    isTransactionSuccess,
    isTransactionError,
  } = useTransferTon()
  const [hash, setHash] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (isTransferTonSuccess) return
    if (hash && isTransactionSuccess) {
      onTransferSuccess?.(hash)
      setIsTransferTonSuccess(true)
      setHash(null);
    }
  }, [onTransferSuccess, isTransactionSuccess, hash])

  useEffect(() => {
    if (recipient.toLowerCase() === address.toLowerCase()) {
      onError?.({ message: "You can't send to yourself" })
      return
    }
    if (isTransactionError) {
      onError?.({ message: 'Error happened due to transfer' })
      return
    }
  }, [address, isTransactionError, onError])

  useEffect(() => {
    if (!isTransactionLoading) {
      return
    }

    const preventInteraction = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const eventsToBlock: Array<keyof DocumentEventMap> = [
      'pointerdown',
      'click',
      'keydown',
    ]

    eventsToBlock.forEach((event) => {
      document.addEventListener(event, preventInteraction, { capture: true })
    })

    return () => {
      eventsToBlock.forEach((event) => {
        document.removeEventListener(event, preventInteraction, {
          capture: true,
        })
      })
    }
  }, [isTransactionLoading])

  const handleTransfer = useCallback(async () => {
    play()
    onClick?.()
    if (!address) {
      onConnect?.()
      open()
      return
    }
    const balance = await getBalance()
    if (!balance) {
      return
    }
    if (balance < amount) {
      onError?.({ message: 'Insufficient balance' })
      return
    }
    setIsTransferTonSuccess(false)
    const hash = await transfer(recipient, amount, comment);
    console.log('Transfer hash:', hash);
    setHash(hash ?? null);
  }, [
    address,
    amount,
    recipient,
    transfer,
    open,
    onClick,
    onConnect,
    getBalance,
  ])

  return (
    <>
      <button
        className={cn(
          'font-pixel text-lg bg-linear-to-b cursor-pointer from-[#ADFA4B] to-[#B6FF00] text-[#121312] rounded-xl py-4 active:from-[#73a531] active:to-[#689100] disabled:from-[#73a531] disabled:to-[#689100] disabled:cursor-not-allowed',
          isTransactionLoading && 'bg-[#222A10]',
          className,
        )}
        onClick={handleTransfer}
        disabled={props.disabled || isTransactionLoading}
        {...props}
      >
        {isTransactionLoading ? (
          <div className="inline-flex justify-center items-center gap-2 mix-blend-difference text-[#B6FF00]">
            <span>Transferring</span>
            <span className="flex items-center text-2xl tracking-tight">
              <span className="animate-bounce [animation-delay:-0.3s]">.</span>
              <span className="animate-bounce [animation-delay:-0.15s]">.</span>
              <span className="animate-bounce">.</span>
            </span>
          </div>
        ) : !address ? (
          t('nft.connect-wallet')
        ) : (
          children
        )}
      </button>
      {isTransactionLoading &&
        createPortal(
          <div
            className="bg-black/50 h-screen w-full fixed top-0 left-0 z-100000"
            aria-hidden="true"
          />,
          document.body,
        )}
    </>
  )
}
