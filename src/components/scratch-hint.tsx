import { useEffect, useState } from 'react'
import { TbHandFinger } from 'react-icons/tb'

type HintVariant = 'tap' | 'swipe' | 'circle'

type ScratchHintProps = {
  variant?: HintVariant
  top?: string // CSS value, e.g. "66%"
  left?: string // CSS value, e.g. "50%"
  color?: string // e.g. "#95D9EF"
  size?: number // px (icon size)
  zIndex?: number // overlay order
  autoHideOnFirstPointer?: boolean
  showRipple?: boolean // only meaningful for 'tap'
}

export function ScratchHint({
  variant = 'swipe',
  top = '66%',
  left = '50%',
  color = '#95D9EF',
  size = 64,
  zIndex = 100000,
  autoHideOnFirstPointer = true,
  showRipple = true,
}: ScratchHintProps) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!autoHideOnFirstPointer) return
    const onAnyPointer = () => setHidden(true)
    window.addEventListener('pointerdown', onAnyPointer, {
      once: true,
      capture: true,
    })
    return () =>
      window.removeEventListener('pointerdown', onAnyPointer, {
        capture: true,
      } as any)
  }, [autoHideOnFirstPointer])

  if (hidden) return null

  const baseTransform = 'translate(-50%, -50%)'

  // animation names map
  const anim =
    variant === 'tap'
      ? 'hint-tap 1.1s ease-in-out infinite'
      : variant === 'circle'
        ? 'hint-circle 1.6s linear infinite'
        : 'hint-swipe 1.8s ease-in-out infinite'

  return (
    <>
      {/* Inline global styles for keyframes */}
      <style>{`
        @keyframes hint-tap {
          0%   { transform:${baseTransform} scale(1);    opacity:.85; }
          20%  { transform:${baseTransform} scale(.96);  opacity:1;   }
          40%  { transform:${baseTransform} scale(1.02); opacity:1;   }
          60%  { transform:${baseTransform} scale(1);    opacity:.92; }
          100% { transform:${baseTransform} scale(1);    opacity:.85; }
        }
        @keyframes hint-ripple {
          0%   { transform:${baseTransform} scale(.55); opacity:.6; }
          70%  { transform:${baseTransform} scale(1.35); opacity:0; }
          100% { transform:${baseTransform} scale(1.35); opacity:0; }
        }
        @keyframes hint-swipe {
          0%   { transform:${baseTransform} translateX(-36px) rotate(-6deg); opacity:.95; }
          10%  { opacity:1; }
          50%  { transform:${baseTransform} translateX(36px) rotate(6deg);   opacity:1; }
          90%  { opacity:1; }
          100% { transform:${baseTransform} translateX(-36px) rotate(-6deg); opacity:.95; }
        }
        @keyframes hint-circle {
          0%   { transform:${baseTransform} rotate(0deg)   translateX(24px) rotate(0deg); }
          25%  { transform:${baseTransform} rotate(90deg)  translateX(24px) rotate(-90deg); }
          50%  { transform:${baseTransform} rotate(180deg) translateX(24px) rotate(-180deg); }
          75%  { transform:${baseTransform} rotate(270deg) translateX(24px) rotate(-270deg); }
          100% { transform:${baseTransform} rotate(360deg) translateX(24px) rotate(-360deg); }
        }
        @keyframes hint-trail {
          0%   { opacity:0;   transform:${baseTransform} scale(.8); }
          30%  { opacity:.6; }
          100% { opacity:0;   transform:${baseTransform} scale(1.1); }
        }
      `}</style>

      {/* Icon + optional ripple/trail */}
      <div style={{ position: 'absolute', top, left, pointerEvents: 'none' }}>
        {/* Ripple for TAP */}
        {variant === 'tap' && showRipple && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: size * 0.9,
              height: size * 0.9,
              transform: baseTransform,
              borderRadius: '9999px',
              border: `2px solid ${color}80`, // 50% alpha
              animation: 'hint-ripple 1.1s ease-out infinite',
              filter: 'drop-shadow(0 0 6px rgba(0,0,0,.25))',
            }}
          />
        )}

        {/* Finger icon */}
        <TbHandFinger
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: baseTransform,
            color,
            width: size,
            height: size,
            zIndex,
            animation: anim,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.35))',
          }}
        />

        {/* Optional swipe trail dots */}
        {variant === 'swipe' && (
          <>
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(calc(-50% - 36px), -50%)`,
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: '9999px',
                background: `${color}4D`, // 30% alpha
                animation: 'hint-trail 1.8s ease-in-out infinite',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(calc(-50% + 36px), -50%)`,
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: '9999px',
                background: `${color}4D`,
                animation: 'hint-trail 1.8s ease-in-out infinite .9s',
              }}
            />
          </>
        )}
      </div>
    </>
  )
}
