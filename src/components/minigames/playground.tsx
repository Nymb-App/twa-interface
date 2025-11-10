/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/**
 * BombField.tsx
 * ——————————————————————————————————————————————
 *  • lifeMin / lifeMax
 *  • x2-bonus (forced ≤ 15 s, prob. + cooldown)
 *  • gameDuration → исчезновение всех айтемов
 *  • onGameFinished callback
 *  • двойной флаг gameEnded (ref + state)
 */

import { BombIcon } from '@/assets/icons/bomb'
import { WatchesIcon } from '@/assets/icons/watches'
import { X2Icon } from '@/assets/icons/x2'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@tma.js/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { DotPatternHandle } from './dot-pattern-interactive'
import { DotPatternInteractive } from './dot-pattern-interactive'

/* ────────────────────────────
   типы
────────────────────────────── */
type ItemType = 'bomb' | 'time' | 'x2'

interface Item {
  id: string
  type: ItemType
  cell: number
  top: number
  left: number
  rot: number
  isAppearing: boolean
  isDisappearing: boolean
  isManual: boolean
}

interface BombFieldProps {
  winAmount?: number

  gridGap?: number
  bombCount?: number
  timerCount?: number
  onInteractionEnter?: (p: {
    item: ItemType
    posX: number
    posY: number
  }) => void
  onGameFinished?: () => void
  onPointerUp?: () => void

  colliderPx?: number
  bombRadiusPx?: number

  lifeMin?: number
  lifeMax?: number
  groupCount?: number
  autoExitMs?: number
  autoSpawnDelayMs?: number
  manualExitMs?: number
  manualDelay?: number

  x2Enabled?: boolean
  x2Count?: number
  x2SpawnIntervalMs?: number
  x2SpawnProbability?: number

  patternGap?: number
  baseRadius?: number
  maxRadius?: number
  reach?: number
  blur?: number
  staticColor?: string
  activeColor?: string
  trailing?: boolean
  trailLength?: number
  minTrailLength?: number
  trailingLifetime?: number
  trailingRadius?: number
  trailingColor?: string
  drawEffect?: 'normal' | 'fish-eye' | 'wave'

  waveOnPointerUp?: boolean
  waveReach?: number
  waveStrength?: number
  waveThickness?: number
  waveDuration?: number
  waveColor?: string

  gameDuration?: number
  startCooldown?: number
  isForcePause?: boolean

  className?: string
  showPlayground?: boolean
}

/* ────────────────────────────
   component
────────────────────────────── */
export default function BombField({
  winAmount = 2,

  /* базовые дефолты */
  gridGap = 10,
  bombCount = 3,
  timerCount = 16,

  colliderPx = 56,
  bombRadiusPx = 200,

  lifeMin = 1000,
  lifeMax = 2000,
  groupCount = 4,
  autoExitMs = 200,
  autoSpawnDelayMs = 2000,
  manualExitMs = 700,
  manualDelay = 5000,

  /* x2 */
  x2Enabled = true,
  x2Count = 1,
  x2SpawnIntervalMs = 30_000,
  x2SpawnProbability = 10,

  /* точки-фон */
  patternGap = 40,
  baseRadius = 2,
  maxRadius = 4,
  reach = 80,
  // blur = 0,
  // staticColor = '#969695',
  // activeColor = '#B6FF00',

  // trailing = true,
  // minTrailLength = 1,
  // trailingLifetime = 50,
  trailingRadius = 8,
  trailingColor = '#B6FF00',
  drawEffect = 'wave',

  /* волна */
  waveOnPointerUp = false,
  waveReach = 300,
  waveStrength = 0.15,
  waveThickness = 0.3,
  waveDuration = 1,
  waveColor = '#EF5252',

  /* раунд */
  gameDuration = 31_000,
  startCooldown = 3000,
  isForcePause = false,

  /* ui */
  className,
  showPlayground = false,
  onInteractionEnter,
  onGameFinished,
  // onPointerUp,
}: BombFieldProps) {
  /* refs / state */
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<DotPatternHandle>(null)

  const takenCells = useRef<Set<number>>(new Set())
  const timersRef = useRef<Map<string, Array<number>>>(new Map())
  const manualRem = useRef<Set<string>>(new Set())
  const itemsRef = useRef<Array<Item>>([])
  const gameStartedRef = useRef(false)

  /* двойной флаг конца раунда */
  const gameEndedRef = useRef(false)
  const [gameEnded, setGameEnded] = useState(false) // для UI

  const cellTotal = gridGap * gridGap
  const cellStep = 90 / (gridGap - 1)

  const [items, setItems] = useState<Array<Item>>([])
  const [threshold, setThreshold] = useState(0)
  const [_, setCountdown] = useState<number | null>(null)

  const [trailLength, setTrailLength] = useState(30)

  // Автожест после завершения игры
  const autoTrailTimerRef = useRef<number | null>(null)
  const autoTrailActiveRef = useRef<boolean>(false)

  /* ── helpers ───────────────────────────────────────────── */
  const clearTimers = (id: string) => {
    timersRef.current.get(id)?.forEach(clearTimeout)
    timersRef.current.delete(id)
  }

  const pickLife = () => {
    const chunk = (lifeMax - lifeMin) / groupCount
    const idx = Math.floor(Math.random() * groupCount)
    return lifeMin + idx * chunk + Math.random() * chunk
  }

  const makeItem = (type: ItemType, cell: number, manual = false): Item => {
    const row = Math.floor(cell / gridGap)
    const col = cell % gridGap
    return {
      id: crypto.randomUUID(),
      type,
      cell,
      top: 5 + row * cellStep,
      left: 5 + col * cellStep,
      rot: Math.random() * 360,
      isAppearing: true,
      isDisappearing: false,
      isManual: manual,
    }
  }

  const getFreeCells = () => {
    const free: Array<number> = []
    for (let i = 0; i < cellTotal; i++)
      if (!takenCells.current.has(i)) free.push(i)
    return free
  }

  const pickSafeCell = (survivors: Array<Item>): number | null => {
    const free = getFreeCells()
    const rect = containerRef.current!.getBoundingClientRect()

    const safe = free.filter((cell) => {
      const row = Math.floor(cell / gridGap)
      const col = cell % gridGap
      const xp = rect.left + ((5 + col * cellStep) / 100) * rect.width
      const yp = rect.top + ((5 + row * cellStep) / 100) * rect.height
      return survivors.every((it) => {
        const ipx = rect.left + (it.left / 100) * rect.width
        const ipy = rect.top + (it.top / 100) * rect.height
        return (
          Math.hypot(ipx - xp, ipy - yp) >=
          Math.max(threshold * 1.5, bombRadiusPx * 0.4)
        )
      })
    })

    if (!safe.length) return null
    return safe[Math.floor(Math.random() * safe.length)]
  }

  /* ── scheduleAuto ───────────────────────────────────────── */
  const scheduleAuto = useCallback(
    (it: Item) => {
      if (gameEndedRef.current || isForcePause) {
        return
      }

      clearTimers(it.id)

      const life = pickLife()
      const t1 = setTimeout(() => {
        setItems((cur) =>
          cur.map((x) =>
            x.id === it.id
              ? { ...x, isDisappearing: true, isManual: false }
              : x,
          ),
        )
      }, life)

      const t2 = setTimeout(
        () => {
          setItems((cur) => {
            takenCells.current.delete(it.cell)
            timersRef.current.delete(it.id)
            const survivors = cur.filter((x) => x.id !== it.id)

            if (gameEndedRef.current || isForcePause) return survivors
            if (it.type === 'x2') return survivors

            const limit = it.type === 'bomb' ? bombCount : timerCount
            const current = survivors.filter((x) => x.type === it.type).length
            if (current < limit) {
              const cell = pickSafeCell(survivors)
              if (cell !== null) {
                takenCells.current.add(cell)
                const repl = makeItem(it.type, cell)
                scheduleAuto(repl)
                return [...survivors, repl]
              }
            }
            return survivors
          })
        },
        life + autoExitMs + autoSpawnDelayMs,
      )

      timersRef.current.set(it.id, [
        t1 as unknown as number,
        t2 as unknown as number,
      ])
    },
    [lifeMin, lifeMax, groupCount, autoExitMs, autoSpawnDelayMs, isForcePause],
  )

  /* ── начальная генерация поля ──────────────────────────── */
  useEffect(() => {
    if (isForcePause || gameEndedRef.current) {
      return
    }

    if (startCooldown <= 0) {
      gameStartedRef.current = true
      return
    }

    // Начинаем отсчет с 3
    setCountdown(3)

    // Обновляем отсчет каждую секунду
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          return null
        }
        return prev - 1
      })
    }, 1000)

    // Показываем GO! и начинаем игру
    const goTimer = setTimeout(() => {
      setCountdown(-1) // Используем -1 для показа "GO!"

      // Убираем "GO!" и запускаем игру через секунду
      const startGameTimer = setTimeout(() => {
        if (isForcePause || gameEndedRef.current) {
          return
        }

        setCountdown(null)
        gameStartedRef.current = true

        // Начинаем спавн айтемов
        const initialSpawnCount = 5
        const spawnInterval = 800
        const start: Array<Item> = []
        let spawnQueue: Array<() => Item | null> = []

        // Prepare spawn functions for all items
        Array.from({ length: bombCount }).forEach(() => {
          spawnQueue.push(() => {
            if (isForcePause || gameEndedRef.current) return null
            const cell = pickSafeCell(itemsRef.current)
            if (cell === null) return null
            takenCells.current.add(cell)
            return makeItem('bomb', cell)
          })
        })

        Array.from({ length: timerCount }).forEach(() => {
          spawnQueue.push(() => {
            if (isForcePause || gameEndedRef.current) return null
            const cell = pickSafeCell(itemsRef.current)
            if (cell === null) return null
            takenCells.current.add(cell)
            return makeItem('time', cell)
          })
        })

        // Shuffle spawn queue for random initial selection
        spawnQueue = spawnQueue.sort(() => Math.random() - 0.5)

        // Initial spawn
        for (
          let i = 0;
          i < Math.min(initialSpawnCount, spawnQueue.length);
          i++
        ) {
          if (isForcePause || gameEndedRef.current) break
          const item = spawnQueue[i]()
          if (item) {
            start.push(item)
            scheduleAuto(item)
          }
        }

        // Set initial items
        itemsRef.current = start
        setItems(start)

        // Schedule remaining spawns
        let currentIndex = initialSpawnCount
        const spawnTimer = setInterval(() => {
          if (
            isForcePause ||
            gameEndedRef.current ||
            currentIndex >= spawnQueue.length
          ) {
            clearInterval(spawnTimer)
            return
          }

          const item = spawnQueue[currentIndex]()
          if (item) {
            setItems((current) => {
              const newItems = [...current, item]
              itemsRef.current = newItems
              scheduleAuto(item)
              return newItems
            })
          }
          currentIndex++
        }, spawnInterval)
      }, 1000)

      return () => clearTimeout(startGameTimer)
    }, startCooldown - 1000)

    return () => {
      clearInterval(countdownInterval)
      clearTimeout(goTimer)
    }
  }, [startCooldown, bombCount, timerCount, scheduleAuto, isForcePause])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    const w = containerRef.current?.clientWidth ?? window.innerWidth
    setThreshold((colliderPx / w) * 100)
  }, [colliderPx])

  /* ── x2-бонус ───────────────────────────────────────────── */
  useEffect(() => {
    if (!x2Enabled || gameEndedRef.current || isForcePause) return

    const MAX = 5
    const FORCE = 15_000
    const COOL = 5_000

    let spawned = 0
    let last = 0
    const t0 = Date.now()

    const spawn = () => {
      if (spawned >= MAX || gameEndedRef.current) return
      if (itemsRef.current.some((it) => it.type === 'x2')) return

      const free = getFreeCells()
      if (!free.length) return

      const cell = free[Math.floor(Math.random() * free.length)]
      takenCells.current.add(cell)
      const item = makeItem('x2', cell)
      setItems((cur) => [...cur, item])
      scheduleAuto(item)

      spawned++
      last = Date.now()
    }

    const tick = () => {
      if (gameEndedRef.current) return
      if (spawned === 0 && Date.now() - t0 >= FORCE) {
        spawn()
        return
      }
      if (Date.now() - last < COOL) return
      if (Math.random() * 100 <= x2SpawnProbability) spawn()
    }

    const iv = setInterval(tick, x2SpawnIntervalMs)
    const fo = setTimeout(() => {
      if (spawned === 0) spawn()
    }, FORCE)
    return () => {
      clearInterval(iv)
      clearTimeout(fo)
    }
  }, [
    x2Enabled,
    x2SpawnIntervalMs,
    x2SpawnProbability,
    scheduleAuto,
    isForcePause,
  ])

  /* ── завершение раунда ─────────────────────────────────── */
  useEffect(() => {
    let gameTimer: NodeJS.Timeout | null = null

    const handleGameEnd = () => {
      if (gameEndedRef.current) return // защита от повторов

      // Очищаем таймер игры если он есть
      if (gameTimer) {
        clearTimeout(gameTimer)
        gameTimer = null
      }

      gameEndedRef.current = true
      setGameEnded(true) // отключит трейлинг в UI

      // Запускаем непрерывный авто-жест, пока пользователь не выйдет или не перезапустит
      autoTrailActiveRef.current = true

      const loop = () => {
        if (!autoTrailActiveRef.current) return

        // Случайные параметры для естественности
        const duration = 600 + Math.floor(Math.random() * 600) // 600-1200 ms
        const speed = 6 + Math.random() * 10 // умеренная скорость

        dotRef.current?.spawnRandomTrail?.({ durationMs: duration, speed })

        // Пауза между жестами
        const gap = 250 + Math.floor(Math.random() * 450) // 250-700 ms
        autoTrailTimerRef.current = setTimeout(
          loop,
          duration + gap,
        ) as unknown as number
      }

      // Небольшая задержка, чтобы эффект начался, когда айтемы скрылись
      autoTrailTimerRef.current = setTimeout(loop, 80) as unknown as number

      // Очищаем все таймеры
      timersRef.current.forEach((arr) => arr.forEach(clearTimeout))
      timersRef.current.clear()

      // Помечаем все существующие айтемы как исчезающие
      setItems((cur) =>
        cur.map((i) => ({ ...i, isDisappearing: true, isManual: false })),
      )

      // Очищаем все занятые ячейки
      takenCells.current.clear()

      // Через время анимации исчезновения удаляем все айтемы
      setTimeout(() => {
        setItems([])
      }, autoExitMs)

      onGameFinished?.() // коллбек
    }

    // Обработка принудительной паузы
    if (isForcePause) {
      handleGameEnd()
      return
    }

    // Запускаем таймер игры только если нет принудительной паузы
    gameTimer = setTimeout(handleGameEnd, gameDuration)

    return () => {
      if (gameTimer) {
        clearTimeout(gameTimer)
        gameTimer = null
      }
      // Останавливаем цикл автожестов
      autoTrailActiveRef.current = false
      if (autoTrailTimerRef.current != null) {
        clearTimeout(autoTrailTimerRef.current)
        autoTrailTimerRef.current = null
      }
    }
  }, [gameDuration, onGameFinished, isForcePause, autoExitMs])

  /* ── взрыв бомб ─────────────────────────────────────────── */
  const explode = useCallback(
    (triggerId: string, x: number, y: number) => {
      if (gameEndedRef.current) return

      const rect = containerRef.current!.getBoundingClientRect()
      const impacted = itemsRef.current
        .filter((it) => it.type === 'bomb' && it.id !== triggerId)
        .filter((it) => {
          const ipx = rect.left + (it.left / 100) * rect.width
          const ipy = rect.top + (it.top / 100) * rect.height
          return Math.hypot(ipx - x, ipy - y) <= bombRadiusPx
        })
        .map((it) => it.id)

      if (!impacted.length) return

      setItems((cur) =>
        cur.map((x) =>
          impacted.includes(x.id)
            ? { ...x, isDisappearing: true, isManual: false }
            : x,
        ),
      )

      impacted.forEach((id) => {
        clearTimers(id)
        setTimeout(() => {
          setItems((cur) => {
            const old = cur.find((x) => x.id === id)
            if (!old) return cur

            takenCells.current.delete(old.cell)
            timersRef.current.delete(id)
            const survivors = cur.filter((x) => x.id !== id)

            if (gameEndedRef.current) return survivors
            if (survivors.filter((x) => x.type === 'bomb').length < bombCount) {
              const cell = pickSafeCell(survivors)
              if (cell !== null) {
                takenCells.current.add(cell)
                const repl = makeItem('bomb', cell)
                scheduleAuto(repl)
                return [...survivors, repl]
              }
            }
            return survivors
          })
        }, autoExitMs + autoSpawnDelayMs)
      })
    },
    [bombRadiusPx, bombCount, autoExitMs, autoSpawnDelayMs, scheduleAuto],
  )

  /* ── глобальный onMove ──────────────────────────────────── */
  useEffect(() => {
    const onMove = (e: TouchEvent | PointerEvent) => {
      if (!gameStartedRef.current || gameEndedRef.current || isForcePause)
        return

      e.preventDefault()
      const { clientX: x, clientY: y } =
        'touches' in e ? (e.touches[0] ?? { clientX: 0, clientY: 0 }) : e

      const hit = (
        document.elementFromPoint(x, y) as HTMLElement
      )?.closest<HTMLElement>('[data-id]')
      if (!hit) return

      const id = hit.dataset.id!
      const type = hit.dataset.type as ItemType

      onInteractionEnter?.({ item: type, posX: x, posY: y })

      /* бомба */
      if (type === 'bomb') {
        explode(id, x, y)

        if (!manualRem.current.has(id)) {
          manualRem.current.add(id)
          clearTimers(id)

          setItems((cur) =>
            cur.map((x) =>
              x.id === id ? { ...x, isDisappearing: true, isManual: true } : x,
            ),
          )

          setTimeout(() => {
            setItems((cur) => {
              const old = cur.find((x) => x.id === id)
              if (!old) return cur

              takenCells.current.delete(old.cell)
              timersRef.current.delete(old.id)
              const survivors = cur.filter((x) => x.id !== id)

              if (
                !gameEndedRef.current &&
                !isForcePause &&
                survivors.filter((x) => x.type === 'bomb').length < bombCount
              ) {
                const cell = pickSafeCell(survivors)
                if (cell !== null) {
                  takenCells.current.add(cell)
                  const repl = makeItem('bomb', cell)
                  scheduleAuto(repl)
                  return [...survivors, repl]
                }
              }
              return survivors
            })
            manualRem.current.delete(id)
          }, manualDelay + manualExitMs)
        }

        if (dotRef.current?.setWaveParams) {
          dotRef.current.setWaveParams({
            waveReach: waveReach,
            waveStrength: waveStrength,
            waveThickness: waveThickness,
            waveDuration: waveDuration,
            waveColor: waveColor,
          })
        }

        dotRef.current?.triggerWave({ x, y })
        hapticFeedback.notificationOccurred('error')
        return
      }

      /* time / x2 */
      if (!manualRem.current.has(id)) {
        manualRem.current.add(id)
        clearTimers(id)

        setItems((cur) =>
          cur.map((x) =>
            x.id === id ? { ...x, isDisappearing: true, isManual: true } : x,
          ),
        )

        setTimeout(() => {
          setItems((cur) => {
            const old = cur.find((x) => x.id === id)
            if (!old) return cur

            takenCells.current.delete(old.cell)
            timersRef.current.delete(old.id)
            const survivors = cur.filter((x) => x.id !== id)

            if (!gameEndedRef.current && !isForcePause) {
              const limit = old.type === 'time' ? timerCount : x2Count
              const current = survivors.filter(
                (x) => x.type === old.type,
              ).length
              if (current < limit) {
                const cell = pickSafeCell(survivors)
                if (cell !== null) {
                  takenCells.current.add(cell)
                  const repl = makeItem(old.type, cell)
                  scheduleAuto(repl)
                  return [...survivors, repl]
                }
              }
            }
            return survivors
          })
          manualRem.current.delete(id)
        }, manualDelay + manualExitMs)
      }

      if (type === 'time' && hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.impactOccurred(
          /Android/i.test(navigator.userAgent) ? 'heavy' : 'medium',
        )
      }
      if (type === 'x2' && hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success')
        dotRef.current?.triggerWave({ x, y })
        if (dotRef.current?.setWaveParams) {
          dotRef.current.setWaveParams({
            waveColor: '#B6FF00',
            waveStrength: 0.1,
            waveThickness: 0.1,
            waveDuration: 1,
            waveReach: 80,
          })
        }
        explode(id, x, y)
        setTrailLength(50)
      }
    }

    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('pointermove', onMove, { passive: false })
    return () => {
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('pointermove', onMove)
    }
  }, [
    onInteractionEnter,
    bombCount,
    timerCount,
    x2Count,
    manualDelay,
    manualExitMs,
    explode,
    scheduleAuto,
    isForcePause,
  ])

  /* ── JSX ───────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full',
        showPlayground && 'border-2 border-emerald-500 bg-emerald-500/10',
        className,
      )}
    >
      {/* точки-фон */}
      <DotPatternInteractive
        ref={dotRef}
        className="absolute inset-0 mask-[radial-gradient(ellipse_380px_350px_at_center,black,transparent)]"
        gap={patternGap}
        baseRadius={baseRadius}
        maxRadius={maxRadius}
        reach={reach}
        staticColor={'#414241'}
        activeColor={'#B6FF00'}
        trailing={!gameEnded} /* ← UI-флаг */
        trailLength={trailLength}
        minTrailLength={1}
        trailingLifetime={50}
        trailingRadius={trailingRadius}
        trailingColor={trailingColor}
        waveReach={waveReach}
        waveOnPointerUp={waveOnPointerUp}
        waveStrength={waveStrength}
        waveThickness={waveThickness}
        waveDuration={waveDuration}
        waveColor={waveColor}
        drawEffect={drawEffect}
        // onPointerUp={onPointerUp}
      />

      {/* айтемы */}
      {items.map((it) => {
        const Icon =
          it.type === 'bomb'
            ? BombIcon
            : it.type === 'time'
              ? WatchesIcon
              : X2Icon
        const label =
          it.type === 'bomb'
            ? '-10%'
            : it.type === 'time'
              ? `+${winAmount}`
              : 'x2'

        return (
          <div
            key={it.id}
            data-id={it.id}
            data-type={it.type}
            style={{
              top: `${it.top}%`,
              left: `${it.left}%`,
              transform: `rotate(${it.rot}deg)`,
            }}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700',
              it.isAppearing && 'animate-pop-in',
              it.isDisappearing && !it.isManual && 'scale-0',
              it.isDisappearing &&
                it.isManual &&
                'pointer-events-none opacity-0 scale-140',
            )}
            onAnimationEnd={(e) => {
              if (e.animationName === 'pop-in') {
                setItems((cur) =>
                  cur.map((x) =>
                    x.id === it.id ? { ...x, isAppearing: false } : x,
                  ),
                )
              }
            }}
          >
            {it.isDisappearing && it.isManual && (
              <span
                className={cn(
                  'font-pixel absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-2xl animate-[rise_2s_ease-out_forwards]',
                  it.type === 'bomb'
                    ? 'text-[#ef5252]'
                    : it.type === 'time'
                      ? 'text-[#b6ff00]'
                      : 'text-white',
                )}
              >
                {label}
              </span>
            )}
            <Icon className="w-14 h-14 animate-[tilt-pulse_1.2s_ease-in-out_infinite]" />
          </div>
        )
      })}

      {/* локальные анимации */}
      <style>{`
        @keyframes pop-in { from { transform: scale(0) } to { transform: scale(1) } }
        .animate-pop-in   { animation: pop-in ${autoExitMs}ms ease-out forwards; }

        @keyframes tilt-pulse {
          0%,100% { transform: translate(0) rotate(0) scale(1); }
          50%     { transform: translate(-30%) rotate(-15deg) scale(1.1); }
        }
        @keyframes rise {
          from { opacity:1; transform:translate(-50%,0)   scale(1); }
          to   { opacity:0; transform:translate(-50%,-40px) scale(1.2); }
        }
      `}</style>
    </div>
  )
}
