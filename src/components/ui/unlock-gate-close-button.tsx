import { Link } from '@tanstack/react-router';
import { ActionButton } from './action-button';

export const UnlockGateCloseButton = () => {
  return (
    <Link to='/gate'>
      <div className='animate-slide-up-fade-4 fixed bottom-0 z-50 w-full max-w-[450px] bg-[#121312] px-4 pb-12'>
        <ActionButton className='font-pixel rounded-[16px] text-[#121312] uppercase'>
          <span>Close</span>
        </ActionButton>
      </div>
    </Link>
  );
};
