import { Suspense, lazy } from 'react'
import { useTonAddress } from '@tonconnect/ui-react'

const ConnectButton = lazy(() => import('@/components/ui/connect-button').then(m => ({ default: m.ConnectButton })))
const MintButton = lazy(() => import('@/components/ui/mint-button'))

export default function MintWidget() {
  const address = useTonAddress()

  return (
    <Suspense fallback={<div className="h-10 w-[80%] mx-auto mt-6 rounded-lg bg-gray-800 animate-pulse" />}>
      {address ? (
        <MintButton className="mt-6 w-[80%] mx-auto" />
      ) : (
        <ConnectButton className="mt-6 w-[80%] mx-auto" />
      )}
    </Suspense>
  )
}
