import { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import { useRouterState } from '@tanstack/react-router'

export function BackgroundMusic() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const [playMain, { pause: pauseMain }] = useSound(
    '/sounds/Main%20App%20Background%20Music.wav',
    {
      loop: true,
      volume: 0.4,
      interrupt: false,
    },
  )

  const [playBattle, { pause: pauseBattle }] = useSound(
    '/sounds/Battles%20Game%20Background%20Track.wav',
    {
      loop: true,
      volume: 0.4,
      interrupt: false,
    },
  )

  const [playSwipe, { pause: pauseSwipe }] = useSound(
    '/sounds/Swipe%20Game%20Background%20Track.wav',
    {
      loop: true,
      volume: 0.4,
      interrupt: false,
    },
  )

  const [audioUnlocked, setAudioUnlocked] = useState(false)

  // Track which audio is currently active to avoid restarting it unnecessarily
  const currentTrackRef = useRef<'main' | 'battle' | 'swipe' | null>(null)

  // This effect handles the browser's autoplay policy by waiting for the first
  // user interaction to unlock audio. Once unlocked, it forces the main effect
  // to re-evaluate which track should be playing.
  useEffect(() => {
    const unlockAudio = () => {
      // By setting the ref to null, we ensure the main effect's guard clause
      // `currentTrackRef.current === desired` will fail, allowing a replay.
      currentTrackRef.current = null
      setAudioUnlocked(true)
    }

    window.addEventListener('pointerdown', unlockAudio, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
    }
  }, [])

  useEffect(() => {
    let desired: typeof currentTrackRef.current = 'main'

    if (pathname.startsWith('/minigames/battle')) {
      desired = 'battle'
    } else if (pathname.startsWith('/minigames/slide')) {
      desired = 'swipe'
    }

    // If desired track is already playing, do nothing
    if (currentTrackRef.current === desired) return

    // Pause whatever was playing previously
    switch (currentTrackRef.current) {
      case 'main':
        pauseMain()
        break
      case 'battle':
        pauseBattle()
        break
      case 'swipe':
        pauseSwipe()
        break
    }

    // Play the desired track (or keep all paused for other minigames)
    switch (desired) {
      case 'main':
        playMain()
        break
      case 'battle':
        playBattle()
        break
      case 'swipe':
        playSwipe()
        break
    }

    currentTrackRef.current = desired
  }, [
    pathname,
    audioUnlocked, // Re-run when audio is unlocked
    playMain,
    pauseMain,
    playBattle,
    pauseBattle,
    playSwipe,
    pauseSwipe,
  ])

  return null
}
