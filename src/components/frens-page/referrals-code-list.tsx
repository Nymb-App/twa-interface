import { useAccount } from '@/hooks/api/use-account'
import { useReferrals } from '@/hooks/api/use-referrals'
import { TELEGRAM_APP_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { toast } from 'sonner'
import useSound from 'use-sound'
import { Button } from '../ui/button'
import { CopyButton } from '../ui/copy-button'
import { Skeleton } from '../ui/skeleton'

export const ReferralsCodeList = () => {
  const { user } = useAccount()
  const { myCodes, generateNewCode, isLoadingMyCodes } = useReferrals()
  const [play, { stop }] = useSound('/sounds/Button.aac')

  useEffect(() => {
    return () => stop()
  }, [play])

  if (isLoadingMyCodes) {
    return (
      <div>
        <div className="flex items-center justify-between gap-2 pt-10 pb-4 mb-3">
          <Skeleton className="h-[24px] w-[176px]" />
          <Skeleton className="h-[32px] w-[107px]" />
        </div>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton className="h-[48px] w-full" key={idx} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="font-pixel mb-3 px-3 pt-[40px] pb-4">
        <div className="flex items-center justify-between gap-2 font-normal">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            Referrals code
          </h2>
          <Button
            className={cn(
              'h-8 bg-linear-to-b from-[#ADFA4B] from-20% to-[#B6FF00] text-[12px] leading-4 text-[#121312] uppercase',
              myCodes &&
                myCodes.length >= 5 &&
                'cursor-not-allowed from-[#414241] to-[#363736] text-white',
            )}
            onClick={() => {
              play()
              if (myCodes && myCodes.length >= 5) {
                toast.error('You can add up to 5 referral codes only')
                return
              }
              generateNewCode.mutate()
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.00006 6.99982H15.0001V8.99982H9.00006V14.9998H7.00006V8.99982H1.00006V6.99982H7.00006V0.999817H9.00006V6.99982Z"
                fill={
                  myCodes && myCodes.length >= 5
                    ? 'rgba(255,255,255,0.6)'
                    : '#121312'
                }
              />
            </svg>
            add new
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {myCodes?.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="starboard-result-block-bg rounded-[14px] px-4 py-1 backdrop-blur-[16px]">
              <div className="flex items-center justify-between font-[400]">
                <div className="font-inter">
                  <div className="flex items-center">
                    <span className="font-inter text-base font-semibold uppercase">
                      {item.code}
                    </span>
                    <CopyButton
                      content={`${TELEGRAM_APP_URL}?startapp=${user?.id}_${item.code}`}
                    />
                  </div>
                  <span className="text-[14px] leading-[120%] text-[#FFFFFF66]">
                    {item.royalty}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-pixel text-[14px] leading-[120%]">
                    {item.referralsCount || 0}
                  </p>
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.83264 9.49957C8.58139 9.49957 9.99939 10.9179 9.99963 12.6666V14.4996C9.99963 15.0519 9.55192 15.4996 8.99963 15.4996C8.44751 15.4994 7.99963 15.0517 7.99963 14.4996V12.6666C7.99939 12.0224 7.47683 11.4996 6.83264 11.4996H3.16663C2.5226 11.4998 1.99987 12.0226 1.99963 12.6666V14.4996C1.99963 15.0519 1.55192 15.4996 0.999634 15.4996C0.447506 15.4994 -0.000366211 15.0517 -0.000366211 14.4996V12.6666C-0.000125527 10.918 1.41803 9.49976 3.16663 9.49957H6.83264ZM11.7496 7.49957C14.0966 7.49966 15.9994 9.40262 15.9996 11.7496V12.4996C15.9996 13.0518 15.5518 13.4995 14.9996 13.4996C14.4476 13.4993 13.9996 13.0517 13.9996 12.4996V11.7496C13.9994 10.5072 12.9921 9.49966 11.7496 9.49957H10.2496C9.86915 9.49965 9.51272 9.59365 9.20081 9.75836C8.71251 10.0159 8.10706 9.82862 7.84924 9.34039C7.59218 8.85226 7.77931 8.24757 8.26721 7.98981C8.86001 7.67677 9.53588 7.49965 10.2496 7.49957H11.7496ZM4.99963 2.49957C6.65634 2.49957 7.99939 3.84292 7.99963 5.49957C7.99963 7.15643 6.65649 8.49957 4.99963 8.49957C3.34294 8.49939 1.99963 7.15631 1.99963 5.49957C1.99987 3.84304 3.34308 2.49976 4.99963 2.49957ZM4.99963 4.49957C4.44765 4.49976 3.99987 4.94761 3.99963 5.49957C3.99963 6.05174 4.44751 6.49939 4.99963 6.49957C5.55192 6.49957 5.99963 6.05186 5.99963 5.49957C5.99939 4.94749 5.55177 4.49957 4.99963 4.49957ZM10.0006 0.499573C11.657 0.499897 13.0004 1.84312 13.0006 3.49957C13.0006 5.15623 11.6572 6.49925 10.0006 6.49957C9.44833 6.49957 9.00061 6.05186 9.00061 5.49957C9.00085 4.94749 9.44847 4.49957 10.0006 4.49957C10.5526 4.49925 11.0006 4.05166 11.0006 3.49957C11.0004 2.94769 10.5525 2.4999 10.0006 2.49957C9.74653 2.49957 9.51631 2.59369 9.33948 2.74957C8.92544 3.11501 8.29284 3.07568 7.92737 2.66168C7.56204 2.24764 7.6013 1.61501 8.01526 1.24957C8.54346 0.78353 9.24064 0.499573 10.0006 0.499573Z"
                      fill="white"
                      fillOpacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}
