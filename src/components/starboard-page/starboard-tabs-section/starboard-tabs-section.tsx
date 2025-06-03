import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { gatesCurrentUserData, gatesUsersData, levelsList } from './data'
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
              <CarouselItem key={idx} className="basis-[80px] flex">
                <TabsTrigger
                  defaultChecked={idx === 0}
                  key={idx}
                  value={String(item)}
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
        {levelsList.map((gate, idx) => {
          const gateCurrentUserData = gatesCurrentUserData.find(
            (g) => g.gate === Number(gate),
          )
          const gateUserData = gatesUsersData.find(
            (g) => g.gate === Number(gate),
          )
          return (
            <TabsContent
              key={`gate-${gate}-${idx}`}
              value={String(gate)}
              className="flex flex-col gap-2"
            >
              {gateCurrentUserData ? (
                <StarboardPersonalRateBlock
                  gateCurrentUserData={gateCurrentUserData}
                />
              ) : (
                <StarboardPersonalRateBlock gateCurrentUserData={undefined} />
              )}
              {gateUserData?.users.length ? (
                <>
                  <h2 className="font-pixel uppercase font-[400] text-[18px] leading-[24px] mt-6 mb-2">
                    top 100 users
                  </h2>

                  {gateUserData.users.map((gateData, gateUserIdx) => (
                    <StarboardTopRateBlock
                      key={idx + gateData.time}
                      idx={gateUserIdx}
                      gateUserData={gateData}
                    />
                  ))}
                </>
              ) : (
                <div className="h-[246px] flex flex-col items-center justify-center font-pixel mt-4">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-[#B6FF0014] blur-[28px] shadow-[0px_0px_0px_3px_#B6FF00]" />
                    <div className="relative flex items-center justify-center">
                      <div className="text-[#B6FF00] text-[76px] font-[400] leading-[120%]">
                        :
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[#FFFFFF] font-[400] leading-[24px] text-[18px]">
                    <p>NO USER</p>
                    <p>ON THIS GATE</p>
                  </div>
                </div>
              )}
            </TabsContent>
          )
        })}
      </Container>
    </Tabs>
  )
}
