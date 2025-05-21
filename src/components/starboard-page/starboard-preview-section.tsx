import { FlickeringGrid } from '../magicui/flickering-grid'
import StarBoardImage from '/starboard-img.png'

export const StarboardPreviewSection = () => {
  return (
    <div className="flex flex-col items-center relative">
      <h1 className="font-pixel font-[400] text-center text-[24px] leading-[32px] uppercase">
        star board <br />
        12 gate
      </h1>
      <img
        src={StarBoardImage}
        alt="preview-image"
        width={191}
        height={155}
        className="-mt-[20px]"
      />
      <FlickeringGrid
        className="absolute inset-0 z-[-1] mask-[radial-gradient(ellipse_180px_150px_at_center,black,transparent)]"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={0.5}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
    </div>
  )
}
