import { cn } from '@/lib/utils'

export const BattleRainSplitLine = ({
  position = 50,
  className,
  style,
  onAnimationEnd,
}: {
  position?: number
  className?: string
  style?: React.CSSProperties
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}) => {
  const currentPosition = 100 - position

  return (
    <div
      className={cn(
        `absolute left-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 h-auto transition-all duration-100`,
        position === 50 && 'theme-blue',
        position > 50 && 'theme-green',
        position < 50 && 'theme-purple',
        className,
      )}
      style={{
        top: `${currentPosition}%`,
        ...style,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="translate-y-[100%] h-[100px] segment-1 flicker" />
      <div className="translate-y-0 h-[100px] segment-2" />
      <div className="translate-y-[-100%] h-[100px] segment-3" />
      <style>{`
        /* === Default Blue Theme === */
          .theme-blue .segment-1 {
            background: radial-gradient(50% 49.66% at 50% 50.34%, #0048FF 11.54%, rgba(0, 72, 255, 0) 91.83%);
          }
          .theme-blue .segment-2 {
            background: radial-gradient(50% 19.91% at 50% 50.34%, #6988FA 15.38%, rgba(0, 72, 255, 0) 91.83%);
          }
          .theme-blue .segment-3 {
            background: radial-gradient(50% 7.15% at 50% 50.34%, #D9D9D9 36.68%, rgba(217, 217, 217, 0) 100%);
          }

        /* === Green Theme === */
          .theme-green .segment-1 {
            background: radial-gradient(50% 49.66% at 50% 50.34%, #B6FF00 11.54%, rgba(255, 0, 0, 0) 91.83%);
          }
          .theme-green .segment-2 {
            background: radial-gradient(50% 19.91% at 50% 50.34%, #B6FF00 15.38%, rgba(255, 0, 0, 0) 91.83%);
          }
          .theme-green .segment-3 {
            background: radial-gradient(50% 7.15% at 50% 50.34%, #FFFFFF 36.68%, rgba(255, 204, 204, 0) 100%);
          }

        /* === Purple Theme === */
          .theme-purple .segment-1 {
            background: radial-gradient(50% 49.66% at 50% 50.34%, #8c35fb66 11.54%, rgba(255, 0, 0, 0) 91.83%);
          }
          .theme-purple .segment-2 {
            background: radial-gradient(50% 19.91% at 50% 50.34%, #8c35fb66 15.38%, rgba(255, 0, 0, 0) 91.83%);
          }
          .theme-purple .segment-3 {
            background: radial-gradient(50% 7.15% at 50% 50.34%, #FFFFFF 36.68%, rgba(255, 204, 204, 0) 100%);
          }

          @keyframes flicker2 {
            0% { opacity: 1; transform: scale(1); }
            5% { opacity: 0.2; transform: scale(0.93); }
            10% { opacity: 1; transform: scale(1.03); }
            15% { opacity: 0.1; transform: scale(0.92); }
            20% { opacity: 1; transform: scale(1.02); }
            25% { opacity: 0.3; transform: scale(0.96); }
            30% { opacity: 1; transform: scale(1); }
            70% { opacity: 1; transform: scale(1); }
            75% { opacity: 0.1; transform: scale(0.94); }
            80% { opacity: 1; transform: scale(1.01); }
            85% { opacity: 0.2; transform: scale(0.95); }
            90% { opacity: 1; transform: scale(1); }
          }

          .flicker {
            animation: flicker2 2.5s infinite;
          }
      `}</style>
    </div>
  )
}
