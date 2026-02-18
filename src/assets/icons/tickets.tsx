export default function TicketsIcon({ className }: { className?: string }) {
    return (
        <svg
            width="36"
            height="37"
            viewBox="0 0 36 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g filter="url(#filter0_di_4725_851)">
                <path
                    d="M20.2637 10.8262L19.4365 11.2656L19.876 12.0918L20.3154 12.917L21.1416 12.4785L22.0205 14.1309L21.1943 14.5703L22.0723 16.2227L22.8994 15.7832L23.7773 17.4355L22.9512 17.874L23.3906 18.7002L24.2168 18.2627L25.0957 19.915L11.877 26.9434L10.998 25.291L11.8242 24.8516L11.3848 24.0254L9.62793 20.7207L8.80176 21.1602L7.92285 19.5078L8.74902 19.0684L7.87012 17.415L7.04395 17.8555L6.60449 17.0293L19.8242 10L20.2637 10.8262Z"
                    fill="#FBB107"
                />
                <path
                    d="M11.3848 24.0254L10.5586 24.4648L9.67969 22.8125L10.5059 22.373L11.3848 24.0254Z"
                    fill="#FBB107"
                />
                <path
                    d="M8.30957 18.2422L7.4834 18.6816L7.04395 17.8555L7.87012 17.415L8.30957 18.2422Z"
                    fill="#FBB107"
                />
                <path
                    d="M20.7021 11.6523L19.876 12.0918L19.4365 11.2656L20.2637 10.8262L20.7021 11.6523Z"
                    fill="#FBB107"
                />
            </g>
            <rect
                x="15.9033"
                y="20.5636"
                width="2.80719"
                height="0.935728"
                transform="rotate(-28 15.9033 20.5636)"
                fill="#121312"
            />
            <rect
                x="13.7065"
                y="16.4325"
                width="2.80719"
                height="0.935728"
                transform="rotate(-28 13.7065 16.4325)"
                fill="#121312"
            />
            <rect
                x="17.9419"
                y="18.4188"
                width="0.935728"
                height="0.935728"
                transform="rotate(-28 17.9419 18.4188)"
                fill="#121312"
            />
            <rect
                x="16.6768"
                y="18.0321"
                width="0.935728"
                height="0.935728"
                transform="rotate(-28 16.6768 18.0321)"
                fill="#121312"
            />
            <rect
                x="13.3193"
                y="17.6976"
                width="0.935728"
                height="3.74291"
                transform="rotate(-28 13.3193 17.6976)"
                fill="#121312"
            />
            <defs>
                <filter
                    id="filter0_di_4725_851"
                    x="-3.39551"
                    y="0"
                    width="38.4912"
                    height="36.9434"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.984314 0 0 0 0 0.694118 0 0 0 0 0.027451 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_4725_851"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4725_851"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feMorphology
                        radius="0.833333"
                        operator="erode"
                        in="SourceAlpha"
                        result="effect2_innerShadow_4725_851"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.25" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.932993 0 0 0 0 0.528696 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_4725_851"
                    />
                </filter>
            </defs>
        </svg>
    )
}
