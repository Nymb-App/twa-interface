// import { useContext } from 'react'
// import { ActionButton } from './action-button'
// import { GiftIcon } from '@/assets/icons/gift'
// import { AppContext } from '@/context/app-context'

// export const SendGiftButton = ({
//   setIsStartRoulette,
// }: {
//   setIsStartRoulette?: (value: boolean) => void
// }) => {
//   const { giftCountValue, giftPeriodRadioValue } = useContext(AppContext)

//   return (
//     <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 px-4 bg-[#151317]">
//       <p className="mb-4 font-[400] text-[14px] leading-[140%] text-center text-[#FFFFFF66]">
//         A frend will be randomly selected
//       </p>
//       <ActionButton
//         className="bg-gradient-to-b from-[#8C35FB] to-[#6602E7]"
//         onClick={() => setIsStartRoulette?.(true)}
//       >
//         <GiftIcon fill="white" />
//         <span className="ml-3 font-pixel text-[#FFFFFF] font-[400] uppercase text-[18px] leading-[24px]">
//           send gift {giftCountValue} {giftPeriodRadioValue}
//         </span>
//       </ActionButton>
//     </div>
//   )
// }
