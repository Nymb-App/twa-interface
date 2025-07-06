import { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import { useRouterState } from '@tanstack/react-router'

export function BackgroundMusic() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const currentTrackRef = useRef<'main' | 'battle' | 'swipe' | null>(null)

  const soundOptions = { loop: true, volume: 0.4, interrupt: true }

  const [playMain, { stop: stopMain }] = useSound(
    '/sounds/Main-App-Background-Music.aac',
    soundOptions,
  )
  const [playBattle, { stop: stopBattle }] = useSound(
    '/sounds/Battles-Game-Background-Track.aac',
    soundOptions,
  )
  const [playSwipe, { stop: stopSwipe }] = useSound(
    '/sounds/Swipe-Game-Background-Track.aac',
    soundOptions,
  )

  // Effect to unlock audio on the first user interaction.
  useEffect(() => {
    const unlockAudio = () => {
      setAudioUnlocked(true)
    }
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
    }
  }, [])

  // Main effect to control music playback.
  useEffect(() => {
    if (!audioUnlocked) {
      return // Wait for user interaction
    }

    // Default to the main track
    let desiredTrack: typeof currentTrackRef.current = 'main'

    // Override for specific game pages
    if (pathname.startsWith('/minigames/battle')) {
      desiredTrack = 'battle'
    } else if (pathname.startsWith('/minigames/slide')) {
      desiredTrack = 'swipe'
    }

    if (currentTrackRef.current === desiredTrack) {
      return // Avoid restarting the same track
    }

    // Stop all tracks before playing a new one.
    stopMain()
    stopBattle()
    stopSwipe()

    if (desiredTrack === 'swipe') playSwipe()
    else if (desiredTrack === 'battle') playBattle()
    else playMain()

    currentTrackRef.current = desiredTrack
  }, [
    pathname,
    audioUnlocked,
    playMain,
    stopMain,
    playBattle,
    stopBattle,
    playSwipe,
    stopSwipe,
  ])

  return null
}
