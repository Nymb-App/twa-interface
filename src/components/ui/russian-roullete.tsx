// components/PrizeRoulette.tsx  — winner-zoom edition
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
    type CSSProperties,
} from "react";
import { cn } from "@/utils";

/* ──────────────────── props ───────────────────── */
export interface PrizeRouletteProps {
    items: ReactNode[];
    winnerIndex: number;              // 0-based
    isStartRoulette?: boolean;        // true → крутится
    duration?: number;                // ≥ 3000 (default 4000)
    loops?: number;                   // min кругов (default 5)
    gap?: number;                     // px между карточками (default 0)
    winnerScale?: number;             // во сколько увеличить победителя (default 1.4)
    className?: string;
    onFinish?: () => void;
}

/* ───────────────── component ──────────────────── */
export function RussianRoulette({
    items,
    winnerIndex,
    isStartRoulette = true,
    duration = 4000,
    loops = 5,
    gap = 0,
    winnerScale = 1.4,
    className,
    onFinish,
}: PrizeRouletteProps) {
    if (items.length < 4) throw new Error("Roulette needs at least 4 items");
    if (winnerIndex < 0 || winnerIndex >= items.length)
        throw new Error("winnerIndex out of range");
    if (duration < 3000) duration = 3000;
    if (loops < 1) loops = 1;

    /* refs / state */
    const reelRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);        // 1-я карточка
    const winRef = useRef<HTMLDivElement>(null);        // финальная карточка
    const started = useRef(false);                       // чтобы не стартовать 2×
    const [sizes, setSizes] =
        useState<null | { card: number; viewport: number }>(null);

    /* 1. измеряем карточку + viewport */
    useLayoutEffect(() => {
        if (!reelRef.current || !cardRef.current) return;

        const measure = () => {
            const card = cardRef.current!.getBoundingClientRect().width;   // без gap
            const viewport = reelRef.current!.parentElement!.getBoundingClientRect().width;
            if (card && viewport) setSizes({ card, viewport });
        };
        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(cardRef.current);
        ro.observe(reelRef.current.parentElement!);
        return () => ro.disconnect();
    }, []);

    /* 2. запуск / сброс анимации */
    useEffect(() => {
        if (!sizes) return;
        const { card, viewport } = sizes;
        const step = card + gap;
        const reel = reelRef.current!;

        /* стоп - если isStartRoulette = false */
        if (!isStartRoulette) {
            reel.style.transition = "none";
            reel.style.transform = "translateX(0)";
            winRef.current?.classList.remove("roulette-winner");
            started.current = false;
            return;
        }
        if (started.current) return;                       // уже запущено

        const totalIdx = loops * items.length + winnerIndex;
        const offset = totalIdx * step + card / 2 - viewport / 2;

        reel.style.transition = "none";
        reel.style.transform = "translateX(0)";

        /* запуск на след. кадре */
        requestAnimationFrame(() => {
            reel.style.transition =
                `transform ${duration}ms cubic-bezier(.1,.8,.2,1)`;
            reel.style.transform = `translateX(-${offset}px)`;
            started.current = true;
        });

        const done = () => {
            started.current = false;
            /* выделяем победителя */
            winRef.current?.classList.add("roulette-winner");
            onFinish?.();
        };
        reel.addEventListener("transitionend", done, { once: true });
        return () => reel.removeEventListener("transitionend", done);
    }, [
        sizes,
        isStartRoulette,
        loops,
        winnerIndex,
        items.length,
        gap,
        duration,
        onFinish,
    ]);

    /* 3. дублируем массив столько раз, чтобы лента не заканчивалась */
    let copies = loops + 1;
    let winnerGlobalIdx = loops * items.length + winnerIndex;  // по умолчанию
    if (sizes) {
        const { card, viewport } = sizes;
        const step = card + gap;
        const offset =
            loops * items.length * step + winnerIndex * step + card / 2 - viewport / 2;
        const chunk = items.length * step;
        copies = Math.ceil((offset + viewport) / chunk) + 1;
        winnerGlobalIdx = loops * items.length + winnerIndex; // индекс в «loops»-копии
    }
    const extended = Array.from({ length: copies }, () => items).flat();

    /* JSX */
    return (
        <div
            className={cn("relative w-full", className)}
            style={{ "--gap": `${gap}px` } as CSSProperties}
        >
            <div
                ref={reelRef}
                className="flex items-center"
                style={{ gap, transform: "translateX(0)" }}
            >
                {extended.map((node, i) => (
                    <div
                        key={i}
                        ref={
                            i === 0 ? cardRef :
                                i === winnerGlobalIdx ? winRef : undefined
                        }
                        className="shrink-0 flex justify-center items-center"
                    >
                        {node}
                    </div>
                ))}
            </div>

            {/* затемняем бока (опционально) */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#151317] via-transparent to-[#151317]" />

            {/* локальный CSS */}
            <style>
                {`
                    .roulette-winner {
                        z-index: 10;
                        transition: transform 350ms ease;
                        transform: scale(${winnerScale});
                    }
                `}
            </style>
        </div>
    );
}
