import { Link } from '@tanstack/react-router'
import { ActionButton } from './action-button'

export const CheckInButton = () => {
  return (
    <Link to="/home">
      <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 px-3 bg-[#151317]">
        <ActionButton>
          <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
            Continue
          </span>
        </ActionButton>
      </div>
    </Link>
  )
}
