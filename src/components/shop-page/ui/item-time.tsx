import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { DrawerTime } from '@/components/ui/drawer-time'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export function ItemTime({ className }: { className?: string }) {
  const {t} = useTranslation()
  return (
    <DrawerTime
      className={cn(
        'w-full h-[128px] bg-linear-to-b from-[#A2F21D] via-[#1B9E98]/50 to-[#162016] rounded-2xl p-px cursor-pointer outline-none',
        className,
      )}
    >
      <div className="relative flex items-end gap-2 bg-[#0E140E] rounded-2xl px-4 py-2 h-full">
        <FlickeringGrid
          className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
          squareSize={2}
          gridGap={12}
          color="#B6FF00"
          maxOpacity={1}
          flickerChance={0.3}
          autoResize={false}
        />
        <div className="absolute left-1/2 -translate-x-1/2 w-full h-full top-0 overflow-hidden rounded-2xl">
          <div className="absolute left-0 top-[-45px] bg-[#B6FF00] blur-[60px] w-1/3 h-[50px] rounded-full" />
          <div className="absolute right-0 top-[-45px] bg-[#B6FF00] blur-[60px] w-1/3 h-[50px] rounded-full" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-[-32px] w-full">
          <img
            src="/shop/clock.webp"
            alt="time"
            className="absolute left-1/2 -translate-x-1/2 w-[96px] h-auto top-0"
          />
        </div>

        <div className="inline-flex justify-between w-full font-pixel">
          <span className="text-white text-base uppercase">
            {t('shop-page.items.time.title')}
          </span>
          <span className="text-[#B6FF00] text-lg inline-flex items-center gap-1">
            <span>1W</span>
            <span className="text-[#B6FF00]/40 text-xs">/</span>
            <span>1M</span>
            <span className="text-[#B6FF00]/40 text-xs">/</span>
            <span>1Y</span>
          </span>
        </div>
      </div>
    </DrawerTime>
  )
}
