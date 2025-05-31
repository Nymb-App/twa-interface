import { ActionButton } from './action-button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

export const JumpToTheNextGateButton = () => {
  return (
    <div className="fixed bottom-0 pb-12 w-full max-w-[450px] z-50 px-4 bg-[#121312]">
      <Drawer>
        <DrawerTrigger className="w-full">
          <ActionButton className="font-pixel text-[#121312] rounded-[16px] uppercase">
            <span>jump to the next gate</span>
          </ActionButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you sure???</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <button>Submit</button>
            <DrawerClose>
              <button>Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
