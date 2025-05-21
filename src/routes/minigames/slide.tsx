import { WatchesIcon } from '@/assets/icons/watches';
import EnergyIcon from '@/assets/icons/energy';
import HeaderBg from '@/assets/svg/header-bg';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';
import { BombIcon } from '@/assets/icons/bomb';
import { hapticFeedback } from '@telegram-apps/sdk';
import { isAndroid } from 'react-device-detect'

export const Route = createFileRoute('/minigames/slide')({
    component: RouteComponent,
})


function RouteComponent() {
    return (
        <div className="w-full max-w-[450px] min-h-screen mx-auto bg-[#121312] overflow-x-hidden flex flex-col justify-end">
            <div className='relative w-full min-h-[calc(100vh-80px)] overflow-hidden'>
                <header className='relative z-10 inline-flex items-center justify-around w-full h-16'>
                    <HeaderBg className='absolute w-[110%] h-17' />

                    <div className='relative flex items-center justify-between w-full h-full px-4'>
                        <div className='inline-flex items-center justify-center w-1/3'>
                            <EnergyIcon />
                            <span className='font-pixel text-xl text-[#B6FF00]'>1200</span>
                        </div>

                        <div className='w-0.5 h-full bg-gradient-to-b from-transparent from-20% via-white/20 to-transparent to-80%' />

                        <Countdown
                            date={Date.now() + 30000}
                            intervalDelay={1000}
                            precision={0}
                            renderer={renderer}
                            onComplete={() => {
                                // setIsFinished(true);
                            }}
                        />

                        <div className='w-0.5 h-full bg-gradient-to-b from-transparent from-20% via-white/20 to-transparent to-80%' />

                        <div className='inline-flex items-center justify-center w-1/3'>
                            <WatchesIcon className='size-9' />
                            <span className='font-pixel text-2xl text-[#B6FF00] [text-shadow:0px_0px_20px_rgba(182,255,0,1)]'>0</span>
                        </div>
                    </div>
                </header>


                <div className='w-full h-[calc(100%-60px)] absolute bottom-0'>
                    <DotPatternInteractive
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-full duration-500 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)]"
                        gap={40}
                        baseRadius={2}
                        maxRadius={4}
                        reach={80}
                        blur={0}
                        staticColor="#969695"
                        activeColor="#B6FF00"
                        trailing
                        trailLength={20}
                        minTrailLength={1}
                        trailingLifetime={100}
                        trailingRadius={8}
                        trailingColor="#B6FF00"
                    />
                    <div
                        className="absolute inset-0 bg-[#121312] pointer-events-none mask-[radial-gradient(ellipse_200px_400px_at_center,transparent,black)]"
                    />
                    <BombField
                        thresholdPercent={100}
                    />
                </div>
            </div>
        </div>
    );
}

const renderer = ({
    seconds,
    completed
}: {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    completed: boolean,
}) => {
    if (completed) {
        return (
            <div className='inline-flex items-center justify-center w-1/3'>
                <span className='font-pixel text-base text-white'>00</span>
                <span className='font-pixel text-base text-white'>:</span>
                <span className='font-pixel text-base text-white'>00</span>
            </div>
        );
    } else {
        return (
            <div className='inline-flex items-center justify-center w-1/3'>
                <span className='font-pixel text-base text-white'>00</span>
                <span className='font-pixel text-base text-white'>:</span>
                <span className='font-pixel text-base text-white'>{seconds > 9 ? seconds : `0${seconds}`}</span>
            </div>
        );
    }
};

// BombField.tsx  ------------------------------------------------------------

type Item = {
    id: string
    type: 'bomb' | 'time'
    top: number
    left: number
    rot: number
}

const GRID = 10
const NUM_BOMBS = 4
const NUM_TIMERS = 18

export default function BombField({ thresholdPercent = 80 }: { thresholdPercent?: number }) {
    const [removed, setRemoved] = useState<Set<string>>(new Set())

    // Функция для генерации нового набора items
    const generateItems = useCallback((): Item[] => {
        const taken = new Set<number>()
        const randCell = () => {
            let c: number
            do c = Math.floor(Math.random() * GRID * GRID)
            while (taken.has(c))
            taken.add(c)
            return c
        }
        const makeItem = (type: 'bomb' | 'time'): Item => {
            const cell = randCell()
            const row = Math.floor(cell / GRID)
            const col = cell % GRID
            return {
                id: crypto.randomUUID(),
                type,
                top: 5 + row * (90 / (GRID - 1)),
                left: 5 + col * (90 / (GRID - 1)),
                rot: Math.random() * 360,
            }
        }

        return [
            ...Array.from({ length: NUM_BOMBS }, () => makeItem('bomb')),
            ...Array.from({ length: NUM_TIMERS }, () => makeItem('time')),
        ]
    }, [])

    // items теперь в state, генерируются единожды и при условиях
    const [items, setItems] = useState<Item[]>(() => generateItems())

    const handleHit = useCallback((id: string) => {
        setRemoved(prev => new Set(prev).add(id))
    }, [])

    // Проверка порога удаления 'time' элементов
    useEffect(() => {
        const removedTimes = items.filter(i => i.type === 'time' && removed.has(i.id)).length
        const thresholdCount = Math.ceil(NUM_TIMERS * (thresholdPercent / 100))

        if (removedTimes >= thresholdCount) {
            setRemoved(new Set())
            setItems(generateItems())
        }
    }, [removed, items, generateItems, thresholdPercent])

    // Глобальный обработчик движения (тач/курсоры)
    useEffect(() => {
        const onMove = (e: TouchEvent | PointerEvent) => {
            e.preventDefault()
            let x: number, y: number
            if ('touches' in e) {
                if (!e.touches.length) return
                x = e.touches[0].clientX
                y = e.touches[0].clientY
            } else {
                x = e.clientX
                y = e.clientY
            }
            const el = document.elementFromPoint(x, y) as HTMLElement | null
            if (!el) return
            const hit = el.closest<HTMLElement>('[data-id]')
            if (!hit) return
            const id = hit.dataset.id!
            if (!removed.has(id)) handleHit(id)

            const type = hit.dataset.type as 'bomb' | 'time'

            // Haptic feedback
            if(type === 'bomb') {
                if (type === 'bomb') {
                    hapticFeedback.notificationOccurred('error');
                }
            } else {
                if (hapticFeedback.impactOccurred.isAvailable()) {
                    hapticFeedback.impactOccurred(isAndroid ? 'heavy' :'medium');
                }
            }
        }

        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('pointermove', onMove, { passive: false })
        return () => {
            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('pointermove', onMove)
        }
    }, [
        handleHit,
        removed,
        isAndroid,
        hapticFeedback,
    ])

    return (
        <>
            {items.map(item => {
                const gone = removed.has(item.id)
                const Icon = item.type === 'bomb' ? BombIcon : WatchesIcon
                const label = item.type === 'bomb' ? '-10%' : '+2'

                return (
                    <div
                        key={item.id}
                        data-id={item.id}
                        data-type={item.type}
                        style={{ top: `${item.top}%`, left: `${item.left}%` }}
                        className={cn(
                            'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700',
                            gone && 'pointer-events-none opacity-0 scale-140'
                        )}
                    >
                        {gone && (
                            <span className={cn("font-pixel absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-2xl animate-[rise_2s_ease-out_forwards]", item.type === 'bomb' ? 'text-[#ef5252]' : 'text-[#b6ff00]')}>
                                {label}
                            </span>
                        )}
                        <Icon
                            className="size-14"
                            style={{ rotate: `${item.rot}deg` }}
                        />
                    </div>
                )
            })}

            <style jsx>
                {`
                    @keyframes rise {
                        from {
                        opacity: 1;
                        transform: translate(-50%, 0) scale(1);
                        }
                        to {
                        opacity: 0;
                        transform: translate(-50%, -40px) scale(1.2);
                        }
                    }
                    .scale-140 {
                        transform: translate(-50%, -50%) scale(1.4);
                    }
                `}
            </style>
        </>
    )
}


/* --------------------------------------------------
 * 1. DotPatternInteractive — configurable canvas background
 *    (container‑aware ResizeObserver implementation)
 * -------------------------------------------------- */
interface DotPatternProps {
    gap?: number;
    baseRadius?: number;
    maxRadius?: number;
    reach?: number;
    blur?: number;
    staticColor?: string;
    activeColor?: string;
    trailing?: boolean;
    trailLength?: number;
    minTrailLength?: number;
    trailingLifetime?: number;
    trailingRadius?: number;
    trailingColor?: string;
    trailingGradient?: { from: string; to: string };
    animate?: "on-hover" | "on-action";
    drawEffect?: "normal" | "fish-eye";
    className?: string;
}

function DotPatternInteractive({
    className,
    gap = 40,
    baseRadius = 2,
    maxRadius = 6,
    reach = 150,
    blur = 0,
    staticColor = "#64748b",
    activeColor = "#38bdf8",
    trailing = false,
    trailLength = 20,
    minTrailLength = 4,
    trailingLifetime = 50,
    trailingRadius,
    trailingColor,
    trailingGradient,
    animate = "on-hover",
    drawEffect = "normal",
}: DotPatternProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dpr, setDpr] = useState(1);
    const trail = useRef<{ x: number; y: number }[]>([]);
    const lastMove = useRef(Date.now());
    const active = useRef(animate === "on-hover");

    /* ---------- helpers ---------- */
    const lerpColor = (a: string, b: string, t: number) => {
        const ca = parseInt(a.slice(1), 16);
        const cb = parseInt(b.slice(1), 16);
        const ar = (ca >> 16) & 255,
            ag = (ca >> 8) & 255,
            ab = ca & 255;
        const br = (cb >> 16) & 255,
            bg = (cb >> 8) & 255,
            bb = cb & 255;
        return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(
            ag + (bg - ag) * t
        )},${Math.round(ab + (bb - ab) * t)})`;
    };


    /* ---------- draw ---------- */
    const draw = useCallback(
        (pointer?: { x: number; y: number }) => {
            const cvs = canvasRef.current;
            if (!cvs) return;
            const ctx = cvs.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.filter = blur ? `blur(${blur * dpr}px)` : "none";

            const rBase = baseRadius * dpr;
            const rHover = maxRadius * dpr;
            const reachPx = reach * dpr;

            for (let y = gap / 2; y < cvs.height; y += gap) {
                for (let x = gap / 2; x < cvs.width; x += gap) {
                    let r = rBase;
                    let color = staticColor;

                    // fish‑eye only when idle
                    if (!pointer && drawEffect === "fish-eye") {
                        const cx = cvs.width / 2;
                        const cy = cvs.height / 2;
                        const tLens = 1 - Math.hypot(x - cx, y - cy) / Math.hypot(cx, cy);
                        r *= 0.5 + 0.5 * tLens;
                        color = lerpColor("#000000", staticColor, 0.3 + 0.7 * tLens);
                    }

                    // hover interaction
                    if (pointer) {
                        const d = Math.hypot(pointer.x - x, pointer.y - y);
                        if (d < reachPx) {
                            const t = 1 - d / reachPx;
                            r = rBase + t * (rHover - rBase);
                            color = lerpColor(color, activeColor, t);
                        }
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }

            /* trail */
            if (trailing && trail.current.length > 1) {
                ctx.filter = "none";
                ctx.lineCap = "round";
                const head = (trailingRadius ?? maxRadius) * dpr;
                for (let i = 0; i < trail.current.length - 1; i++) {
                    const p1 = trail.current[i];
                    const p2 = trail.current[i + 1];
                    const t = i / (trail.current.length - 1);
                    ctx.lineWidth = head * (1 - t);
                    ctx.strokeStyle = trailingGradient
                        ? lerpColor(trailingGradient.from, trailingGradient.to, t)
                        : trailingColor ?? activeColor;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        },
        [dpr, gap, baseRadius, maxRadius, reach, blur, staticColor, activeColor, drawEffect, trailing, trailingRadius, trailingColor, trailingGradient]
    );

    /* ---------- resize (container) ---------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
            const scale = window.devicePixelRatio || 1;
            setDpr(scale);
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            draw();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        return () => ro.disconnect();
    }, [draw]);

    /* ---------- decay ---------- */
    useEffect(() => {
        if (!trailing) return;
        const tick = () => {
            if (Date.now() - lastMove.current > trailingLifetime && trail.current.length > minTrailLength) {
                trail.current.pop();
                draw(trail.current[0]);
            }
            requestAnimationFrame(tick);
        };
        const id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, [draw, trailing, minTrailLength, trailingLifetime]);

    /* ---------- pointer events ---------- */
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const getPos = (e: PointerEvent) => {
            const rect = cvs.getBoundingClientRect();
            return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
        };
        const move = (e: PointerEvent) => {
            if (!active.current) return;
            const pos = getPos(e);
            lastMove.current = Date.now();
            if (trailing) {
                trail.current.unshift(pos);
                if (trail.current.length > trailLength) trail.current.pop();
            }
            draw(pos);
        };
        const down = (e: PointerEvent) => {
            if (animate === "on-action") {
                active.current = true;
                trail.current = [getPos(e)];
            }
        };
        const clear = () => {
            active.current = animate === "on-hover";
            trail.current = [];
            draw();
        };
        cvs.addEventListener("pointermove", move);
        cvs.addEventListener("pointerdown", down);
        cvs.addEventListener("pointerup", clear);
        cvs.addEventListener("pointerleave", clear);
        cvs.addEventListener("pointercancel", clear);
        return () => {
            cvs.removeEventListener("pointermove", move);
            cvs.removeEventListener("pointerdown", down);
            cvs.removeEventListener("pointerup", clear);
            cvs.removeEventListener("pointerleave", clear);
            cvs.removeEventListener("pointercancel", clear);
        };
    }, [dpr, draw, trailing, trailLength, animate]);

    return (
        <canvas
            ref={canvasRef}
            style={{ touchAction: "none" }}
            className={cn("h-64 w-full rounded-lg select-none", className)}
        />
    );
}
