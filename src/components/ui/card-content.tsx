import { Card } from './card'

export const CardContent = ({ isLocked = false }: { isLocked?: boolean }) => {
  return (
    <Card className="p-4 min-h-[104px] flex flex-col justify-center">
      <div className="flex flex-col items-center gap-2">
        {isLocked && (
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 7.5H6C4.89543 7.5 4 8.39543 4 9.5V15.5C4 18.2614 6.23858 20.5 9 20.5H16C18.7614 20.5 21 18.2614 21 15.5V9.5C21 8.39543 20.1046 7.5 19 7.5H16.5M8.5 7.5V6C8.5 3.79086 10.2909 2 12.5 2V2C14.7091 2 16.5 3.79086 16.5 6V7.5M8.5 7.5H16.5M12.5 16V16C11.3954 16 10.5 15.1046 10.5 14V13.5C10.5 12.3954 11.3954 11.5 12.5 11.5V11.5C13.6046 11.5 14.5 12.3954 14.5 13.5V14C14.5 15.1046 13.6046 16 12.5 16Z"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!isLocked && (
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 6.5H5.8789C4.82278 6.5 3.94868 7.32117 3.8828 8.37524L3.33199 17.1881C3.15209 20.0666 5.43815 22.5 8.32226 22.5H16.6777C19.5619 22.5 21.8479 20.0666 21.668 17.1881L21.1172 8.37524C21.0513 7.32117 20.1772 6.5 19.1211 6.5H16.5M8.5 6.5V6C8.5 3.79086 10.2909 2 12.5 2V2C14.7091 2 16.5 3.79086 16.5 6V6.5M8.5 6.5H16.5M8.5 10V11C8.5 13.2091 10.2909 15 12.5 15V15C14.7091 15 16.5 13.2091 16.5 11V10"
              stroke="white"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!isLocked && (
          <h2 className="font-pixel text-[#FFFFFF] font-[400] text-[18px] leading-[24px]">
            shop
          </h2>
        )}
        <p className="text-[12px] font-inter tracking-[0.3px] font-[300] text-[#FFFFFF66] leading-[16px]">
          {!isLocked ? 'Speed you up' : 'Coming soon'}
        </p>
      </div>
    </Card>
  )
}
