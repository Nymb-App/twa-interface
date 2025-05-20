import { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'
import { cn } from '@/utils'

export const GameCard = ({
  title,
  description,
  subdescription,
  className,
  animationData,
  classNameBg,
  placeholderSrc,
  delay = 1000, // задержка перед загрузкой Lottie (в мс)
}: {
  title: string
  description: string
  animationData: Record<string, any>
  subdescription?: string
  className?: string
  classNameBg?: string
  placeholderSrc: string
  delay?: number
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [loadLottie, setLoadLottie] = useState(false)
  const [lottieReady, setLottieReady] = useState(false)

  // Intersection Observer для lazy-загрузки
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Запуск загрузки Lottie после задержки и попадания в экран
  useEffect(() => {
    let timer: number
    if (isVisible && !loadLottie) {
      timer = window.setTimeout(() => setLoadLottie(true), delay)
    }
    return () => clearTimeout(timer)
  }, [isVisible, delay, loadLottie])

  // Инициализация и управление анимацией
  useEffect(() => {
    if (loadLottie && containerRef.current && !animationRef.current) {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      })
      anim.setSpeed(0.5)
      anim.addEventListener('DOMLoaded', () => setLottieReady(true))
      animationRef.current = anim
    }
    if (animationRef.current) {
      isVisible ? animationRef.current.play() : animationRef.current.pause()
    }
    return () => {
      animationRef.current?.destroy()
      animationRef.current = null
    }
  }, [loadLottie, isVisible, animationData])

  return (
    <div
      className={cn(
        'rounded-2xl w-full h-max p-[1.3px] overflow-hidden bg-gradient-to-b from-white/20 to-transparent',
      )}
    >
      <div
        className={cn(
          'rounded-2xl w-full h-full pb-5 bg-[#161715] relative overflow-hidden',
          className,
        )}
      >
        <div className="w-full relative overflow-hidden max-h-[250px] min-h-[160px] h-full">
          {classNameBg && (
            <div
              className={cn(
                'absolute left-1/2 -top-[30%] -translate-x-1/2 w-full h-full',
                classNameBg,
              )}
            />
          )}
          {/* Плейсхолдер-картинка до готовности Lottie */}
          {!lottieReady && (
            <img
              src={placeholderSrc}
              alt="animation placeholder"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
            />
          )}
          <div
            ref={containerRef}
            className="absolute left-1/2 top-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div>
          <h3 className="mt-3 text-center text-base font-semibold">{title}</h3>
          <p className="mt-1 font-light text-xs text-white/50 text-center leading-3">
            {description}
          </p>
          {subdescription && (
            <p className="font-light text-xs text-white/50 text-center">
              {subdescription}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
