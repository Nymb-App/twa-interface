import { cn } from '@/utils'

export const ElectricLines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute top-[50px] right-[50px] w-full h-full z-0',
        className,
      )}
    >
      <div className="relative h-full w-full">
        <svg
          className="absolute top-[20px] left-[205px]"
          width="49"
          height="104"
          viewBox="0 0 49 104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C35FB" stopOpacity="0" />
            <stop offset="15%" stopColor="#8C35FB" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#8C35FB" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#8C35FB" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <path
            d="M9.76123 1.02563L48.2612 1.02564L48.2612 52.0256L0.76123 52.0256L0.761229 103.526"
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
          className="absolute top-[43px] left-[10px]"
          width="109"
          height="61"
          viewBox="0 0 109 61"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* <linearGradient id="pulseGradient2" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stop-color="#8C35FB" stop-opacity="0" />
            <stop offset="50%" stop-color="#8C35FB" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#8C35FB" stop-opacity="0" />
          </linearGradient> */}
          <linearGradient id="pulseGradient2" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C35FB" stopOpacity="0" />
            <stop offset="15%" stopColor="#8C35FB" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#8C35FB" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#8C35FB" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <path
            d="M108.761 59.5256L60.2612 59.5256L60.2612 0.52563L0.761225 0.525635L0.761229 47.0256"
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
        {/* Третия svg */}
        <svg
          className="absolute bottom-[70px] -left-[15px]"
          width="97"
          height="67"
          viewBox="0 0 97 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* <linearGradient id="pulseGradient3" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stop-color="#8C35FB" stop-opacity="0" />
            <stop offset="50%" stop-color="#8C35FB" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#8C35FB" stop-opacity="0" />
          </linearGradient> */}
          <linearGradient id="pulseGradient3" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C35FB" stopOpacity="0" />
            <stop offset="15%" stopColor="#8C35FB" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#8C35FB" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#8C35FB" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <path
            d="M95.5112 0.775635V29.2131L36.5112 29.2131V65.7756L0.0112305 65.7756"
            stroke="url(#pulseGradient3)"
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
        {/* Четвёртая svg */}
        <svg
          className="absolute bottom-[33px] left-[155px]"
          width="122"
          height="62"
          viewBox="0 0 122 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* <linearGradient id="pulseGradient2" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stop-color="#8C35FB" stop-opacity="0" />
            <stop offset="50%" stop-color="#8C35FB" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#8C35FB" stop-opacity="0" />
          </linearGradient> */}
          <linearGradient id="pulseGradient4" x1="0" y1="1" x2="1" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="#8C35FB" stopOpacity="1" />
            <stop offset="70%" stopColor="#8C35FB" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#8C35FB" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8C35FB" stopOpacity="0" />
          </linearGradient>
          <path
            d="M121.761 61.0256H74.7612V1.02563H0.26123"
            stroke="url(#pulseGradient4)"
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
      </div>
    </div>
  )
}
