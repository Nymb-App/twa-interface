import { NavigationMenu } from './ui/navigation-menu'
import type { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col h-screen text-white overflow-hidden pb-6">
      <div className="flex-1 overflow-y-auto pt-24 pb-4 overflow-x-hidden">
        {children}
      </div>
      <NavigationMenu />
    </main>
  )
}
