import { useContext } from 'react'
import { Link } from '@tanstack/react-router'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer'
import { ActionButton } from '../ui/action-button'
import type { ReactNode } from 'react'
import { CloseIcon } from '@/assets/icons/close'
import { GateContext } from '@/context/gate-context'

export const GateDrawerContent = ({
  children,
  title,
  description,
  setIsOpenDrawer,
  footerButton,
}: {
  children: ReactNode
  title?: string
  description?: string
  setIsOpenDrawer?: (value: boolean) => void
  footerButton?: ReactNode
}) => {
  const { currentLevel, isLockedNewGate } = useContext(GateContext)

  return (
    <DrawerContent className="font-[400] bg-[#121312] text-center !rounded-t-[32px] border-t-2 border-[#2f302e] py-3 px-4">
      <DrawerTrigger onClick={() => setIsOpenDrawer?.(false)}>
        <div className="absolute flex justify-center items-center top-[16px] right-[16px] w-[32px] h-[32px] bg-[#1D1F1D] rounded-[32px]">
          <CloseIcon />
        </div>
      </DrawerTrigger>
      <DrawerHeader className="py-0">
        <DrawerTitle className="font-pixel font-[400] uppercase text-[#FFFFFF] text-[24px] leading-[32px] mb-1.5">
          {title}
        </DrawerTitle>
        {description && (
          <DrawerDescription className="text-[#FFFFFF]/60 font-inter text-[14px] leading-[140%] px-6 mb-6">
            {description}
          </DrawerDescription>
        )}
      </DrawerHeader>
      {children}
      <DrawerFooter className="mt-10 px-0 py-0 pb-12">
        <DrawerClose asChild>
          {footerButton ? (
            footerButton
          ) : !isLockedNewGate ? (
            <ActionButton
              onClick={() => setIsOpenDrawer?.(false)}
              className="bg-gradient-to-b from-[#FFFFFF] to-[#999999]"
            >
              <span className="font-pixel text-[#121312] font-[400] uppercase text-[18px] leading-[24px]">
                close
              </span>
            </ActionButton>
          ) : (
            <Link to="/unlock-gate">
              <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
                <span>Go to {currentLevel - 1} gate</span>
              </ActionButton>
            </Link>
          )}
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}
