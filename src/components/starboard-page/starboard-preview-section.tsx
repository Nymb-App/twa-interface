import { FlickeringGrid } from '../magicui/flickering-grid';
import StarBoardImage from '/starboard-img.png';

export const StarboardPreviewSection = () => {
  return (
    <header className='relative flex flex-col items-center'>
      <img
        src={StarBoardImage}
        alt='preview-image'
        width={191}
        height={155}
        className='-mt-[20px] animate-[wiggle_3s_ease-in-out_infinite]'
      />
      <FlickeringGrid
        className='absolute inset-0 mask-[radial-gradient(ellipse_180px_100px_at_center,black,transparent)]'
        squareSize={2}
        gridGap={12}
        color='#b7ff01'
        maxOpacity={1}
        flickerChance={0.3}
        autoResize={false}
        width={450}
        height={250}
      />
      <h1 className='font-pixel mb-10 text-center text-[24px] leading-[32px] font-[400] uppercase'>
        star board
      </h1>
    </header>
  );
};
