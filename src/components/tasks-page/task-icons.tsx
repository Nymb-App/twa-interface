export const TaskCompletedSvgIcon = ({
  fill,
  stroke,
  className,
}: {
  fill?: string
  stroke?: string
  className?: string
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill={fill || '#B6FF00'} />
    <path
      d="M7.7998 12.4L10.5998 15.2L16.1998 9.60001"
      stroke={stroke || '#121312'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
