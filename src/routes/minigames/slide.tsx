import { WatchesIcon } from '@/assets/icons/watches';
import EnergyIcon from '@/assets/icons/energy';
import HeaderBg from '@/assets/svg/header-bg';
import { createFileRoute } from '@tanstack/react-router';
import Countdown from 'react-countdown';
import BombField from '@/components/minigames/playground';
import { PageLayout } from '@/components/ui/page-layout';
// import { SettingsPanel } from './settings-pannel';

export const Route = createFileRoute('/minigames/slide')({
  component: RouteComponent,
});

export function RouteComponent() {
  return (
    <PageLayout
      useFooter={false}
      className='h-[calc(100vh-7.5rem)] flex flex-col'
    >
      {/* ───────── header ───────── */}
      <header className="relative z-10 flex items-center justify-around h-16 shrink-0 overflow-hidden">
        {/* фон расширяем безопасно, чтобы не создавать горизонтальный скролл */}
        <HeaderBg className="absolute inset-0 w-full h-full scale-110" />

        <div className="relative flex items-center justify-between w-full h-full px-4">
          <div className="flex items-center justify-center w-1/3">
            <EnergyIcon />
            <span className="font-pixel text-xl text-[#B6FF00]">1200</span>
          </div>

          <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <Countdown
            date={Date.now() + 30000}
            intervalDelay={1000}
            precision={0}
            renderer={({ minutes, seconds }) => (
              <span className="font-pixel text-2xl text-white">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            )}
          />

          <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="flex items-center justify-center w-1/3">
            <WatchesIcon className="size-9" />
            <span className="font-pixel text-2xl text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]">
              0
            </span>
          </div>
        </div>
      </header>

      {/* ───────── игровое поле ───────── */}
      <div className="flex-1 h-full">
        <BombField className='w-full h-full' />
      </div>
    </PageLayout>
  );
}