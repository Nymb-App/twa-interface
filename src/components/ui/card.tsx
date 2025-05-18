import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Card({ className, children, ...props }: CardProps) {
    return (
        <div className="rounded-2xl w-full h-max p-[1px] overflow-hidden bg-gradient-to-b from-white/20 to-transparent">
            <div
                className={cn(
                    'rounded-2xl w-full h-full pb-5 bg-[#161715] relative overflow-hidden',
                    className,
                )}
                style={{
                    overflow: 'hidden',
                    borderRadius: '1rem',
                }}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}
