import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import useSound from 'use-sound'

type CopyButtonProps = {
  content: string
  copyMessage?: string
  className?: string
  children?: React.ReactNode
}

export function CopyButton({
  content,
  copyMessage,
  className,
  children,
}: CopyButtonProps) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage,
  })

  const [play, { stop }] = useSound('/sounds/Button.aac')

  useEffect(() => {
    return () => stop()
  }, [play])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('relative h-6 w-6', className)}
      aria-label="Copy to clipboard"
      onClick={() => {
        play()
        handleCopy()
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Check
          className={cn(
            'h-4 w-4 transition-transform ease-in-out',
            isCopied ? 'scale-100' : 'scale-0',
          )}
        />
      </div>
      {children ? (
        isCopied ? null : (
          children
        )
      ) : (
        <Copy
          className={cn(
            'h-4 w-4 transition-transform ease-in-out',
            isCopied ? 'scale-0' : 'scale-100',
          )}
        />
      )}
    </Button>
  )
}
