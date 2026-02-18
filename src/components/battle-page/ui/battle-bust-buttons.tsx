import { BustIcon } from '@/assets/icons/bust'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { ExtraBoostDrawer } from './extra-boost-drawer'

export const BattleBustButtons = ({
  className,
  onAnimationEnd,
}: {
  className?: string
  onAnimationEnd?: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn('flex justify-center gap-4 h-10', className)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="bg-[#FFFFFF]/4 rounded-[14px] h-full basis-[114px] flex justify-center items-center gap-3 px-2 bg-[url('/minigames/boost-grey-bg.webp')] bg-no-repeat bg-[position:bottom_left_-1px]">
        <span className="ml-1.5">
          <BustIcon />
        </span>
        <span className="font-semibold">{t('battle.bust.single')}</span>
      </div>
      <ExtraBoostDrawer />
    </div>
  )
}
