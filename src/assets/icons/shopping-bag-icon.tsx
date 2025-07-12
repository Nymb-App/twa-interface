export const ShoppingBagIcon = ({
    className,
    fill = 'none',
    stroke = '#B6FF00',
}: {
    className?: string,
    fill?: string,
    stroke?: string,
}) => {
    return (
        <svg
            className={className}
            width="20"
            height="23"
            viewBox="0 0 20 23"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 5.5H3.3789C2.32278 5.5 1.44868 6.32117 1.3828 7.37524L0.831993 16.1881C0.652088 19.0666 2.93815 21.5 5.82226 21.5H14.1777C17.0619 21.5 19.3479 19.0666 19.168 16.1881L18.6172 7.37524C18.5513 6.32117 17.6772 5.5 16.6211 5.5H14M6 5.5V5C6 2.79086 7.79086 1 10 1V1C12.2091 1 14 2.79086 14 5V5.5M6 5.5H14M6 9V10C6 12.2091 7.79086 14 10 14V14C12.2091 14 14 12.2091 14 10V9"
                stroke={stroke}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}
