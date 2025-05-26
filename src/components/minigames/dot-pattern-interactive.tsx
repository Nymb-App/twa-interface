import { cn } from "@/utils";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

/* --------------------------------------------------
 * 1. DotPatternInteractive — configurable canvas background
 *    (container‑aware ResizeObserver implementation)
 * -------------------------------------------------- */
export interface DotPatternHandle {
    triggerWave: (pointer: { x: number; y: number }) => void;
}
export interface DotPatternProps {
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
    drawEffect?: "normal" | "fish-eye" | "wave";
    waveOnPointerUp?: boolean;
    waveStrength?: number;
    waveThickness?: number;
    waveDuration?: number;
    waveReach?: number;
    waveColor?: string;
    className?: string;
    /** Новый пропс: сколько одновременных указателей разрешить */
    maxPointers?: number;
}

export const DotPatternInteractive = forwardRef(function (
    {
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
        minTrailLength = 1,
        trailingLifetime = 50,
        trailingRadius,
        trailingColor,
        trailingGradient,
        animate = "on-hover",
        drawEffect = "normal",
        waveOnPointerUp = true,
        waveStrength = 0.15,
        waveThickness = 0.3,
        waveDuration = 1,
        waveReach,
        waveColor,
        maxPointers = 1,          // по умолчанию — 1 указатель
    }: DotPatternProps,
    ref: Ref<DotPatternHandle>
) {
    const MAX_TOUCH_SUPPORT = 5; // внутренний абсолютный максимум

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dpr, setDpr] = useState(1);

    // Maps для работы с несколькими указателями
    const pointerMap = useRef<Map<number, { x: number; y: number }>>(new Map());
    const trailMap = useRef<Map<number, { x: number; y: number }[]>>(new Map());
    const lastMoveMap = useRef<Map<number, number>>(new Map());

    // Волны для эффекта "wave"
    const waves = useRef<{ x: number; y: number; start: number }[]>([]);
    const active = useRef<boolean>(animate === "on-hover");

    const lerpColor = useCallback((a: string, b: string, t: number) => {
        const ca = parseInt(a.slice(1), 16),
            cb = parseInt(b.slice(1), 16);
        const ar = (ca >> 16) & 255,
            ag = (ca >> 8) & 255,
            ab = ca & 255;
        const br = (cb >> 16) & 255,
            bg = (cb >> 8) & 255,
            bb = cb & 255;
        return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(
            ag + (bg - ag) * t
        )},${Math.round(ab + (bb - ab) * t)})`;
    }, []);

    // Рисование
    const draw = useCallback(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.filter = blur ? `blur(${blur * dpr}px)` : "none";

        const rBase = baseRadius * dpr;
        const rHover = maxRadius * dpr;
        const reachPx = reach * dpr;
        const waveReachPx = (waveReach ?? reach) * dpr;
        const now = Date.now();

        for (let yy = gap / 2; yy < cvs.height; yy += gap) {
            for (let xx = gap / 2; xx < cvs.width; xx += gap) {
                let r = rBase;
                let color = staticColor;
                let dx = 0, dy = 0;

                // Wave
                if (drawEffect === "wave") {
                    let waveDx = 0, waveDy = 0, blend = 0;
                    waves.current.forEach((w) => {
                        const dt = now - w.start;
                        const tTime = dt / (waveDuration * 1000);
                        if (tTime > 1) return;
                        const waveRadius = tTime * waveReachPx;
                        const dist = Math.hypot(xx - w.x, yy - w.y);
                        const diff = dist - waveRadius;
                        const widthPx = waveReachPx * waveThickness;
                        if (Math.abs(diff) <= widthPx) {
                            const amp = Math.exp(-(diff * diff) / (2 * widthPx * widthPx));
                            const ease = 1 - tTime;
                            const factor = waveReachPx * waveStrength;
                            waveDx += ((xx - w.x) / (dist || 1)) * amp * factor * ease;
                            waveDy += ((yy - w.y) / (dist || 1)) * amp * factor * ease;
                            blend = Math.max(blend, amp * ease);
                        }
                    });
                    if (blend > 0) {
                        dx = waveDx; dy = waveDy;
                        color = lerpColor(staticColor, waveColor ?? activeColor, blend);
                    }
                }

                // Fish-eye
                if (drawEffect === "fish-eye" && pointerMap.current.size === 0) {
                    const cx = cvs.width / 2, cy = cvs.height / 2;
                    const tLens = 1 - Math.hypot(xx - cx, yy - cy) / Math.hypot(cx, cy);
                    r *= 0.5 + 0.5 * tLens;
                    color = lerpColor("#000000", staticColor, 0.3 + 0.7 * tLens);
                }

                // Hover (максимальный t среди всех указателей)
                if (active.current && pointerMap.current.size > 0) {
                    let maxT = 0;
                    pointerMap.current.forEach((pos) => {
                        const d = Math.hypot(pos.x - xx, pos.y - yy);
                        if (d < reachPx) maxT = Math.max(maxT, 1 - d / reachPx);
                    });
                    if (maxT > 0) {
                        r = rBase + maxT * (rHover - rBase);
                        color = lerpColor(color, activeColor, maxT);
                    }
                }

                ctx.beginPath();
                ctx.arc(xx + dx, yy + dy, r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        // Trailing
        if (trailing) {
            ctx.filter = "none";
            ctx.lineCap = "round";
            const head = (trailingRadius ?? maxRadius) * dpr;
            trailMap.current.forEach((arr) => {
                if (arr.length < 2) return;
                for (let i = 0; i < arr.length - 1; i++) {
                    const p1 = arr[i], p2 = arr[i + 1];
                    const t = i / (arr.length - 1);
                    ctx.lineWidth = head * (1 - t);
                    ctx.strokeStyle = trailingGradient
                        ? lerpColor(trailingGradient.from, trailingGradient.to, t)
                        : trailingColor ?? activeColor;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        }
    }, [
        dpr, gap, baseRadius, maxRadius, reach, blur,
        staticColor, activeColor, drawEffect,
        trailing, trailingRadius, trailingColor, trailingGradient,
        waveStrength, waveThickness, waveDuration, waveReach, waveColor,
        lerpColor
    ]);

    // Wave loop
    const waveAnim = useRef<number | null>(null);
    const startWaveLoop = useCallback(() => {
        if (waveAnim.current == null) {
            const tick = () => {
                if (waves.current.length > 0) {
                    draw();
                    waveAnim.current = requestAnimationFrame(tick);
                } else {
                    cancelAnimationFrame(waveAnim.current!);
                    waveAnim.current = null;
                }
            };
            waveAnim.current = requestAnimationFrame(tick);
        }
    }, [draw]);

    // Resize
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const resize = () => {
            const scale = window.devicePixelRatio || 1;
            setDpr(scale);
            cvs.width = cvs.offsetWidth * scale;
            cvs.height = cvs.offsetHeight * scale;
            draw();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(cvs);
        return () => void ro.disconnect();
    }, [draw]);

    // Decay trailing
    useEffect(() => {
        if (!trailing) return;
        const tick = () => {
            const now = Date.now();
            trailMap.current.forEach((arr, id) => {
                const last = lastMoveMap.current.get(id) || 0;
                if (now - last > trailingLifetime && arr.length > minTrailLength) {
                    for (let i = 0; i < 5 && arr.length > minTrailLength; i++) {
                        arr.pop();
                    }
                }
                if (arr.length === 0) {
                    trailMap.current.delete(id);
                    lastMoveMap.current.delete(id);
                }
            });
            draw();
            requestAnimationFrame(tick);
        };
        const id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, [draw, trailing, minTrailLength, trailingLifetime]);

    // Pointer handlers
    useEffect(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;

        /* ➊  Если трейлинг выключен – вообще не вешаем pointer-слушатели */
        if (!trailing) {
            // но очистим всё, что было раньше
            pointerMap.current.clear();
            trailMap.current.clear();
            lastMoveMap.current.clear();
            draw();                 // перерисуем «чистый» фон
            return;                 // ⬅️   досрочный выход
        }

        const getPos = (e: PointerEvent) => {
            const rect = cvs.getBoundingClientRect();
            return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
        };

        const handleDown = (e: PointerEvent) => {
            const deviceMax = navigator.maxTouchPoints || 1;
            const allowed = Math.min(MAX_TOUCH_SUPPORT, deviceMax, maxPointers);
            if (pointerMap.current.size >= allowed) return;
            const pos = getPos(e);
            active.current = animate === "on-hover";
            pointerMap.current.set(e.pointerId, pos);
            trailMap.current.set(e.pointerId, [pos]);
            lastMoveMap.current.set(e.pointerId, Date.now());
            draw();
        };

        const handleMove = (e: PointerEvent) => {
            if (!pointerMap.current.has(e.pointerId)) return;
            const pos = getPos(e);
            pointerMap.current.set(e.pointerId, pos);
            lastMoveMap.current.set(e.pointerId, Date.now());
            const arr = trailMap.current.get(e.pointerId)!;
            arr.unshift(pos);
            if (arr.length > trailLength) arr.pop();
            draw();
        };

        const handleUp = (e: PointerEvent) => {
            if (drawEffect === "wave" && waveOnPointerUp) {
                const pos = getPos(e);
                waves.current.push({ x: pos.x, y: pos.y, start: Date.now() });
                startWaveLoop();
            }
            pointerMap.current.delete(e.pointerId);
            draw();
        };

        const handleCancel = (e: PointerEvent) => {
            pointerMap.current.delete(e.pointerId);
            trailMap.current.delete(e.pointerId);
            lastMoveMap.current.delete(e.pointerId);
            draw();
        };

        document.addEventListener("pointerdown", handleDown, { passive: false });
        document.addEventListener("pointermove", handleMove, { passive: false });
        document.addEventListener("pointerup", handleUp);
        document.addEventListener("pointercancel", handleCancel);
        return () => {
            document.removeEventListener("pointerdown", handleDown);
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleUp);
            document.removeEventListener("pointercancel", handleCancel);
            if (waveAnim.current != null) cancelAnimationFrame(waveAnim.current);
        };
    }, [
        dpr, draw, trailing, trailLength, minTrailLength, trailingLifetime,
        animate, drawEffect, waveOnPointerUp, startWaveLoop, maxPointers
    ]);

    useImperativeHandle(ref, () => ({
        triggerWave: ({ x, y }) => {
            const cvs = canvasRef.current;
            if (!cvs) return;
            const rect = cvs.getBoundingClientRect();
            const cx = (x - rect.left) * dpr;
            const cy = (y - rect.top) * dpr;
            waves.current.push({ x: cx, y: cy, start: Date.now() });
            startWaveLoop();
        },
    }), [startWaveLoop, dpr]);

    return (
        <canvas
            ref={canvasRef}
            style={{ touchAction: "none" }}
            className={cn("h-full w-full rounded-lg select-none", className)}
        />
    );
});