import { Link, createFileRoute } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { useEffect, useMemo, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { toast } from 'sonner'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, convertTimestampToLargestUnit } from '@/utils'
import { TimeCountup } from '@/components/ui/countup-timer-display'
import {
  ANIMATION_DURATION_COUNTUP,
  NYMB_FARMING_FINISHAT_LS_KEY,
  useFarming,
} from '@/context/farming-context'
import { WatchesIcon } from '@/assets/icons/watches'
import { useReferrals } from '@/hooks/api/use-referrals'
import { TELEGRAM_APP_URL } from '@/lib/constants'
import { useAccount } from '@/hooks/api/use-account'

export const Route = createFileRoute('/frens')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isClaimStart, setIsClaimStart] = useState(false)
  const [isClaimEnd, setIsClaimEnd] = useState(false)
  const [initialFinishAtValue, _] = useState(
    Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)),
  )

  const totalEarnings = 1610000

  const { finishAt, loading } = useFarming()

  return (
    <PageLayout>
      <header className="relative w-full font-pixel font-[400] px-3 bg-[url('/frens-bg.png')] bg-no-repeat bg-bottom pb-6">
        <h1 className="text-center text-[24px] leading-8 uppercase mb-6">
          Invite frens<br />
          and get more time
        </h1>
        <p className="font-inter text-center text-[14px] text-[#FFFFFF99] leading-[140%] mb-2">
          Total Earnings:
        </p>
        {loading && <div>loading...</div>}
        {finishAt > 0 && !isClaimStart && (
          <Countdown
            date={finishAt}
            intervalDelay={10}
            precision={3}
            renderer={(props: any) => (
              <CountdownTimerDisplay isCountdownHeaderView {...props} />
            )}
          />
        )}
        {!loading && !finishAt && !isClaimStart && (
          <CountdownTimerDisplay
            isCountdownHeaderView
            days={0}
            hours={0}
            minutes={0}
            seconds={0}
          />
        )}
        {finishAt > 0 && isClaimEnd && (
          <Countdown
            date={finishAt}
            intervalDelay={10}
            precision={3}
            renderer={(props: any) => (
              <CountdownTimerDisplay isCountdownHeaderView {...props} />
            )}
          />
        )}

        {isClaimStart && !isClaimEnd && (
          <TimeCountup
            initialFinishAtValue={initialFinishAtValue}
            totalEarnings={totalEarnings}
            targetTimestamp={Number(
              localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY),
            )}
            isClaimStart={isClaimStart}
            setIsClaimEnd={setIsClaimEnd}
          />
        )}
      </header>
      <Container>
        <TotalEarningsBlock
          totalEarnings={!isClaimEnd ? totalEarnings : 0}
          isClaimStart={isClaimStart}
          setIsClaimStart={setIsClaimStart}
        />
        <ReferralsLevelsBlock />
        <RefferalsCodeList />
        <RefferalsMembersList meTime={7400} />
      </Container>
    </PageLayout>
  )
}

const useCountdown = (from: number, duration: number, enabled: boolean) => {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!enabled) {
      setValue(from)
      return
    }

    const controls = animate(from, 0, {
      duration: duration / 1000,
      ease: 'linear',
      onUpdate: setValue,
    })

    return () => controls.stop()
  }, [from, duration, enabled])

  return value
}

const TotalEarningsBlock = ({
  totalEarnings,
  isClaimStart,
  setIsClaimStart,
}: {
  totalEarnings: number
  isClaimStart: boolean
  setIsClaimStart: (value: boolean) => void
}) => {
  const animatedTotalEarnings = useCountdown(
    totalEarnings,
    ANIMATION_DURATION_COUNTUP,
    isClaimStart,
  )
  const currentEarnings = isClaimStart ? animatedTotalEarnings : totalEarnings
  const displayTime = convertTimestampToLargestUnit(currentEarnings, true)
  const { setFinishAt } = useFarming()

  return (
    <div
      className="font-pixel font-[400] mt-2 flex items-center justify-between p-4 starboard-result-block-bg rounded-[14px]
backdrop-blur-[8px]"
    >
      <div className="flex flex-col gap-2 items-center basis-1/2">
        <p className="font-inter leading-[140%] text-[14px]">Total Earnings</p>
        <div className="flex items-center">
          <WatchesIcon
            className="size-[36px]"
            fill={`${displayTime.time > 0 ? '#B6FF00' : '#FFFFFF99'}`}
          />
          <div>
            <span
              className={cn(
                'text-[24px] leading-[32px] tracking-[0.3px]',
                displayTime.time > 0 &&
                  '[text-shadow:0px_0px_20px_rgba(182,255,0,1)] text-[#B6FF00]',
              )}
            >
              {displayTime.time}
            </span>
            <span className="ml-1 text-[#FFFFFF66]">{displayTime.label}</span>
          </div>
        </div>
      </div>
      <div className="basis-1/2 inline-flex justify-center">
        <Button
          disabled={!totalEarnings || isClaimStart}
          onClick={() => {
            setIsClaimStart(true)
            if (
              Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) === 0
            ) {
              setFinishAt(
                Number(Date.now() + displayTime.roundedTimestamp) +
                  ANIMATION_DURATION_COUNTUP +
                  1000,
              )
            } else {
              setFinishAt(
                Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)) +
                  displayTime.roundedTimestamp +
                  ANIMATION_DURATION_COUNTUP,
              )
            }
          }}
          className="text-[#121312] h-[40px] rounded-[12px] uppercase bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00] disabled:from-[#414241] disabled:to-[#363736] disabled:text-white disabled:cursor-not-allowed disabled:opacity-100"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_225_9928)">
              <path
                d="M12.4999 15.9997H4.50085L4.49988 13.9997H12.4999V15.9997ZM4.49988 13.9997H2.49988V11.9997H4.49988V13.9997ZM14.4999 13.9997H12.4999V11.9997H14.4999V13.9997ZM2.49988 11.9997H0.499878V3.99966H2.49988V11.9997ZM16.4999 4.00064V11.9997H14.4999V3.99966L16.4999 4.00064ZM8.49988 7.99966L13.4999 8.00064V10.0006L6.49988 9.99966V3.99966H8.49988V7.99966ZM4.49988 3.99966H2.49988L2.50085 1.99966H4.50085L4.49988 3.99966ZM14.4999 3.99966H12.4999L12.5009 1.99966H14.5009L14.4999 3.99966ZM12.5009 1.99966H4.50085L4.49988 -0.000335693H12.4999L12.5009 1.99966Z"
                fill={!totalEarnings ? 'rgba(255,255,255,0.6)' : '#121312'}
              />
            </g>
            <defs>
              <clipPath id="clip0_225_9928">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          <span className="mt-0.5">for claiming</span>
        </Button>
      </div>
    </div>
  )
}

const ReferralsLevelsBlock = () => {
  const { myReferrals } = useReferrals();
  
  const {countVoucherReferrals0, countVoucherReferrals1} = useMemo(() => {
    if(!myReferrals) {
      return {
        countVoucherReferrals0: 0,
        countVoucherReferrals1: 0
      };
    }

    return {
      countVoucherReferrals0: myReferrals.countVoucherReferrals0,
      countVoucherReferrals1: myReferrals.countVoucherReferrals1
    };
  }, [myReferrals]);

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <div className="font-pixel font-[400] flex flex-col items-center justify-center gap-3 px-4 py-2 starboard-result-block-bg backdrop-blur-[16px] rounded-[14px] min-h-[92px]">
        <p className="font-inter text-sm leading-[140%]">Refferals 1 lvl</p>
        <div className="flex gap-3 items-center">
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
            {countVoucherReferrals0}
          </span>
        </div>
      </div>

      <div className="font-pixel font-[400] flex flex-col items-center justify-center gap-3 px-4 py-2 starboard-result-block-bg backdrop-blur-[16px] rounded-[14px] min-h-[92px]">
        <p className="font-inter text-sm leading-[140%]">Refferals 2 lvl</p>
        <div className="flex gap-3 items-center">
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
            {countVoucherReferrals1}
          </span>
        </div>
      </div>
    </div>
  )
}

const RefferalsCodeList = () => {
  const { user} = useAccount();
  const { myCodes, generateNewCode } = useReferrals();

  return (
    <>
      <div className="font-pixel pt-[40px] px-3 pb-4 mb-3">
        <div className="flex justify-between items-center gap-2 font-[400]">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            Referrals code
          </h2>
          <Button
            className={cn(
              'text-[#121312] h-8 bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00] leading-4 text-[12px] uppercase',
              (myCodes && myCodes.length >= 5) &&
                'from-[#414241] to-[#363736] text-white cursor-not-allowed',
            )}
            onClick={() => {
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
            <div className="rounded-[14px] starboard-result-block-bg backdrop-blur-[16px] py-1 px-4">
              <div className="flex justify-between items-center font-[400] ">
                
                <div className="font-inter">
                  <div className="flex items-center">
                    <span className="font-inter font-semibold text-base uppercase">
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

const RefferalsMembersList = ({ meTime }: { meTime: number }) => {
  const MIN_ALLOWED_TIME = 86400

  const { myReferrals } = useReferrals();

  // const referralsCount =  myReferrals?.referrals.length || 0;
  const referralsCount = 0;

  return (
    <>
      <div className="font-pixel pt-[40px] px-3 pb-4 mb-3">
        <div className="flex justify-between items-center gap-2 font-[400]">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            {referralsCount} frens
          </h2>
          <Link
            to="/send-gift"
            disabled={MIN_ALLOWED_TIME >= meTime || referralsCount >= 10}
          >
            <Button
              className="h-8 bg-gradient-to-b from-[#8C35FB] to-[#6602E7]"
              disabled={MIN_ALLOWED_TIME >= meTime || referralsCount >= 10}
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
        {/* {myReferrals?.referrals.map((item, i) => {
          const displayTime = convertTimestampToLargestUnit(item.time, true)

          return (
            <div
              key={i}
              className="rounded-[14px] starboard-result-block-bg backdrop-blur-[16px] py-1 px-4"
            >
              <div className="flex justify-between items-center font-[400]">
                <div className="font-inter flex gap-4">
                  <Avatar className="rounded-[12px]">
                    <AvatarImage src="https://github.com/shadcn.png" />
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
                    <span>{item.time ? `+${displayTime.time}` : 0}</span>
                    <span className="font-pixel text-[#FFFFFF66] text-[10px] ml-1">
                      {displayTime.label}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )
        })} */}
      </div>
    </>
  )
}
