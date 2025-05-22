import { createFileRoute } from '@tanstack/react-router'
import Countdown from 'react-countdown'
import { PageLayout } from '@/components/ui/page-layout'
import { Container } from '@/components/ui/container'
import { CountdownTimerDisplay } from '@/components/ui/countdown-timer-display'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/frens')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageLayout>
      <header className="relative w-full font-pixel font-[400] px-3 bg-[url('/frens-bg.png')] bg-no-repeat bg-bottom pb-6">
        <h1 className="text-center text-[24px] leading-8 uppercase mb-6">
          Invite frens <br /> and get more time
        </h1>
        <p className="font-inter text-center text-[14px] text-[#FFFFFF99] leading-[140%] mb-2">
          Total Earnings:
        </p>
        <Countdown
          date={Number(Date.now() + 443345)}
          intervalDelay={10}
          precision={3}
          renderer={(props: any) => (
            <CountdownTimerDisplay isCountdownHeaderView {...props} />
          )}
        />
      </header>
      <Container>
        <TotalEarningsBlock />
        <ReferralsLevelsBlock />
      </Container>
    </PageLayout>
  )
}

const TotalEarningsBlock = () => {
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
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_51_17272)">
              <path
                d="M16.9041 22.4683L16.8982 23.9683L7.89819 23.9293L7.90503 22.4293L16.9041 22.4683ZM19.9109 20.981L19.9041 22.481L16.9041 22.4683L16.9109 20.9683L19.9109 20.981ZM7.91089 20.9293L7.90503 22.4293L4.90503 22.4166L4.91089 20.9166L7.91089 20.9293ZM21.4167 19.4869L21.4109 20.9869L19.9109 20.981L19.9167 19.481L21.4167 19.4869ZM4.91772 19.4166L4.91089 20.9166L3.41089 20.9107L3.41772 19.4107L4.91772 19.4166ZM22.9294 16.4937L22.9167 19.4937L21.4167 19.4869L21.4294 16.4869L22.9294 16.4937ZM3.43042 16.4107L3.41772 19.4107L1.91772 19.4039L1.93042 16.4039L3.43042 16.4107ZM24.4685 7.49957L24.4294 16.4996L22.9294 16.4937L22.9685 7.49371L24.4685 7.49957ZM1.96851 7.40387L1.93042 16.4039L0.43042 16.398L0.468506 7.39801L1.96851 7.40387ZM12.4744 5.94879L12.449 11.9488L19.949 11.981L19.9431 13.481L10.9431 13.4429L10.9744 5.94293L12.4744 5.94879ZM22.9812 4.49371L22.9685 7.49371L21.4685 7.48688L21.4812 4.48688L22.9812 4.49371ZM3.4812 4.41071L3.46851 7.41071L1.96851 7.40387L1.9812 4.40387L3.4812 4.41071ZM21.4871 2.98688L21.4812 4.48688L19.9812 4.48102L19.9871 2.98102L21.4871 2.98688ZM4.98706 2.91754L4.9812 4.41754L3.4812 4.41071L3.48706 2.91071L4.98706 2.91754ZM19.9939 1.48102L19.9871 2.98102L16.9871 2.96832L16.9939 1.46832L19.9939 1.48102ZM7.9939 1.43024L7.98706 2.93024L4.98706 2.91754L4.9939 1.41754L7.9939 1.43024ZM16.9998 -0.0316772L16.9939 1.46832L7.9939 1.43024L7.99976 -0.0697632L16.9998 -0.0316772Z"
                fill="white"
                fill-opacity="0.6"
              />
            </g>
            <defs>
              <clipPath id="clip0_51_17272">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          <div>
            <span className="text-[24px] leading-[32px] tracking-[0.3px]">
              00
            </span>
            <span className="ml-1 text-[#FFFFFF66]">d</span>
          </div>
        </div>
      </div>
      <div>
        <Button className="w-[106px] h-[40px] rounded-[12px] uppercase bg-gradient-to-b from-[#ADFA4B] from-20% to-[#B6FF00]">
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
          <span className="text-[#121312]">claim</span>
        </Button>
      </div>
    </div>
  )
}

const icons = [
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
  </svg>,
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
  </svg>,
]

const ReferralsLevelsBlock = () => {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {icons.map((icon, i) => (
        <ReferralsBlock
          key={i}
          icon={icon}
          label={`Referrals ${i + 1} lvl`}
          level={0}
        />
      ))}
    </div>
  )
}

const ReferralsBlock = ({
  icon,
  label,
  level,
}: {
  icon: React.ReactNode
  label: string
  level: number
}) => {
  return (
    <div className="font-pixel font-[400] flex flex-col items-center justify-center gap-3 px-4 py-2 starboard-result-block-bg backdrop-blur-[16px] rounded-[14px] min-h-[92px]">
      <p className="font-inter text-sm leading-[140%]">{label}</p>
      <div className="flex gap-3 items-center">
        {icon}
        <span className="text-[24px] leading-[32px] tracking-[0.3px]">
          {level}
        </span>
      </div>
    </div>
  )
}
