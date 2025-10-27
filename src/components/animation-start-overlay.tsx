import { FlickeringGrid } from './magicui/flickering-grid'

interface AnimationStartOverlayProps {
  onStart: () => void
}

export function AnimationStartOverlay({ onStart }: AnimationStartOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#121312]">
      <FlickeringGrid
        className="absolute inset-0 -z-1 size-full left-3"
        squareSize={2}
        gridGap={12}
        color="#b7ff01"
        maxOpacity={0.5}
        flickerChance={0.3}
        width={450}
      />
      <button className="relative" type="button" onClick={onStart}>
        <span className="absolute -right-13 top-26 font-gochi">
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.4272 28.1363C29.1739 28.0147 29.7028 27.3343 29.5712 26.5892C28.3467 19.6565 22.1841 7.19641 5.14039 3.81099L9.39006 2.48118C9.99284 2.29256 10.3652 1.68941 10.2637 1.06601C10.1367 0.285609 9.33471 -0.189934 8.58902 0.0729769L1.46865 2.58344C0.709301 2.85116 0.156838 3.51228 0.028259 4.3071C-0.0892202 5.03332 0.164016 5.77019 0.703094 6.27077L5.6761 10.8886C6.09835 11.2807 6.73867 11.3203 7.20597 10.9831C7.79024 10.5615 7.87837 9.72569 7.39487 9.19154L4.74377 6.26277C10.8612 8.8879 21.7667 11.4902 26.7965 27.1179C27.0192 27.8098 27.7098 28.2531 28.4272 28.1363Z"
              fill="white"
            />
          </svg>
          <span className="text-[23px] leading-[96%]">
            <span className="text-[#B6FF00]">Tap</span> to
            <br />
            <span className="text-[#B6FF00]">start</span>
          </span>
        </span>
        <svg
          width="134"
          height="134"
          viewBox="0 0 134 134"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>
            {`
              @keyframes nymbPulseOuter {
                0%, 100% {
                  transform: scale(0.8);
                  opacity: 0.05;
                }
                50% {
                  transform: scale(0.9);
                  opacity: 0.1;
                }
              }

              @keyframes nymbPulseInner {
                0%, 100% {
                  transform: scale(0.9);
                  opacity: 0.1;
                }
                50% {
                  transform: scale(1);
                  opacity: 0.2;
                }
              }

              .nymb-shadow-layer {
                transform-box: fill-box;
                transform-origin: center;
                will-change: transform, opacity;
              }

              .nymb-shadow-layer--outer {
                animation: nymbPulseOuter 2.5s ease-in-out infinite;
                animation-delay: 0.6s;
              }

              .nymb-shadow-layer--inner {
                animation: nymbPulseInner 2.5s ease-in-out infinite;
              }
            `}
          </style>
          <path
            className="nymb-shadow-layer nymb-shadow-layer--outer"
            opacity="0.03"
            d="M0 67C0.552883 37.9736 0.829324 23.4605 8.98503 13.6628C10.3987 11.9645 11.9645 10.3987 13.6628 8.98503C23.4605 0.829324 37.9736 0.552883 67 0C96.0264 0.552883 110.54 0.829324 120.337 8.98503C122.036 10.3987 123.601 11.9645 125.015 13.6628C133.171 23.4605 133.447 37.9736 134 67C133.447 96.0264 133.171 110.54 125.015 120.337C123.601 122.036 122.036 123.601 120.337 125.015C110.54 133.171 96.0264 133.447 67 134C37.9736 133.447 23.4605 133.171 13.6628 125.015C11.9645 123.601 10.3987 122.036 8.98503 120.337C0.829324 110.54 0.552883 96.0264 0 67Z"
            fill="#B6FF00"
          />
          <path
            className="nymb-shadow-layer nymb-shadow-layer--inner"
            opacity="0.1"
            d="M16 67C16.4209 44.9053 16.6313 33.858 22.8393 26.4001C23.9154 25.1073 25.1073 23.9154 26.4001 22.8393C33.858 16.6313 44.9053 16.4209 67 16C89.0947 16.4209 100.142 16.6313 107.6 22.8393C108.893 23.9154 110.085 25.1073 111.161 26.4001C117.369 33.858 117.579 44.9053 118 67C117.579 89.0947 117.369 100.142 111.161 107.6C110.085 108.893 108.893 110.085 107.6 111.161C100.142 117.369 89.0947 117.579 67 118C44.9053 117.579 33.858 117.369 26.4001 111.161C25.1073 110.085 23.9154 108.893 22.8393 107.6C16.6313 100.142 16.4209 89.0947 16 67Z"
            fill="#B6FF00"
          />
          <path
            d="M67 28C83.8959 28.3218 92.3438 28.4831 98.0469 33.2305C99.0354 34.0533 99.9467 34.9646 100.77 35.9531C105.517 41.6562 105.678 50.1041 106 67C105.678 83.8959 105.517 92.3438 100.77 98.0469C99.9467 99.0354 99.0354 99.9467 98.0469 100.77C92.3438 105.517 83.8959 105.678 67 106C50.1041 105.678 41.6562 105.517 35.9531 100.77C34.9646 99.9467 34.0533 99.0354 33.2305 98.0469C28.4831 92.3438 28.3218 83.8959 28 67C28.3218 50.1041 28.4831 41.6562 33.2305 35.9531C34.0533 34.9646 34.9646 34.0533 35.9531 33.2305C41.6562 28.4831 50.1041 28.3218 67 28ZM68.6738 58.2256C64.3885 55.6217 62.2459 54.3197 60.623 55.2324C59.0002 56.1453 59 58.6525 59 63.667V70.6895C59 75.8342 58.9998 78.4071 60.6572 79.3125C62.3148 80.2178 64.4796 78.8267 68.8086 76.0459L74.4268 72.4375C78.2741 69.9661 80.1976 68.7302 80.1758 66.9658C80.1537 65.2012 78.2001 64.0133 74.292 61.6387L68.6738 58.2256Z"
            fill="#B6FF00"
          />
        </svg>
      </button>
      <div className="absolute size-full bg-gradient-to-b from-transparent from-50% to-[#121312] -z-1" />
      <div className="absolute size-full bg-gradient-to-b from-[#121312] to-transparent to-[50%] -z-1" />
      <div className="absolute size-full bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#121312_95%)] -z-1" />
    </div>
  )
}
