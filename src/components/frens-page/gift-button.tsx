import { GiftIcon } from '@/assets/icons/gift'
import { ActionButton } from '@/components/ui/action-button'

export const SendGiftButton = ({
  value = 10,
  unit = 'weeks',
  onClick,
}: {
  value?: number
  unit?: string
  onClick?: () => void
}) => {
  return (
    <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 px-4 bg-[#151317]">
      <p className="mb-4 font-[400] text-[14px] leading-[140%] text-center text-[#FFFFFF66]">
        A frend will be randomly selected
      </p>
      <ActionButton
        className="bg-gradient-to-b from-[#8C35FB] to-[#6602E7]"
        onClick={onClick}
      >
        <GiftIcon fill="white" />
        <span className="ml-3 font-pixel text-[#FFFFFF] font-[400] uppercase text-[18px] leading-[24px]">
          send gift {value} {unit}
        </span>
      </ActionButton>
    </div>
  )
}
