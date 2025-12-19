import { Link } from '@tanstack/react-router'
import { AdsButton } from '../ads/ads-button'
import { ActionButton } from './action-button'

export const SendGiftActionButtons = ({
  setIsShowSendGiftActionButtons,
}: {
  setIsShowSendGiftActionButtons?: (value: boolean) => void
}) => {
  return (
    <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 px-4 bg-[#151317]">
      <AdsButton
        time={7200}
        classNameText="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]"
        className="bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] mb-2"
      />
      {/* <ActionButton
        className="bg-gradient-to-b from-[#ADFA4B] to-[#B6FF00] mb-2"
        onClick={() => {
          const telegramLink =
            import.meta.env.VITE_TELEGRAM_APP_LINK ||
            'https://telegram-apps.com'
          if (shareURL.isAvailable()) {
            shareURL(telegramLink, 'Check out this cool app!')
          }
        }}
      >
        <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
          Share and get +2 hour
        </span>
      </ActionButton> */}
      <Link to="/">
        <ActionButton
          onClick={() => setIsShowSendGiftActionButtons?.(false)}
          className="bg-linear-to-b from-[#FFFFFF] to-[#999999]"
        >
          <span className="font-pixel text-[#121312] font-normal uppercase text-[18px] leading-[24px]">
            close
          </span>
        </ActionButton>
      </Link>
    </div>
  )
}
