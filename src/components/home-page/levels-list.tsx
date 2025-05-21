import { FlickeringGrid } from '../magicui/flickering-grid'
import { Carousel, CarouselContent } from '../ui/carousel'
import MarqueeArrows from './marquee-arrows'
import { LevelsListItem } from './levels-list-item'

const levels = [
  { num: 12, isLocked: false, isCurrentLevel: true, isNewUnlocked: false },
  { num: 11, isLocked: false, isCurrentLevel: false, isNewUnlocked: true },
  { num: 10, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 9, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 8, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 7, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 6, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 5, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 4, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 3, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 2, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
  { num: 1, isLocked: true, isCurrentLevel: false, isNewUnlocked: false },
]

export const LevelsList = () => {
  return (
    <Carousel
      className="relative pl-2"
      opts={{
        slidesToScroll: 4,
        align: 'center',
      }}
    >
      <CarouselContent className="relative">
        <FlickeringGrid
          className="absolute z-[-1] h-[110px] min-w-[1600px] left-0 right-0 bottom-0 top-[10px]"
          squareSize={2}
          gridGap={18}
          color="#b7ff01"
          flickerChance={0.3}
        />
        <MarqueeArrows />
        {levels.map((level) => (
          <LevelsListItem key={level.num} level={level} />
        ))}
      </CarouselContent>
      <div
        className="
      pointer-events-none
      absolute inset-y-0 right-0
      w-[70px]
      bg-gradient-to-l
      from-[#121312] to-transparent
      "
      />
    </Carousel>
  )
}
