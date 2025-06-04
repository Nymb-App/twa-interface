import { cn } from '@/utils'

export const GateElectricLines = ({
  className,
  svg1ClassName,
  svg2ClassName,
  svg3ClassName,
  svg4ClassName,
}: {
  className?: string
  svg1ClassName?: string
  svg2ClassName?: string
  svg3ClassName?: string
  svg4ClassName?: string
}) => {
  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full z-0',
        className,
      )}
    >
      <div className="relative h-full w-full">
        <svg
          className={cn('absolute top-[20%] left-[70%]', svg1ClassName)}
          width="109"
          height="61"
          viewBox="0 0 109 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <linearGradient
            id="pulseGradient"
            x1="1"
            y1="14"
            x2="109"
            y2="1"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B6FF00" stopOpacity="0" />
            <stop offset="15%" stopColor="#B6FF00" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#B6FF00" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#B6FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <path
            d="M109 1H60.5V60H1V13.5"
            stroke="url(#pulseGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="700"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Вторая svg */}
        <svg
          className={cn('absolute top-[27%] left-[10%]', svg2ClassName)}
          width="103"
          height="49"
          viewBox="0 0 103 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <linearGradient
            id="pulseGradient2"
            x1="0.5"
            y1="11.4661"
            x2="102.433"
            y2="-2.998"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B6FF00" stopOpacity="0" />
            <stop offset="15%" stopColor="#B6FF00" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#B6FF00" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#B6FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
            {/* <stop stop-color="#B6FF00" stop-opacity="0" />
            <stop offset="0.5" stop-color="#B6FF00" />
            <stop offset="1" stop-color="#B6FF00" stop-opacity="0" /> */}
          </linearGradient>
          <path
            d="M0.5 10V48.5H51.5V24.75V1H103"
            stroke="url(#pulseGradient2)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="700"
              to="0"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        {/* Третья svg */}
        <svg
          className={cn('absolute top-[60%] left-[58%]', svg3ClassName)}
          width="122"
          height="61"
          viewBox="0 0 122 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.5 60.5H47.5V0.5H122"
            stroke="url(#pulseGradient3)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="700"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
          <linearGradient
            id="pulseGradient3"
            x1="0.5"
            y1="13.7203"
            x2="121.613"
            y2="-2.40702"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="#B6FF00" stopOpacity="1" />
            <stop offset="70%" stopColor="#B6FF00" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#B6FF00" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#B6FF00" stopOpacity="0" />
          </linearGradient>
        </svg>
        {/* Четвёртая svg */}
        <svg
          className={cn('absolute top-[60%] left-[15%]', svg4ClassName)}
          width="73"
          height="96"
          viewBox="0 0 73 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <linearGradient
            id="pulseGradient4"
            x1="-1.81992e-06"
            y1="1"
            x2="72"
            y2="96"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#B6FF00" stopOpacity="0" />
            <stop offset="15%" stopColor="#B6FF00" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#B6FF00" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#B6FF00" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <path
            d="M0 0.5H31.5V59.5H72V96"
            stroke="url(#pulseGradient4)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            strokeDashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="700"
              to="0"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  )
}
