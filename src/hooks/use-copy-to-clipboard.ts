import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

type UseCopyToClipboardProps = {
  text: string
  copyMessage?: string
}

export function useCopyToClipboard({
  text,
  copyMessage = 'Copied to clipboard!',
}: UseCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(copyMessage, {
          className:
            '!font-inter !text-[#FFFFFF] !font-[400] !leading-[20px] !text-[16px] !border !rounded-[12px] !p-4 !border-[#FFFFFF1F] !bg-[#171914]',
        })
        setIsCopied(true)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        timeoutRef.current = setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard.', {
          className:
            '!font-inter !text-[#FFFFFF] !font-[400] !leading-[20px] !text-[16px] !border !rounded-[12px] !p-4 !border-[#FFFFFF1F] !bg-[#171914]',
        })
      })
  }, [text, copyMessage])

  return { isCopied, handleCopy }
}
