import { cn } from '@/utils'

export const BattleRainSplitLine = ({
  position,
  isX2Boost,
}: {
  position: number
  isX2Boost: boolean
}) => {
  const currentPosition = 100 - position

  return (
    <div
      className={cn(
        `absolute left-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 h-auto transition-all duration-${isX2Boost ? 500 : 1000} ease-linear`,
        position === 50 && 'theme-blue',
        position > 50 && 'theme-green',
        position < 50 && 'theme-purple',
      )}
      style={{
        top: `${currentPosition}%`,
      }}
    >
      <div className="translate-y-[100%] h-[100px] segment-1" />
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
      `}</style>
    </div>
  )
}
