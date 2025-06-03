import Countdown from 'react-countdown'
import { useState } from 'react'
import { TaskDailyBlock } from '../tasks-daily-block/tasks-daily-block'

export function TasksDaily() {
  const [isLeaveACommentTaskCompleted, setIsLeaveACommentTaskCompleted] =
    useState(false)
  const [isBuyTicketsTaskCompleted, setIsBuyTicketsTaskCompleted] =
    useState(false)

  const isDailyAvailableTasks = !(
    isLeaveACommentTaskCompleted && isBuyTicketsTaskCompleted
  )

  return (
    <section className="-mt-4">
      <div className="flex justify-between font-pixel font-[18px] uppercase mb-3 leading-[24px]">
        <h2>daily combo</h2>
        {!isDailyAvailableTasks && <p className="text-[#FFFFFF]/40">Done</p>}
      </div>
      <div className="relative px-4 py-3 starboard-result-block-bg mb-6 rounded-[14px]">
        <div className="flex justify-evenly gap-2">
          <TaskDailyBlock
            title="Leave a Comment"
            reward="1 h"
            buttonActionLabel="open"
            isTaskCompleted={isLeaveACommentTaskCompleted}
            setIsTaskCompleted={setIsLeaveACommentTaskCompleted}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.3255 3H28.7361L19.1001 14.0133L30.4361 29H21.5601L14.6081 19.9107L6.65345 29H2.24012L12.5468 17.22L1.67212 3H10.7735L17.0575 11.308L24.3255 3ZM22.7775 26.36H25.2215L9.44545 5.50133H6.82279L22.7775 26.36Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </TaskDailyBlock>
          <TaskDailyBlock
            title="Buy Tickets"
            reward="10 h"
            buttonActionLabel="buy"
            isTaskCompleted={isBuyTicketsTaskCompleted}
            setIsTaskCompleted={setIsBuyTicketsTaskCompleted}
          >
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.9995 3C31.5518 3 31.9995 3.44772 31.9995 4V10.667C31.9993 11.2191 31.5517 11.667 30.9995 11.667H30.3335C28.6768 11.6672 27.3335 13.0102 27.3335 14.667V15.333C27.3335 16.9898 28.6768 18.3328 30.3335 18.333H30.9995C31.5517 18.333 31.9993 18.7809 31.9995 19.333V27.333C31.9995 27.8853 31.5518 28.333 30.9995 28.333H1.6665C1.11437 28.3328 0.666504 27.8852 0.666504 27.333V19.333C0.666679 18.781 1.11448 18.3332 1.6665 18.333H2.3335C3.9902 18.3328 5.3335 16.9898 5.3335 15.333V14.667C5.3335 13.0102 3.9902 11.6672 2.3335 11.667H1.6665C1.11448 11.6668 0.66668 11.219 0.666504 10.667V4L0.671387 3.89746C0.722708 3.39344 1.14897 3.00016 1.6665 3H30.9995ZM2.6665 9.67871C5.27248 9.85028 7.3335 12.0176 7.3335 14.667V15.333C7.3335 17.9824 5.27248 20.1497 2.6665 20.3213V26.333H29.9995V20.3213C27.3938 20.1494 25.3335 17.9822 25.3335 15.333V14.667C25.3335 12.0178 27.3938 9.85059 29.9995 9.67871V5H2.6665V9.67871ZM14.0005 18.667C14.5526 18.6672 15.0005 19.1148 15.0005 19.667V21.667C15.0003 22.219 14.5525 22.6668 14.0005 22.667H12.0005C11.4483 22.667 11.0007 22.2191 11.0005 21.667V19.667C11.0005 19.1147 11.4482 18.667 12.0005 18.667H14.0005ZM14.0005 12C14.5526 12.0002 15.0005 12.4478 15.0005 13V15C15.0005 15.5522 14.5526 15.9998 14.0005 16H12.0005C11.4482 16 11.0005 15.5523 11.0005 15V13C11.0005 12.4477 11.4482 12 12.0005 12H14.0005ZM15.0005 8.33301C15.0005 8.88518 14.5526 9.33283 14.0005 9.33301H12.0005C11.4482 9.33301 11.0005 8.88529 11.0005 8.33301V5.33301H15.0005V8.33301Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </TaskDailyBlock>
        </div>
        {isDailyAvailableTasks && (
          <div>
            <div className="h-[1px] bg-[#FFFFFF1F] my-3" />
            <p className="font-inter text-[14px] leading-[140%] text-center text-[#FFFFFF] font-[400]">
              Complete all tasks and get an extra:
              <span className="ml-2 font-pixel uppercase leading-[120%] text-[#B6FF00]">
                <span>+</span>
                {/* <span className="-ml-1.5">12</span> */}
                <span>12</span>
                <span className="ml-1.5">H</span>
              </span>
            </p>
          </div>
        )}
        {!isDailyAvailableTasks && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-[400] text-[#FFFFFF]">
            <p className="font-inter text-[14px] leading-[140%] mb-1.5">
              Available via:
            </p>
            <div className="font-pixel text-[20px] leading-[24px]">
              <Countdown date={Date.now() + 86_400_000} renderer={renderer} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const renderer = ({
  minutes,
  seconds,
  total,
}: {
  minutes: number
  seconds: number
  total: number
}) => {
  const totalHours = Math.floor(total / (1000 * 60 * 60))
  const format = (value: number) => String(value).padStart(2, '0')

  return (
    <span>
      {format(totalHours)}:{format(minutes)}:{format(seconds)}
    </span>
  )
}
