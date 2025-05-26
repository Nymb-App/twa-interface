import { cn } from '@/utils'

export const ElectricLines = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute top-[53px] right-[45px] w-full h-full z-0',
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
          <defs>
            <linearGradient
              id="paint0_linear_51_16902"
              x1="11.2273"
              y1="1.02564"
              x2="-3.23677"
              y2="102.958"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#8C35FB" stop-opacity="0" />
              <stop offset="0.5" stop-color="#8C35FB" />
              <stop offset="1" stop-color="#8C35FB" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="white" stop-opacity="0" />
              <stop offset="50%" stop-color="white" stop-opacity="0.8" />
              <stop offset="100%" stop-color="white" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path
            id="electricPath1"
            d="M9.76123 1.02563L48.2612 1.02564L48.2612 52.0256L0.76123 52.0256L0.761229 103.526"
            stroke="url(#paint0_linear_51_16902)"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M9.76123 1.02563L48.2612 1.02564L48.2612 52.0256L0.76123 52.0256L0.761229 103.526"
            stroke="url(#pulseGradient)"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="120"
            stroke-dashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="700"
              to="0"
              dur="15s"
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
          <path
            className="electric-path"
            d="M108.761 59.5256L60.2612 59.5256L60.2612 0.52563L0.761225 0.525635L0.761229 47.0256"
            stroke="url(#paint0_linear_51_16900)"
          />
          <path
            className="electric-glow"
            d="M108.761 59.5256L60.2612 59.5256L60.2612 0.52563L0.761225 0.525635L0.761229 47.0256"
            stroke="url(#paint0_linear_51_16900)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_51_16900"
              x1="0.761229"
              y1="46.5256"
              x2="108.761"
              y2="59.5256"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8C35FB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#8C35FB" />
              <stop offset="1" stopColor="#8C35FB" stopOpacity="0" />
            </linearGradient>
          </defs>
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
          <path
            className="electric-path"
            d="M95.5112 0.775635V29.2131L36.5112 29.2131V65.7756L0.0112305 65.7756"
            stroke="url(#paint0_linear_51_16901)"
          />
          <path
            className="electric-glow"
            d="M95.5112 0.775635V29.2131L36.5112 29.2131V65.7756L0.0112305 65.7756"
            stroke="url(#paint0_linear_51_16901)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_51_16901"
              x1="0.0112306"
              y1="15.0977"
              x2="95.999"
              y2="5.82396"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8C35FB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#8C35FB" />
              <stop offset="1" stopColor="#8C35FB" stopOpacity="0" />
            </linearGradient>
          </defs>
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
          <path
            className="electric-path"
            d="M121.761 61.0256H74.7612V1.02563H0.26123"
            stroke="url(#paint0_linear_51_16903)"
          />
          <path
            className="electric-glow"
            d="M121.761 61.0256H74.7612V1.02563H0.26123"
            stroke="url(#paint0_linear_51_16903)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_51_16903"
              x1="121.761"
              y1="14.246"
              x2="0.648334"
              y2="-1.88139"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8C35FB" stopOpacity="0" />
              <stop offset="0.5" stopColor="#8C35FB" />
              <stop offset="1" stopColor="#8C35FB" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
