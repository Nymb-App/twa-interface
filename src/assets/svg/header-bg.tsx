export default function HeaderBg({
    className,
}: {
    className?: string
}) {
    return (
        <svg
            width="390"
            height="56"
            viewBox="0 0 390 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <foreignObject x="-8" y="-8" width="406" height="72">
                <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="w-full h-full backdrop-blur-sm [clip-path:url(#bgblur_0_51_31625_clip_path)]"
                ></div>
            </foreignObject>
            <path
                data-figma-bg-blur-radius="8"
                d="M389.241 0.5L369.696 46.1055C367.254 51.8046 361.65 55.5 355.449 55.5H34.5508C28.544 55.5 23.0971 52.032 20.542 46.6338L20.3037 46.1055L0.758789 0.5H389.241Z"
                fill="url(#paint0_linear_51_31625)"
                stroke="url(#paint1_linear_51_31625)"
            />
            <defs>
                <clipPath id="bgblur_0_51_31625_clip_path" transform="translate(8 8)">
                    <path d="M389.241 0.5L369.696 46.1055C367.254 51.8046 361.65 55.5 355.449 55.5H34.5508C28.544 55.5 23.0971 52.032 20.542 46.6338L20.3037 46.1055L0.758789 0.5H389.241Z" />
                </clipPath>
                <linearGradient
                    id="paint0_linear_51_31625"
                    x1="195"
                    y1="0"
                    x2="195"
                    y2="56"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="white" stop-opacity="0" />
                    <stop offset="1" stop-color="white" stop-opacity="0.04" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_51_31625"
                    x1="195"
                    y1="0"
                    x2="195"
                    y2="56"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="white" stop-opacity="0" />
                    <stop offset="1" stop-color="white" stop-opacity="0.12" />
                </linearGradient>
            </defs>
        </svg>
    )
}
