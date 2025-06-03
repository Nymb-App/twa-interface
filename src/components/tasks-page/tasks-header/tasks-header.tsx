import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import TasksImage from '/tasks-img.png'

export function TasksHeader() {
  return (
    <header className="flex flex-col items-center relative min-h-[175px]">
      <h1 className="mb-10 font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase">
        tasks
      </h1>
      <img
        src={TasksImage}
        alt="preview-image"
        width={191}
        height={155}
        className="-mt-[20px] animate-[wiggle_3s_ease-in-out_infinite]"
      />
      <FlickeringGrid
        className="absolute inset-0 mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
    </header>
  )
}
