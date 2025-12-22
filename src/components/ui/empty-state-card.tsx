import { cn } from "@/lib/utils";

export const EmptyStateCard = ({
    title,
    description,
    className,
}: {
    title: string;
    description?: string;
    className?: string;
}) => {
    return (
        <div className={cn('w-full flex flex-col gap-4 items-center justify-center', className)}>
            {/* Blured Nymb Logo */}
            <div className='inline-flex items-center justify-center relative size-20 animate-pulse'>
                <div className='absolute inset-0 rounded-2xl bg-[#B6FF00]/10 blur-lg' />
                <span className='text-[#B6FF00] text-7xl font-pixel'>:</span>
            </div>

            <div className='text-center text-white font-pixel text-lg uppercase'>
                <span>{title}</span>
                <p>{description}</p>
            </div>
        </div>
    )
}