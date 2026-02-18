export default function EnergyIcon({ className }: { className?: string }) {
    return (
        <svg
            width="36"
            height="40"
            viewBox="0 0 36 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g filter="url(#filter0_di_4155_20426)">
                <path
                    d="M21.75 12.5H20.5V15H19.25V17.5H25.5V20H24.25V21.25H23V22.5H21.75V23.75H20.5V25H19.25V26.25H18V27.5H16.75V28.75H15.5V30H13V27.5H14.25V25H15.5V22.5H16.75V21.25H10.5V18.75H11.75V17.5H13V16.25H14.25V15H15.5V13.75H16.75V12.5H18V11.25H19.25V10H21.75V12.5Z"
                    fill="#C882FF"
                />
            </g>
            <defs>
                <filter
                    id="filter0_di_4155_20426"
                    x="0.5"
                    y="0"
                    width="35"
                    height="40"
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
                        values="0 0 0 0 0.611765 0 0 0 0 0.121569 0 0 0 0 0.992157 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_4155_20426"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4155_20426"
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
                        result="effect2_innerShadow_4155_20426"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.25" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.611765 0 0 0 0 0.121569 0 0 0 0 0.992157 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_4155_20426"
                    />
                </filter>
            </defs>
        </svg>
    )
}