import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'
import { useReferrals } from '@/hooks/api/use-referrals'
import { cn } from '@/utils'
import { useAccountMe } from '@/hooks/api/use-account'

const MIN_ALLOWED_TIME = 86400
const MIN_FRENS_FOR_A_GIFT = 3

export const ReferralsMembersList = ({ meTime }: { meTime: number }) => {
  const { myReferrals, isLoadingMyReferrals } = useReferrals()
  const referralsCount = myReferrals?.referrals.length || 0

  const isSendGiftEnabled = useMemo(() => {
    if (MIN_ALLOWED_TIME > meTime) return false
    if (MIN_FRENS_FOR_A_GIFT > referralsCount) return false
    return true
  }, [meTime, referralsCount])

  const { accountQuery } = useAccountMe()

  const isDisabledActionButton = useMemo(() => {
    if (!accountQuery.data) return true
    return accountQuery.data.time * 1000 < Date.now()
  }, [accountQuery.data])

  return (
    <>
      <div className="font-pixel mb-3 px-3 pt-[40px] pb-4">
        <div className="flex items-center justify-between gap-2 font-[400]">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            {isLoadingMyReferrals ? (
              <Skeleton className="w-[90px] h-[24px]" />
            ) : (
              `${referralsCount} frens`
            )}
          </h2>
          <Link
            to="/send-gift"
            disabled={!isSendGiftEnabled || isDisabledActionButton}
          >
            <Button
              className="h-8 bg-gradient-to-b from-[#8C35FB] to-[#6602E7]"
              disabled={!isSendGiftEnabled || isDisabledActionButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.15918 0.637671C10.2948 0.0482725 11.5102 0.378285 12.2432 1.07029C12.6133 1.41982 12.9034 1.89915 12.9805 2.45896C13.0412 2.90085 12.9617 3.34897 12.7422 3.75876C14.04 4.08909 15 5.26533 15 6.66599V12.666C15 14.3228 13.6569 15.666 12 15.666H4C2.34315 15.666 1 14.3228 1 12.666V6.66599C1.00001 5.26517 1.96071 4.09089 3.25879 3.76072C3.03845 3.35041 2.95866 2.90155 3.01953 2.45896C3.09663 1.89915 3.38675 1.41982 3.75684 1.07029C4.48982 0.378285 5.70519 0.0482725 6.84082 0.637671C7.28922 0.870444 7.67678 1.22274 8 1.6865C8.32322 1.22274 8.71078 0.870444 9.15918 0.637671ZM9.15332 5.70896L9 5.7031V13.666H12C12.5523 13.666 13 13.2183 13 12.666V6.66599C13 6.14832 12.6067 5.72221 12.1025 5.67087L12 5.66599H9.14746L9.15332 5.70896ZM4 5.66599C3.44772 5.66599 3.00001 6.11372 3 6.66599V12.666C3 13.2183 3.44772 13.666 4 13.666H7V5.7031L6.84668 5.70896L6.85254 5.66599H4ZM5.91992 2.41209C5.63745 2.26553 5.32841 2.33705 5.12988 2.52439C5.03468 2.61431 5.00617 2.69469 5.00098 2.73142C4.9989 2.74653 4.99142 2.78834 5.06152 2.87498C5.14618 2.97949 5.36266 3.16333 5.85156 3.33103C6.0859 3.41139 6.37196 3.48331 6.7168 3.54099C6.45484 2.81319 6.1237 2.51791 5.91992 2.41209ZM10.8701 2.52439C10.6716 2.33705 10.3625 2.26553 10.0801 2.41209C9.8763 2.51791 9.54516 2.81319 9.2832 3.54099C9.62804 3.48331 9.91409 3.41139 10.1484 3.33103C10.6373 3.16333 10.8538 2.97949 10.9385 2.87498C11.0086 2.78834 11.0011 2.74653 10.999 2.73142C10.9938 2.69469 10.9653 2.61431 10.8701 2.52439Z"
                  fill="white"
                />
              </svg>
              <span className="text-[12px] leading-4 text-[#FFFFFF] uppercase">
                send gift
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {isLoadingMyReferrals ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="w-full rounded-[14px] h-[44px]" />
            <Skeleton className="w-full rounded-[14px] h-[44px]" />
            <Skeleton className="w-full rounded-[14px] h-[44px]" />
            <Skeleton className="w-full rounded-[14px] h-[44px]" />
            <Skeleton className="w-full rounded-[14px] h-[44px]" />
          </div>
        ) : (
          myReferrals?.referrals.map((item, i) => {
            return (
              <div
                key={i}
                className="rounded-[14px] starboard-result-block-bg backdrop-blur-[16px] py-1 px-4"
              >
                <div className="flex justify-between items-center font-[400]">
                  <div className="font-inter flex gap-4">
                    <Avatar className="rounded-[12px]">
                      <AvatarImage
                        src={item.photoUrl || 'https://github.com/shadcn.png'}
                      />
                      <AvatarFallback>{'ju'.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="mr-2 font-[600] text-[16px] leading-5">
                        {item.nickname || 'unknown'}
                      </p>
                      <span className="text-[14px] leading-[120%] text-[#FFFFFF66]">
                        referals:
                        <span className="ml-1">{item.referralsCount || 0}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'font-pixel text-[14px] leading-[120%]',
                        item.time &&
                          '[text-shadow:0px_0px_20px_rgba(182,255,0,1)] text-[#B6FF00]',
                      )}
                    >
                      <span>+3</span>
                      <span className="font-pixel text-[#FFFFFF66] text-[10px] ml-1">
                        d
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
