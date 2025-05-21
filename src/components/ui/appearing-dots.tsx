import { useEffect, useState } from "react";

export const TextWithAppearingDots = ({
    text,
    count = 3,
    className,
}: {
    text?: string,
    count?: number,
    className?: string,
}) => {
    const MIN = 2;
    const MAX = 6;
    const totalDots = Math.max(MIN, Math.min(count, MAX)) + 1;
    const [dotCount, setDotCount] = useState<number>(0);

    useEffect(() => {
        const id = setInterval(() => {
            setDotCount((d) => (d + 1) % totalDots)
        }, 300);
        return () => clearInterval(id);
    }, [
        count,
        text,
    ]);

    return (
        <span className={className}>
            {text + '.'.repeat(dotCount)}
        </span>
    );
}