import { useInView } from 'react-intersection-observer'
import type { PropsWithChildren } from 'react'

interface LazyLoadInViewProps extends PropsWithChildren {
  fallback?: React.ReactNode
}

export function LazyLoadInView({
  children,
  fallback = null,
}: LazyLoadInViewProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '200px 0px',
  })

  return <div ref={ref}>{inView ? children : fallback}</div>
}
