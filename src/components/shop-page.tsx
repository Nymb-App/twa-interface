import { useEffect, useState } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageLayout } from '@/components/ui/page-layout'
import { Progress } from '@/components/ui/progress'
// import { BattleIcon } from '@/assets/icons/battle'
import EnergyIcon from '@/assets/icons/energy'
// import { SwipeIcon } from '@/assets/icons/swipe'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

export function ShopPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <PageLayout>
      <div className="flex flex-col gap-2">
        <h2 className="font-pixel text-2xl text-white">Shop</h2>
        <span className="text-white/60">Buy items to get more rewards</span>
      </div>

      <Carousel setApi={setApi} className="w-full mt-4">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="w-full bg-[#161715] flex flex-col items-center justify-center py-6 gap-2">
                <h3 className="text-white font-pixel text-xl">ENERGY DRINK</h3>
                <EnergyIcon className="size-24" />
                <span className="text-white/60 text-xs">
                  +1 energy for 24 hours
                </span>
                <Button className="mt-2">100 NYM</Button>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current} of {count}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Card className="w-full bg-[#161715] flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-white/5 rounded-lg flex items-center justify-center">
              {/* <SwipeIcon /> */}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-white font-pixel text-lg">MORE SWIPES</h3>
              <span className="text-white/60 text-xs">+10 swipes</span>
            </div>
          </div>
          <Button>100 NYM</Button>
        </Card>
        <Card className="w-full bg-[#161715] flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-white/5 rounded-lg flex items-center justify-center">
              {/* <BattleIcon /> */}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-white font-pixel text-lg">MORE BATTLES</h3>
              <span className="text-white/60 text-xs">+10 battles</span>
            </div>
          </div>
          <Button>100 NYM</Button>
        </Card>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <h2 className="font-pixel text-2xl text-white">LEAGUE</h2>
        <span className="text-white/60">
          Upgrade your league to get more rewards
        </span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Card className="w-full bg-[#161715] flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-pixel text-lg">BRONZE</h3>
            <span className="text-white/60 text-xs">1000 NYM</span>
          </div>
          <Progress value={33} />
          <span className="text-white/60 text-xs">+1 swipe per hour</span>
        </Card>
      </div>
    </PageLayout>
  )
}
