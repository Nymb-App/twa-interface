'use client'

import { useEffect, useRef, useState } from 'react'

export const AnimationObserver: React.FC<{
  children: React.ReactNode
  className?: string
  threshold?: number
}> = ({ children, className = 'opacity-100', threshold = 0.9 }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target) // Останавливаем наблюдение
        }
      },
      { threshold },
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`absolute w-full h-full left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out transform ${isVisible ? className : 'opacity-0'}`}
    >
      {children}
    </div>
  )
}
