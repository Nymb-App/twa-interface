/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createContext, useState } from 'react'
import type { ReactNode } from '@tanstack/react-router'

const currentLevel = 12
const year = 1
const ticket = 1

interface IGateContext {
  currentLevel: number
  year: number
  ticket: number
  isLockedNewGate: boolean
}

export const GateContext = createContext<IGateContext>({
  currentLevel: currentLevel,
  year: year,
  ticket: ticket,
  isLockedNewGate: false,
})

export const GateProvider = ({ children }: { children: ReactNode }) => {
  const [isLockedNewGate, _] = useState(Boolean(year > 0 && ticket > 0))

  return (
    <GateContext.Provider
      value={{
        currentLevel,
        year,
        ticket,
        isLockedNewGate,
      }}
    >
      {children}
    </GateContext.Provider>
  )
}
