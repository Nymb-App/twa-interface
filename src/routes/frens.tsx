import { Link, createFileRoute } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { useState } from 'react'
import { motion } from 'framer-motion'
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

export const Route = createFileRoute('/frens')({
  component: RouteComponent,
})

function RouteComponent() {
  const [referralsCodesData, setReferralsCodesData] = useState([
    { code: 'LKSD3KJF', percentageRatio: [20, 80], members: 5 },
    { code: 'TSADSAJF', percentageRatio: [10, 90], members: 0 },
  ])
  const [isToastActive, setIsToastActive] = useState(false)
  const [isClaimStart, setIsClaimStart] = useState(false)
  const [isClaimEnd, setIsClaimEnd] = useState(false)
  const [initialFinishAtValue, _] = useState(
    Number(localStorage.getItem(NYMB_FARMING_FINISHAT_LS_KEY)),
  )

  const totalEarnings = 610000

  const { finishAt, loading } = useFarming()

  return (
    <PageLayout>
      <header className="relative w-full font-pixel font-[400] px-3 bg-[url('/frens-bg.png')] bg-no-repeat bg-bottom pb-6">
        <h1 className="text-center text-[24px] leading-8 uppercase mb-6">
          Invite frens <br /> and get more time
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
        <RefferalsCodeList
          referralsCodesData={referralsCodesData}
          setReferralsCodesData={setReferralsCodesData}
          isToastActive={isToastActive}
          setIsToastActive={setIsToastActive}
        />
        <RefferalsMembersList />
      </Container>
    </PageLayout>
  )
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
  const displayTime = convertTimestampToLargestUnit(totalEarnings, true)
  const { setFinishAt } = useFarming()

  return (
    <div
      className="font-pixel font-[400] mt-2 flex items-center justify-between p-4 starboard-result-block-bg rounded-[14px]
backdrop-blur-[8px]"
    >
      <div className="flex flex-col gap-2 items-center">
        <p className="font-inter leading-[140%] text-[14px]">Total Earnings</p>
        <div className="flex gap-2 items-center">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill={`${displayTime.time > 0 ? '#B6FF00' : '#FFFFFF99'}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_51_17272)">
              <path d="M16.9041 22.4683L16.8982 23.9683L7.89819 23.9293L7.90503 22.4293L16.9041 22.4683ZM19.9109 20.981L19.9041 22.481L16.9041 22.4683L16.9109 20.9683L19.9109 20.981ZM7.91089 20.9293L7.90503 22.4293L4.90503 22.4166L4.91089 20.9166L7.91089 20.9293ZM21.4167 19.4869L21.4109 20.9869L19.9109 20.981L19.9167 19.481L21.4167 19.4869ZM4.91772 19.4166L4.91089 20.9166L3.41089 20.9107L3.41772 19.4107L4.91772 19.4166ZM22.9294 16.4937L22.9167 19.4937L21.4167 19.4869L21.4294 16.4869L22.9294 16.4937ZM3.43042 16.4107L3.41772 19.4107L1.91772 19.4039L1.93042 16.4039L3.43042 16.4107ZM24.4685 7.49957L24.4294 16.4996L22.9294 16.4937L22.9685 7.49371L24.4685 7.49957ZM1.96851 7.40387L1.93042 16.4039L0.43042 16.398L0.468506 7.39801L1.96851 7.40387ZM12.4744 5.94879L12.449 11.9488L19.949 11.981L19.9431 13.481L10.9431 13.4429L10.9744 5.94293L12.4744 5.94879ZM22.9812 4.49371L22.9685 7.49371L21.4685 7.48688L21.4812 4.48688L22.9812 4.49371ZM3.4812 4.41071L3.46851 7.41071L1.96851 7.40387L1.9812 4.40387L3.4812 4.41071ZM21.4871 2.98688L21.4812 4.48688L19.9812 4.48102L19.9871 2.98102L21.4871 2.98688ZM4.98706 2.91754L4.9812 4.41754L3.4812 4.41071L3.48706 2.91071L4.98706 2.91754ZM19.9939 1.48102L19.9871 2.98102L16.9871 2.96832L16.9939 1.46832L19.9939 1.48102ZM7.9939 1.43024L7.98706 2.93024L4.98706 2.91754L4.9939 1.41754L7.9939 1.43024ZM16.9998 -0.0316772L16.9939 1.46832L7.9939 1.43024L7.99976 -0.0697632L16.9998 -0.0316772Z" />
            </g>
            <defs>
              <clipPath id="clip0_51_17272">
                <rect width="24" height="24" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
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
      <div>
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
          className="w-[106px] h-[40px] rounded-[12px] uppercase bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00]"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_225_9928)">
              <path
                d="M12.4999 15.9997H4.50085L4.49988 13.9997H12.4999V15.9997ZM4.49988 13.9997H2.49988V11.9997H4.49988V13.9997ZM14.4999 13.9997H12.4999V11.9997H14.4999V13.9997ZM2.49988 11.9997H0.499878V3.99966H2.49988V11.9997ZM16.4999 4.00064V11.9997H14.4999V3.99966L16.4999 4.00064ZM8.49988 7.99966L13.4999 8.00064V10.0006L6.49988 9.99966V3.99966H8.49988V7.99966ZM4.49988 3.99966H2.49988L2.50085 1.99966H4.50085L4.49988 3.99966ZM14.4999 3.99966H12.4999L12.5009 1.99966H14.5009L14.4999 3.99966ZM12.5009 1.99966H4.50085L4.49988 -0.000335693H12.4999L12.5009 1.99966Z"
                fill="#121312"
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
          <span className="text-[#121312] uppercase">claim</span>
        </Button>
      </div>
    </div>
  )
}

const refferalData = [
  {
    members: 48,
    icon: (
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
          fill-opacity="0.6"
        />
      </svg>
    ),
  },
  {
    members: 128,
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M10.25 14.2503C12.4591 14.2503 14.25 16.0412 14.25 18.2503V21.0003C14.2498 21.4144 13.9141 21.7503 13.5 21.7503C13.0859 21.7503 12.7502 21.4144 12.75 21.0003V18.2503C12.75 16.8696 11.6307 15.7503 10.25 15.7503H4.75C3.36929 15.7503 2.25 16.8696 2.25 18.2503V21.0003C2.24982 21.4144 1.91411 21.7503 1.5 21.7503C1.08589 21.7503 0.750176 21.4144 0.75 21.0003V18.2503C0.75 16.0412 2.54086 14.2503 4.75 14.2503H10.25ZM17.625 11.2503C20.7315 11.2505 23.25 13.7688 23.25 16.8753V18.0003C23.2498 18.4143 22.914 18.7502 22.5 18.7503C22.086 18.7502 21.7502 18.4143 21.75 18.0003V16.8753C21.75 14.5972 19.9031 12.7505 17.625 12.7503H15.375C14.6792 12.7504 14.0254 12.9223 13.4521 13.2249C13.086 13.4181 12.6319 13.2775 12.4385 12.9115C12.2454 12.5455 12.3853 12.0924 12.751 11.8988C13.535 11.4848 14.4292 11.2504 15.375 11.2503H17.625ZM7.5 3.83334C9.52504 3.83334 11.167 5.47529 11.167 7.50034C11.1668 9.52523 9.52494 11.1673 7.5 11.1673C5.47506 11.1673 3.83318 9.52523 3.83301 7.50034C3.83301 5.47529 5.47496 3.83334 7.5 3.83334ZM7.5 5.16733C6.21134 5.16733 5.16699 6.21167 5.16699 7.50034C5.16717 8.78885 6.21144 9.83334 7.5 9.83334C8.78856 9.83334 9.83283 8.78885 9.83301 7.50034C9.83301 6.21167 8.78866 5.16733 7.5 5.16733ZM15 0.833344C17.025 0.833347 18.667 2.47529 18.667 4.50034C18.6668 6.52523 17.0249 8.16732 15 8.16733C14.6319 8.16729 14.3332 7.86836 14.333 7.50034C14.333 7.13217 14.6318 6.83338 15 6.83334C16.2886 6.83334 17.3328 5.78885 17.333 4.50034C17.333 3.21167 16.2887 2.16733 15 2.16733C14.4078 2.16734 13.8687 2.38698 13.457 2.75034C13.1811 2.99373 12.7592 2.96753 12.5156 2.69174C12.2721 2.41578 12.2984 1.99401 12.5742 1.75034C13.2202 1.1802 14.0706 0.833359 15 0.833344Z"
            fill="white"
            fill-opacity="0.6"
          />
        </g>
      </svg>
    ),
  },
]

const ReferralsLevelsBlock = () => {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {refferalData.map((data, i) => (
        <ReferralsBlock
          key={i}
          icon={data.icon}
          label={`Referrals ${i + 1} lvl`}
          members={data.members || 0}
        />
      ))}
    </div>
  )
}

const ReferralsBlock = ({
  icon,
  label,
  members,
}: {
  icon: React.ReactNode
  label: string
  members: number
}) => {
  return (
    <div className="font-pixel font-[400] flex flex-col items-center justify-center gap-3 px-4 py-2 starboard-result-block-bg backdrop-blur-[16px] rounded-[14px] min-h-[92px]">
      <p className="font-inter text-sm leading-[140%]">{label}</p>
      <div className="flex gap-3 items-center">
        {icon}
        <span className="text-[24px] leading-[32px] tracking-[0.3px]">
          {members}
        </span>
      </div>
    </div>
  )
}

const RefferalsCodeList = ({
  referralsCodesData,
  setReferralsCodesData,
  isToastActive,
  setIsToastActive,
}: {
  referralsCodesData: Array<{
    code: string
    percentageRatio: Array<number>
    members: number
  }>
  setReferralsCodesData: (
    data: Array<{
      code: string
      percentageRatio: Array<number>
      members: number
    }>,
  ) => void
  isToastActive: boolean
  setIsToastActive: (value: boolean) => void
}) => {
  return (
    <>
      <div className="font-pixel pt-[40px] px-3 pb-4 mb-3">
        <div className="flex justify-between items-center gap-2 font-[400]">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            Referrals code
          </h2>
          <Button
            disabled={isToastActive}
            className="h-6 bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00]"
            onClick={async () => {
              if (referralsCodesData.length === 5) {
                setIsToastActive(true)
                const { toast } = await import('sonner')
                toast.error('You can add up to 5 referral codes only', {
                  duration: 5000,
                  className:
                    '!font-inter !text-[#FFFFFF] !font-[400] !leading-[20px] !text-[16px] !border !rounded-[12px] !p-4 !border-[#FFFFFF1F] !bg-[#171914]',
                  invert: true,
                  onAutoClose: () => setIsToastActive(false),
                  onDismiss: () => setIsToastActive(false),
                })
                return
              }
              const generateRandomString = (length: number) => {
                const chars = 'abcdefghijklmnopqrstuvwxyz'
                let result = ''
                for (let i = 0; i < length; i++) {
                  result += chars.charAt(
                    Math.floor(Math.random() * chars.length),
                  )
                }
                return result
              }
              setReferralsCodesData([
                ...referralsCodesData,
                {
                  code: generateRandomString(8),
                  percentageRatio: [0, 0],
                  members: 0,
                },
              ])
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
                fill="#121312"
              />
            </svg>
            <span className="text-[12px] leading-4 text-[#121312] uppercase">
              add new
            </span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {referralsCodesData.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              key={i}
              className="rounded-[14px] starboard-result-block-bg backdrop-blur-[16px] py-1 px-4"
            >
              <div className="flex justify-between items-center font-[400] ">
                <div className="font-inter">
                  <div className="flex items-center">
                    <span className="mr-2 font-[600] text-[16px] leading-5 uppercase">
                      {item.code}
                    </span>
                    <CopyButton content={item.code} />
                  </div>
                  <span className="text-[14px] leading-[120%] text-[#FFFFFF66]">
                    {item.percentageRatio.length === 2
                      ? `${item.percentageRatio[0]}/${item.percentageRatio[1]}%`
                      : `0/0%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-pixel text-[14px] leading-[120%]">
                    {item.members || 0}
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
                      fill-opacity="0.6"
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

const referralsMembersData = [
  { name: 'igorivanov11', referrals: 1, gifts: 5 },
  { name: 'tevial', referrals: 6, gifts: 3 },
  { name: 'marcross', referrals: 2, gifts: 7 },
  { name: 'inaudi_karpin', referrals: 8, gifts: 0 },
  { name: 'igorivanov11', referrals: 3, gifts: 1 },
]

const RefferalsMembersList = () => {
  return (
    <>
      <div className="font-pixel pt-[40px] px-3 pb-4 mb-3">
        <div className="flex justify-between items-center gap-2 font-[400]">
          <h2 className="font-pixel text-[18px] leading-6 uppercase">
            5 frens
          </h2>
          <Link to="/send-gift">
            <Button className="h-6 bg-gradient-to-b from-[#8C35FB] to-[#6602E7]">
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
        {referralsMembersData.map((item, i) => (
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
                    {item.name || 'unknown'}
                  </p>
                  <span className="text-[14px] leading-[120%] text-[#FFFFFF66]">
                    referals:<span className="ml-1">{item.referrals || 0}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    'font-pixel text-[14px] leading-[120%]',
                    item.gifts &&
                      '[text-shadow:0px_0px_20px_rgba(182,255,0,1)] text-[#B6FF00]',
                  )}
                >
                  <span>{item.gifts ? `+${item.gifts}` : 0}</span>
                  <span className="font-pixel text-[#FFFFFF66] text-[10px] ml-1">
                    d
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
