import { motion } from 'framer-motion'
import { useId } from 'react'
import { FlickeringGrid } from '../magicui/flickering-grid'
import { ElectricLines } from '../ui/electric-lines'
import { cn } from '@/utils'

export const BattleCard = ({
  showElectricsLines = true,
  nickname = 'unknown',
  isMe = true,
  areaClaimedPercent = 0,
  isFindingUser,
  isRow = false,
  isBgVisible = true,
  className,
  classNameBg,
}: {
  showElectricsLines?: boolean
  nickname?: string
  isMe?: boolean
  areaClaimedPercent?: number
  isFindingUser?: boolean
  isRow?: boolean
  isBgVisible?: boolean
  className?: string
  classNameBg?: string
}) => {
  return (
    <div
      className={cn(
        'relative font-pixel flex flex-col items-center uppercase overflow-hidden w-full h-[220px] bg-no-repeat bg-[length:100%_100%]',
        className,
      )}
    >
      <motion.div
        className="absolute w-full h-full z-0 !bg-[length:100%_100%]"
        style={{
          backgroundImage: isMe
            ? "url('/minigames/battle-header-bg.png')"
            : "url('/minigames/battle-opponent-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={false}
        animate={{ opacity: isBgVisible ? 1 : 0 }}
        transition={{ duration: 1.6, delay: 2 }}
      />

      <FlickeringGrid
        className={cn(
          'absolute w-full mask-[linear-gradient(to_right,transparent_5%,black_50%,transparent_95%)]',
          isMe && 'top-2',
          classNameBg,
        )}
        squareSize={2}
        gridGap={12}
        color={isMe ? '#b7ff01' : '#cdaff9'}
        maxOpacity={1}
        flickerChance={0.5}
        autoResize={false}
        width={450}
        height={500}
      />

      <SvgBgIos
        className={cn(
          'relative -top-1 w-full h-[180px] opacity-0 transition-all duration-900 delay-3000 z-10',
          isMe && 'top-1',
          !isBgVisible && 'opacity-100',
        )}
        classNameBg={cn(
          areaClaimedPercent > 0 && '!from-[#B6FF00]/20 !to-[#B6FF00]/20',
          areaClaimedPercent < 0 && '!from-[#8C35FB]/20 !to-[#8C35FB]/20',
        )}
        isMe={isMe}
      />

      {!isFindingUser ? (
        <BattleAvatarCard
          showElectricsLines={showElectricsLines}
          isMe={isMe}
          isRow={isRow}
          classNameContainer={cn(
            'absolute z-20',
            !isMe && 'bottom-9',
            isMe && 'flex-col-reverse top-10',
            isRow && 'flex-row',
            isMe && isRow && 'top-0',
            !isMe && isRow && 'bottom-0',
          )}
          className={cn(
            'rounded-[34px] size-[104px]',
            isMe && !isRow && 'shadow-[0px_0px_59.8px_#b7ff01]/50',
            !isMe && !isRow && 'shadow-[0px_0px_59.8px_#8C35FB]',
          )}
          nickName={nickname}
          src="/roulette-icons/default.png"
          label={nickname.slice(0, 2)}
        />
      ) : (
        <div className="absolute size-[104px] bottom-20 animate-battle-finding-dots-pulse">
          <div className="absolute bg-[#8c35fb66]/80 blur-[14px] rounded-[34px] size-full" />
          <p className="text-white text-[104px] text-center size-full leading-[100%]">
            :
          </p>
        </div>
      )}
    </div>
  )
}

const BattleAvatarCard = ({
  src,
  label,
  nickName,
  showElectricsLines = true,
  isMe = true,
  duration = 0.8,
  isRow = false,
  classNameContainer,
  className,
}: {
  src: string
  label: string
  showElectricsLines?: boolean
  isMe?: boolean
  nickName?: string
  duration?: number
  isRow?: boolean
  classNameContainer?: string
  className?: string
}) => {
  return (
    <motion.div
      layout
      className={cn(
        'flex flex-col gap-4 justify-center items-center w-full',
        isRow && 'flex-row gap-2 h-[52px]',
        classNameContainer,
      )}
      transition={{ duration: duration, ease: 'easeInOut' }}
    >
      <motion.div
        layout
        transition={{ duration: duration, ease: 'easeInOut' }}
        className={cn(
          'relative size-22 !rounded-full',
          isRow && '!size-8',
          className,
        )}
      >
        {isMe && showElectricsLines && (
          <ElectricLines
            className={cn(
              'absolute top-1/2 left-1/2 -translate-1/2 transition-all',
              isRow && 'hidden',
            )}
            accentColor="#B6FF00"
            svg1ClassName="top-[-70%] left-[105%]"
            svg2ClassName="top-[-40%] left-[-100%]"
            svg3ClassName="top-[55px] left-[-90px]"
            svg4ClassName="top-[105px] left-[60px]"
          />
        )}

        <img
          src={src}
          className={cn(
            'size-full object-cover shadow-lg rounded-[34px] z-1',
            // isRow && 'shadow-none',
          )}
        />
        <span
          className={cn(
            'absolute left-1/2 top-1/2 -translate-1/2 font-pixel text-2xl z-1',
            isRow && 'text-sm',
          )}
        >
          {label || 'NA'}
        </span>
      </motion.div>

      <motion.p
        layout
        transition={{ duration: duration, ease: 'easeInOut' }}
        className={cn('text-center max-w-[120px] truncate', isRow && 'text-sm')}
      >
        {nickName}
      </motion.p>
    </motion.div>
  )
}

const SvgBgIos = ({
  isMe = true,
  className,
  classNameBg,
}: {
  isMe?: boolean
  className?: string
  classNameBg?: string
}) => {
  const id = useId()

  return (
    <svg
      width="390"
      height="52"
      viewBox="0 0 390 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('relative z-1 w-full', isMe && 'rotate-180', className)}
    >
      <foreignObject x="-8" y="-8" width="406" height="68">
        <div
          className={cn(
            'bg-linear-to-b from-[#040619]/20 via-[#040619]/20',
            isMe ? 'to-[#B6FF00]/20' : 'to-[#8C35FB]/20',
            classNameBg,
          )}
          style={{
            backdropFilter: 'blur(4px)',
            clipPath: `url(#bg-blur-${id})`,
            height: '100%',
            width: '100%',
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="8">
        <path
          d="M0 0H390L370.29 42.7049C367.675 48.3713 362.003 52 355.763 52H34.2373C27.9965 52 22.3252 48.3713 19.71 42.7049L0 0Z"
          fill={`url(#paint0_linear_${id})`}
        />
        <path
          d="M389.218 0.5L369.836 42.4951C367.302 47.9844 361.808 51.5 355.763 51.5H34.2373C28.1915 51.5 22.6976 47.9844 20.1641 42.4951L0.782227 0.5H389.218Z"
          stroke={`url(#paint1_linear_${id})`}
          strokeOpacity="0.5"
        />
      </g>
      <defs>
        <clipPath id={`bg-blur-${id}`} transform="translate(8 8)">
          <path d="M0 0H390L370.29 42.7049C367.675 48.3713 362.003 52 355.763 52H34.2373C27.9965 52 22.3252 48.3713 19.71 42.7049L0 0Z" />
        </clipPath>
        <linearGradient
          id={`paint0_linear_${id}`}
          x1="195"
          y1="0"
          x2="195"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#040619" stopOpacity="1" />
          <stop offset="1" stopColor="#040619" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_${id}`}
          x1="195"
          y1="0"
          x2="195"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isMe ? '#B6FF00' : '#8C35FB'} stopOpacity="0" />
          <stop offset="1" stopColor={isMe ? '#B6FF00' : '#8C35FB'} />
        </linearGradient>
      </defs>
    </svg>
  )
}
