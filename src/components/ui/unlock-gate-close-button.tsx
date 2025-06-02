import { Link } from '@tanstack/react-router'
import { ActionButton } from './action-button'

export const UnlockGateCloseButton = () => {
  return (
    <Link to="/home">
      <div className="fixed bottom-0 pb-12 px-4 w-full max-w-[450px] z-50 bg-[#121312] animate-slide-up-fade-4">
        <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
          <span>Close</span>
        </ActionButton>
      </div>
    </Link>
  )
}
