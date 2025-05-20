import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'

export function LazyVideo({
  src,
  className,
  style,
  poster,
}: {
  src?: string
  className?: string
  style?: React.CSSProperties
  poster?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isIntersecting, setIntersecting] = useState(false)

  // 1) Настраиваем IntersectionObserver
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Чтобы browser заранее загрузил видео для плавного старта
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.loop = true

    const obs = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.5 }, // как только 50% ролика в зоне — считаем видимым
    )

    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  // 2) Следим за видимостью таба/окна
  useEffect(() => {
    const handleVis = () => {
      const video = videoRef.current
      if (!video) return
      if (document.visibilityState === 'hidden') {
        video.pause()
      } else if (isIntersecting) {
        video.play().catch(() => {
          /* игнорим блок автоплея */
        })
      }
    }

    document.addEventListener('visibilitychange', handleVis)
    return () => document.removeEventListener('visibilitychange', handleVis)
  }, [isIntersecting])

  // 3) Запускаем или ставим на паузу при смене isIntersecting
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isIntersecting && document.visibilityState === 'visible') {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isIntersecting])

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={cn('rounded-2xl', className)}
      src={src}
      style={style}
      playsInline
      preload="auto"
      autoPlay
      loop
      muted
    />
  )
}
