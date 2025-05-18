import { useRive } from '@rive-app/react-canvas';
import { cn } from '@/utils';

export const BattleCard = ({
    title,
    description,
    subdescription,
    className,
    classNameBg,
}: {
    title: string
    description: string
    subdescription?: string
    className?: string
    classNameBg?: string
}) => {
    const { RiveComponent } = useRive({
        src: '/riveAnimations/battle-preview.riv',
        autoplay: true,
    });

    return (
        <div
            className={cn(
                'rounded-2xl w-full h-max p-[1.3px] overflow-hidden bg-gradient-to-b from-white/20 to-transparent relative',
            )}
        >
            <div
                className={cn(
                    'rounded-2xl w-full h-full pb-5 bg-[#161715] relative overflow-hidden',
                    className,
                )}
            >
                {classNameBg && (
                    <div className={cn(
                        'absolute left-1/2 -top-[30%] -translate-x-1/2 w-full h-full',
                        classNameBg
                    )} />
                )}
                {/* Dots pattern background */}
                <div className="w-full h-[160px] overflow-hidden relative [mask-image:radial-gradient(145px_circle_at_center,white,transparent)]">
                    <RiveComponent
                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%]'
                    />
                </div>
                {/* {classNameBg && (
                    <div
                        className={cn(
                            'absolute left-1/2 -top-[30%] -translate-x-1/2 w-full h-[50px] z-10',
                            classNameBg,
                        )}
                    />
                )} */}

                {/* Description section */}
                <div>
                    <h3 className="mt-3 text-center text-base font-semibold">{title}</h3>
                    <p className="mt-1 font-light text-xs text-white/50 text-center leading-3">
                        {description}
                    </p>
                    {subdescription && (
                        <p className="font-light text-xs text-white/50 text-center">
                            {subdescription}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
