import { useId } from 'react'

export const TextInnerStroke = ({
  text,
  strokeWidth = 3,
  strokeColor = '#00E0FF',
  fillColor = '#FFFFFF',
  className,
  classNameContainer,
  viewBox = '',
}: {
  text: string | number
  strokeWidth?: number
  fillColor?: string
  strokeColor?: string
  className?: string
  classNameContainer?: string
  viewBox?: string
}) => {
  const fid = useId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      viewBox={viewBox}
      className={classNameContainer}
    >
      <defs>
        <filter
          id={`${fid}`}
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feMorphology
            in="SourceGraphic"
            operator="erode"
            radius={strokeWidth}
            result="ERODED"
          />

          <feComposite
            in="SourceGraphic"
            in2="ERODED"
            operator="out"
            result="INNER_STROKE"
          />

          <feFlood flood-color={strokeColor} result="STROKE_COLOR" />
          <feComposite
            in="STROKE_COLOR"
            in2="INNER_STROKE"
            operator="in"
            result="COLORED_STROKE"
          />

          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="COLORED_STROKE" />
          </feMerge>
        </filter>
      </defs>

      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill={fillColor}
        filter={`url(#${fid})`}
        className={className}
      >
        {text}
      </text>
    </svg>
  )
}
