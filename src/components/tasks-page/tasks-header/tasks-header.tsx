import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import TasksImage from '/tasks-img.webp'

export function TasksHeader() {
  return (
    <header className="relative flex min-h-[175px] flex-col items-center">
      <img
        src={TasksImage}
        alt="preview-image"
        width={191}
        height={155}
        className="-mt-[20px] animate-[wiggle_3s_ease-in-out_infinite]"
      />
      <FlickeringGrid
        className="absolute inset-0 mask-[radial-gradient(ellipse_180px_100px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={1}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
    </header>
  )
}
