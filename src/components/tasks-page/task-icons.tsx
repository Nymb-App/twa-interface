import { TasksDailyComboNames } from '@/hooks/api/use-tasks'
import { PiTelegramLogo } from 'react-icons/pi'
import { FaAd } from "react-icons/fa";

import { TbBrandTelegram, TbBrandX } from "react-icons/tb";

export const TwitterSvgIcon = ({ fill = 'white', className }: { fill?: string, className?: string }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2035 1.875H17.9602L11.9377 8.75833L19.0227 18.125H13.4752L9.13017 12.4442L4.1585 18.125H1.40017L7.84183 10.7625L1.04517 1.875H6.7335L10.661 7.0675L15.2035 1.875ZM14.236 16.475H15.7635L5.9035 3.43833H4.26433L14.236 16.475Z"
        fill={fill}
      />
    </svg>
  )
}

export const InviteFrenSvgIcon = ({ fill = 'white', className }: { fill?: string, className?: string }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.1875 11.5623C9.94884 11.5623 12.1874 13.8009 12.1875 16.5623V17.4998C12.1875 18.0175 11.7678 18.4373 11.25 18.4373C10.7322 18.4373 10.3125 18.0175 10.3125 17.4998V16.5623C10.3124 14.8365 8.91331 13.4373 7.1875 13.4373H5.3125C3.58669 13.4373 2.18763 14.8365 2.1875 16.5623V17.4998C2.1875 18.0175 1.76777 18.4373 1.25 18.4373C0.732233 18.4373 0.3125 18.0175 0.3125 17.4998V16.5623C0.312632 13.8009 2.55116 11.5623 5.3125 11.5623H7.1875ZM14.6875 9.06226C17.4488 9.06236 19.6874 11.301 19.6875 14.0623V14.9998C19.6875 15.5175 19.2677 15.9372 18.75 15.9373C18.2323 15.9372 17.8125 15.5175 17.8125 14.9998V14.0623C17.8124 12.3365 16.4132 10.9374 14.6875 10.9373H12.8125C12.2847 10.9373 11.7894 11.0675 11.3555 11.2966C10.8977 11.5382 10.3306 11.3628 10.0889 10.905C9.84749 10.4473 10.0228 9.88012 10.4805 9.63843C11.1776 9.27033 11.9723 9.06228 12.8125 9.06226H14.6875ZM6.25 2.91675C8.09087 2.91675 9.58288 4.40892 9.58301 6.24976C9.58301 8.0907 8.09095 9.58276 6.25 9.58276C4.40905 9.58276 2.91699 8.0907 2.91699 6.24976C2.91712 4.40892 4.40913 2.91675 6.25 2.91675ZM6.25 4.58276C5.32961 4.58276 4.58314 5.32939 4.58301 6.24976C4.58301 7.17023 5.32953 7.91675 6.25 7.91675C7.17047 7.91675 7.91699 7.17023 7.91699 6.24976C7.91686 5.32939 7.17039 4.58276 6.25 4.58276ZM12.5 0.416748C14.3407 0.416896 15.8339 1.90901 15.834 3.74976C15.834 5.59061 14.3408 7.08262 12.5 7.08276C12.0399 7.08259 11.667 6.70989 11.667 6.24976C11.6671 5.78974 12.04 5.41692 12.5 5.41675C13.4203 5.4166 14.167 4.67014 14.167 3.74976C14.1669 2.82948 13.4203 2.08291 12.5 2.08276C12.077 2.08284 11.6926 2.24024 11.3984 2.49976C11.0534 2.80429 10.5262 2.77151 10.2217 2.42651C9.91715 2.08148 9.94993 1.55432 10.2949 1.24976C10.8819 0.731775 11.6555 0.416828 12.5 0.416748Z"
        fill={fill}
      />
    </svg>
  )
}


export const TaskCompletedSvgIcon = ({
  fill,
  stroke,
  className,
}: {
  fill?: string
  stroke?: string
  className?: string
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill={fill || '#B6FF00'} />
    <path
      d="M7.7998 12.4L10.5998 15.2L16.1998 9.60001"
      stroke={stroke || '#121312'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const TaskIcon = ({ taskName, className }: { taskName: string, className?: string }) => {
  if (taskName === TasksDailyComboNames.PostTelegramStory) {
    return <TbBrandTelegram className={className} />
  }
  if (taskName === TasksDailyComboNames.ViewTwitterNews) {
    return <TbBrandX className={className} />
  }
  if (taskName === TasksDailyComboNames.WatchAd) {
    return <FaAd className={className} />
  }
  return null
}
