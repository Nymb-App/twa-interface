import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { ItemEnergy, ItemNFT, ItemTime } from '@/components/shop-page/index'
import { PageLayout } from '@/components/ui/page-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shop')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout
      className="relative flex flex-col top-0"
      classNameContent="relative flex-1 overflow-hidden"
      useFooter={false}
    >
      <FlickeringGrid
        className="absolute left-2 w-full h-[300px] mask-[radial-gradient(ellipse_280px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="white"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
      />
      <h1 className="font-pixel text-center text-2xl mt-28">SHOP</h1>

      <div className="relative flex flex-col gap-10 w-full px-4 mt-6">
        <ItemNFT />
        <ItemEnergy />
        <ItemTime />
      </div>
      {/* <NoTasksBlock
        className="absolute left-1/2 -translate-x-1/2"
        classNameText="font-inter text-white/60 text-sm"
        title="More coming soon"
      /> */}
    </PageLayout>
  )
}
