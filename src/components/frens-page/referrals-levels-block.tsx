import { useMemo } from 'react'
import { Skeleton } from '../ui/skeleton'
import { useReferrals } from '@/hooks/api/use-referrals'

export const ReferralsLevelsBlock = () => {
  const { myReferrals, isLoadingMyReferrals } = useReferrals()

  const { countVoucherReferrals0, countVoucherReferrals1 } = useMemo(() => {
    if (!myReferrals) {
      return {
        countVoucherReferrals0: 0,
        countVoucherReferrals1: 0,
      }
    }

    return {
      countVoucherReferrals0: myReferrals.countVoucherReferrals0,
      countVoucherReferrals1: myReferrals.countVoucherReferrals1,
    }
  }, [myReferrals])

  if (isLoadingMyReferrals) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Skeleton className="h-[92px] w-full rounded-[14px]" />
        <Skeleton className="h-[92px] w-full rounded-[14px]" />
      </div>
    )
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <ReferralsBlock count={countVoucherReferrals0} label="Referrals 1 lvl" />
      <ReferralsBlock count={countVoucherReferrals1} label="Referrals 2 lvl" />
    </div>
  )
}

const ReferralsBlock = ({ label, count }: { label: string; count: number }) => {
  return (
    <div className="font-pixel starboard-result-block-bg flex min-h-[92px] flex-col items-center justify-center gap-3 rounded-[14px] px-4 py-2 font-[400] backdrop-blur-[16px]">
      <p className="font-inter text-sm leading-[140%]">{label}</p>
      <div className="flex items-center gap-3">
        <svg
          width="14"
          height="19"
          viewBox="0 0 14 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.75 10.7503C11.9591 10.7503 13.7499 12.5413 13.75 14.7503V17.5003C13.75 17.9145 13.4142 18.2503 13 18.2503C12.5858 18.2503 12.25 17.9145 12.25 17.5003V14.7503C12.2499 13.3697 11.1307 12.2503 9.75 12.2503H4.25C2.86934 12.2503 1.75009 13.3697 1.75 14.7503V17.5003C1.75 17.9145 1.41421 18.2503 1 18.2503C0.585786 18.2503 0.25 17.9145 0.25 17.5003V14.7503C0.250088 12.5413 2.04092 10.7503 4.25 10.7503H9.75ZM7 0.333344C9.02499 0.333344 10.6669 1.97537 10.667 4.00034C10.667 6.02538 9.02504 7.66733 7 7.66733C4.97496 7.66733 3.33301 6.02538 3.33301 4.00034C3.3331 1.97537 4.97501 0.333344 7 0.333344ZM7 1.66733C5.71139 1.66733 4.66708 2.71175 4.66699 4.00034C4.66699 5.289 5.71134 6.33334 7 6.33334C8.28866 6.33334 9.33301 5.289 9.33301 4.00034C9.33292 2.71175 8.28861 1.66733 7 1.66733Z"
            fill="white"
            fillOpacity="0.6"
          />
        </svg>
        <span className="text-[24px] leading-[32px] tracking-[0.3px]">
          {count}
        </span>
      </div>
    </div>
  )
}
