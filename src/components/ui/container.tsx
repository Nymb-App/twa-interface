import type { ReactNode } from 'react'
import { cn } from '@/utils'

export const Container = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return <div className={cn('px-3', className)}>{children}</div>
}
