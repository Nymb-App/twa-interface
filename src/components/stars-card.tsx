import { useEffect, useMemo } from "react"
import { Link as ScrollLink } from "react-scroll"
import useSound from "use-sound"

import { useAccountMe } from "@/hooks/api/use-account"
import { TaskNames, useTasks } from "@/hooks/api/use-tasks"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export function StarsCard({
    linkTo,
    isPageLink = false,
    actionTitle = "JOIN US",
    className,
    classNameInnerContainer,
    classNameStar0,
    classNameStar1,
    classNameStar2,
    classNameStar3,
    classNameTitle,
    classNameDescription0,
    classNameDescription1,
    classNameAction,
}: {
    linkTo?: string,
    isPageLink?: boolean,
    actionTitle?: string,
    className?: string,
    classNameInnerContainer?: string,
    classNameStar0?: string,
    classNameStar1?: string,
    classNameStar2?: string,
    classNameStar3?: string,
    classNameTitle?: string,
    classNameDescription0?: string,
    classNameDescription1?: string,
    classNameAction?: string,
}) {
    const { tasksQuery } = useTasks()
    const { accountQuery } = useAccountMe()
    const [play, { stop }] = useSound('/sounds/Button.aac')

    const isCompletedTaskTwitter = useMemo(() => {
        return tasksQuery.data?.some(
            (task) => task.name === TaskNames.SubscribeTwitter && task.isCompleted,
        )
    }, [tasksQuery.data])

    const isSubscribedTelegram = useMemo(() => {
        return accountQuery.data?.isSubscribed
    }, [accountQuery])

    useEffect(() => {
        return () => stop()
    }, [play])

    return (
        <div
            className={cn(
                'w-full p-px bg-linear-to-b from-white/20 to-transparent rounded-2xl',
                className,
            )}
        >
            <div className={cn('flex flex-col items-center relative size-full rounded-2xl bg-[url("/index-page/stars-bg.png"),linear-gradient(#161715,#161715)] bg-cover bg-top px-4 pb-5', classNameInnerContainer)}>
                <div className="absolute left-1/2 -translate-x-1/2 -top-10 inline-flex h-[88px] w-full justify-center">
                    <img
                        src="/index-page/star-left.png"
                        alt="Stars"
                        className={cn("w-20 h-full object-cover mt-3", classNameStar0)}
                    />
                    <img
                        src="/index-page/star-center.png"
                        alt="Stars"
                        className={cn("w-[92px] h-full object-cover", classNameStar1)}
                    />
                    <img
                        src="/index-page/star-right.png"
                        alt="Stars"
                        className={cn("w-[78px] h-full object-cover mt-4", classNameStar2)}
                    />
                </div>

                <span className={cn("text-[54px] font-pixel mt-14 text-[#FFD930] [text-shadow:0px_3.65px_63.05px_#FFD13D]", classNameTitle)}>
                    1,000,000
                </span>

                <p className={cn("text-center text-white font-pixel text-lg uppercase mt-1", classNameDescription0)}>
                    Stars Giveaway
                </p>
                <p className={cn("text-center text-xs text-white/40 font-inter font-light", classNameDescription1)}>
                    The giveaway is happening at launch.
                </p>

                <div className={cn("absolute left-1/2 -translate-x-1/2 -bottom-3.5 inline-flex h-[88px] w-[86%] justify-between", classNameStar3)}>
                    <img
                        src="/index-page/star-bottom-left.png"
                        alt="Stars"
                        className="w-[82px] h-full object-cover"
                    />
                    <img
                        src="/index-page/star-bottom-right.png"
                        alt="Stars"
                        className="w-[82px] h-full object-cover"
                    />
                </div>
                {isPageLink && linkTo ? 
                    (
                        <Link
                            className={cn("relative text-black bg-linear-to-b from-[#FFD930] to-[#FFDE4D] px-7 py-2.5 rounded-xl font-pixel text-sm mt-4 transition-transform duration-200 cursor-pointer", classNameAction)}
                            to={linkTo || "/join-us"}
                            onClick={() => play()}
                        >
                            {actionTitle}
                        </Link>
                    )
                    : isCompletedTaskTwitter && isSubscribedTelegram ? (
                        <p className={cn("relative -top-2.5 uppercase text-[#FFD930] text-sm font-pixel mt-9", classNameAction)}>
                            already joined
                        </p>
                    ) : (
                        <ScrollLink
                            onClick={() => play()}
                            to={linkTo || "mintSection"}
                            smooth={true}
                            duration={500}
                            offset={-50} // Optional offset
                            className={cn("relative text-black bg-linear-to-b from-[#FFD930] to-[#FFDE4D] px-7 py-2.5 rounded-xl font-pixel text-sm mt-4 transition-transform duration-200 cursor-pointer", classNameAction)}
                        >
                            {actionTitle}
                        </ScrollLink>
                    )
                }
            </div>
        </div>
    )
}