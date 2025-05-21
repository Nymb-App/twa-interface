import type { ReactNode } from 'react'

export const Container = ({ children }: { children: ReactNode }) => {
  return <div className="px-3 mb-[70px]">{children}</div>
}
