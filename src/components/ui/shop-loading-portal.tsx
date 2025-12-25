import { useIsMutating } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

export function ShopLoadingPortal() {
  const [mounted, setMounted] = useState(false)
  const activeBuyMutations = useIsMutating({ mutationKey: ['shop', 'buyItem'] })
  const isBuying = useMemo(() => activeBuyMutations > 0, [activeBuyMutations])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isBuying) return null

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl bg-[#1d1f1d] border border-[#2f302e] px-5 py-4 shadow-xl">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white/70" />
        <span className="font-inter text-white/80 text-sm">
          Processing purchase…
        </span>
      </div>
    </div>,
    document.body,
  )
}
