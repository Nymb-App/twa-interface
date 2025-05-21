import Marquee from 'react-fast-marquee'

const arrows = Array.from({ length: 60 })

const Arrow = () => (
  <svg
    width="6"
    height="9"
    viewBox="0 0 6 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.518233 1.31582C0.296715 0.98354 0.534911 0.538467 0.934259 0.538467H2.79815C3.1325 0.538467 3.44473 0.705569 3.6302 0.983767L5.6302 3.98377C5.85413 4.31967 5.85413 4.75727 5.6302 5.09317L3.6302 8.09317C3.44473 8.37137 3.1325 8.53847 2.79815 8.53847H0.934258C0.53491 8.53847 0.296715 8.09339 0.518233 7.76112L2.29687 5.09317C2.5208 4.75727 2.5208 4.31967 2.29687 3.98377L0.518233 1.31582Z"
      fill="#B6FF00"
    />
  </svg>
)

export const MarqueeArrows = () => {
  return (
    <div className="absolute bottom-[35px] w-full z-[-1]">
      <div className="relative min-w-[1600px]">
        <Marquee direction="right" speed={10}>
          {arrows.map((_, idx) => (
            <Arrow key={idx} />
          ))}
        </Marquee>
        <div
          className="top-[3px]
pointer-events-none
absolute inset-y-0 left-0
w-[250px] h-[4px]
z-0 bg-line-gradient
"
        />
        <div
          className="
pointer-events-none
absolute inset-y-0 left-0
w-[40px]
bg-[#121312] -z-[-1]
"
        />
      </div>
    </div>
  )
}

export default MarqueeArrows
