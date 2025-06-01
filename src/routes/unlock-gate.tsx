import { createFileRoute } from '@tanstack/react-router'
import { HiLockClosed } from 'react-icons/hi2'
import { useContext, useState } from 'react'
import { GateNextDisplayBlock } from '@/components/gate-page/gate-header'
import { PageLayout } from '@/components/ui/page-layout'
import { GateContext } from '@/context/gate-context'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { Container } from '@/components/ui/container'

export const Route = createFileRoute('/unlock-gate')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentLevel, isLockedNewGate } = useContext(GateContext)

  const [isStartAnimation, setIsStartAnimation] = useState(false)

  return (
    <PageLayout useFooter={false}>
      {isStartAnimation ? (
        <div className="relative mt-[230px]">
          <div className="absolute left-1/2 -translate-x-1/2">
            <GateNextDisplayBlock
              className="z-1 border-2 backdrop-blur-[8px] shadow-[0_0_80px_rgba(182,255,0,0.56),_inset_0_0_16px_rgba(182,255,0,0.24)]"
              isLockedNewGate={isLockedNewGate}
              currentLevel={currentLevel}
            />
            <HiLockClosed
              className="absolute -bottom-2 left-8.5"
              color="#FFFFFF"
              fontSize={24}
            />
            {/* <HiLockOpen
            className="absolute -bottom-2 left-8.5"
            color="#FFFFFF"
            fontSize={24}
          /> */}
            <FlickeringGrid
              className="absolute z-[-1] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[450px] h-[450px] mask-[radial-gradient(ellipse_220px_190px_at_center,black,transparent)]"
              squareSize={2}
              gridGap={12}
              color="#FFFFFF"
              maxOpacity={0.5}
              flickerChance={0.3}
              autoResize={false}
              width={450}
              height={450}
            />
          </div>
        </div>
      ) : (
        <PageLayout useFooter={false}>
          <Container>Finish</Container>
        </PageLayout>
      )}
    </PageLayout>
  )
}
