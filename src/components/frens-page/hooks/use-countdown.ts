import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

export const useCountdown = (
  from: number,
  duration: number,
  enabled: boolean,
) => {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!enabled) {
      setValue(from)
      return
    }

    const controls = animate(from, 0, {
      duration: duration / 1000,
      ease: 'linear',
      onUpdate: setValue,
    })

    return () => controls.stop()
  }, [from, duration, enabled])

  return value
}
