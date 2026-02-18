import { DrawerEnergy } from '@/components/ui/drawer-energy'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export function ItemEnergy({ className }: { className?: string }) {
  const {t} = useTranslation()
  return (
    <DrawerEnergy
      className={cn(
        'w-full h-[128px] bg-linear-to-b from-[#AC15D0] to-[#322C37] rounded-2xl p-[1px] cursor-pointer outline-none',
        className,
      )}
    >
      <div className="relative flex items-end gap-2 bg-[#1C1325] rounded-2xl px-4 py-2 h-full">
        <div className="absolute left-1/2 -translate-x-1/2 top-[-32px] w-full">
          <div className="absolute left-1/2 -translate-x-1/2 bg-[#9137FF] blur-[60px] size-[126px] rounded-full" />

          <div className="relative inline-flex justify-between items-center w-full h-[100px] overflow-hidden">
            <img
              src="/shop-intersect.webp"
              alt="energy"
              className="absolute left-10 top-10 max-w-[126px]"
            />
            <img
              src="/shop-intersect.webp"
              alt="energy"
              className="absolute right-10 top-10 scale-x-[-1] max-w-[136px]"
            />
          </div>
          <img
            src="/shop/energy.webp"
            alt="energy"
            className="absolute left-1/2 -translate-x-1/2 size-[126px] top-0"
          />
        </div>

        <div className="inline-flex justify-between w-full font-pixel">
          <span className="text-white text-base uppercase">{t('shop-page.items.energy.title')}</span>
          <span className="text-[#9137FF] text-lg">+1000</span>
        </div>
      </div>
    </DrawerEnergy>
  )
}
