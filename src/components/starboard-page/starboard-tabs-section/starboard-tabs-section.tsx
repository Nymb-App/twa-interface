import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { levelsList, tabsDataCurrentUser } from './data'
import { StarboardPersonalRateBlock } from './starboard-personal-rate-block/starboard-personal-rate-block'
import { StarboardTopRateBlock } from './starboard-top-rate-block/starboard-top-rate-block'
import { Container } from '@/components/ui/container'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

export const StarboardTabsSection = () => {
  return (
    <Tabs defaultValue="12" className="-mt-[10px]">
      <TabsList className="mb-4 pl-3">
        <Carousel opts={{ slidesToScroll: 4 }}>
          <CarouselContent className="flex gap-2 mr-7">
            {levelsList.map((item, idx) => (
              <CarouselItem className="basis-[80px] flex">
                <TabsTrigger
                  defaultChecked={idx === 0}
                  key={idx}
                  value={item}
                  className="data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#121312] h-[30px] w-[80px] py-2 px-2.5 shrink-0 bg-[#FFFFFF14] rounded-[64px] text-[#FFFFFF] font-pixel font-[400] text-[12px] leading-[120%] uppercase"
                >
                  {item} gate
                </TabsTrigger>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </TabsList>

      <Container>
        {tabsDataCurrentUser.map((item, idx) => (
          <TabsContent
            key={`current-${item.gate}-${idx}`}
            value={item.gate}
            className="flex flex-col gap-2"
          >
            <StarboardPersonalRateBlock />
            <h2 className="font-pixel uppercase font-[400] text-[18px] leading-[24px] mt-6 mb-2">
              top 100 users
            </h2>
            <StarboardTopRateBlock users={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
          </TabsContent>
        ))}
      </Container>
    </Tabs>
  )
}
