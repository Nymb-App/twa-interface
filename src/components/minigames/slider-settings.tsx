import { cn } from '@/lib/utils'
import { useState } from 'react'

// interface SettingsPanelProps {
//   // Field & dot–pattern
//   gridGap: number;
//   setGridGap: (v: number) => void;
//   thresholdPercent: number;
//   setThresholdPercent: (v: number) => void;
//   baseRadius: number;
//   setBaseRadius: (v: number) => void;
//   maxRadius: number;
//   setMaxRadius: (v: number) => void;
//   reach: number;
//   setReach: (v: number) => void;
//   blur: number;
//   setBlur: (v: number) => void;
//   staticColor: string;
//   setStaticColor: (v: string) => void;
//   activeColor: string;
//   setActiveColor: (v: string) => void;
//   // Trail
//   trailing: boolean;
//   setTrailing: (v: boolean) => void;
//   trailLength: number;
//   setTrailLength: (v: number) => void;
//   minTrailLength: number;
//   setMinTrailLength: (v: number) => void;
//   trailingLifetime: number;
//   setTrailingLifetime: (v: number) => void;
//   trailingRadius: number;
//   setTrailingRadius: (v: number) => void;
//   trailingColor: string;
//   setTrailingColor: (v: string) => void;
//   trailingGradientFrom: string;
//   setTrailingGradientFrom: (v: string) => void;
//   trailingGradientTo: string;
//   setTrailingGradientTo: (v: string) => void;
//   // Items
//   bombCount: number;
//   setBombCount: (v: number) => void;
//   bombRadiusPx: number;
//   setBombRadiusPx: (v: number) => void;
//   timerCount: number;
//   setTimerCount: (v: number) => void;
//   // Explosion / Collider
//   colliderPx: number;
//   setColliderPx: (v: number) => void;
//   // Lifetime chunks
//   lifeMin: number;
//   setLifeMin: (v: number) => void;
//   lifeMax: number;
//   setLifeMax: (v: number) => void;
//   groupCount: number;
//   setGroupCount: (v: number) => void;
//   // Timings
//   autoExitMs: number;
//   setAutoExitMs: (v: number) => void;
//   manualExitMs: number;
//   setManualExitMs: (v: number) => void;
//   manualDelay: number;
//   setManualDelay: (v: number) => void;
//   // Waves
//   waveOnPointerUp: boolean;
//   setWaveOnPointerUp: (v: boolean) => void;
//   waveOnPointerMove: boolean;
//   setWaveOnPointerMove: (v: boolean) => void;
//   waveReach: number;
//   setWaveReach: (v: number) => void;
//   waveStrength: number;
//   setWaveStrength: (v: number) => void;
//   waveThickness: number;
//   setWaveThickness: (v: number) => void;
//   waveDuration: number;
//   setWaveDuration: (v: number) => void;
//   waveColor: string;
//   setWaveColor: (v: string) => void;
// }

export function SettingsPanel() {
  // {
  // Field & dot–pattern
  // gridGap, setGridGap,
  // thresholdPercent, setThresholdPercent,
  // baseRadius, setBaseRadius,
  // maxRadius, setMaxRadius,
  // reach, setReach,
  // blur, setBlur,
  // staticColor, setStaticColor,
  // activeColor, setActiveColor,
  // // Trail
  // trailing, setTrailing,
  // trailLength, setTrailLength,
  // minTrailLength, setMinTrailLength,
  // trailingLifetime, setTrailingLifetime,
  // trailingRadius, setTrailingRadius,
  // trailingColor, setTrailingColor,
  // trailingGradientFrom, setTrailingGradientFrom,
  // trailingGradientTo, setTrailingGradientTo,
  // // Items
  // bombCount, setBombCount,
  // bombRadiusPx, setBombRadiusPx,
  // timerCount, setTimerCount,
  // // Explosion / Collider
  // colliderPx, setColliderPx,
  // // Lifetime chunks
  // lifeMin, setLifeMin,
  // lifeMax, setLifeMax,
  // groupCount, setGroupCount,
  // // Timings
  // autoExitMs, setAutoExitMs,
  // manualExitMs, setManualExitMs,
  // manualDelay, setManualDelay,
  // // Waves
  // waveOnPointerUp, setWaveOnPointerUp,
  // waveOnPointerMove, setWaveOnPointerMove,
  // waveReach, setWaveReach,
  // waveStrength, setWaveStrength,
  // waveThickness, setWaveThickness,
  // waveDuration, setWaveDuration,
  // waveColor, setWaveColor,
  // }: SettingsPanelProps
  const [dotsGap, setDotsGap] = useState(12)
  const [trailingLength, setTrailingLength] = useState(20)

  return (
    <aside
      className={cn(
        'absolute w-full h-[calc(100%-126px)] top-16 overflow-y-auto z-[50] border-2 border-white/50 bg-white/20 p-3 font-pixel text-white',
      )}
    >
      <h2 className="text-2xl mb-6 text-center">Настройки</h2>

      {/* Настройки заднего фона */}
      <SettingsSection title="Настройки бэкграунда">
        <RangeField
          title="гэп точек"
          id="dots-pattern-bg-dots-gap"
          min={4}
          max={16}
          step={1}
          value={dotsGap}
          containerClassName="mt-6 pr-4"
          onChange={(e) => setDotsGap(Number(e.target.value))}
        />

        <RangeField
          title="макс. длина трейла"
          id="dots-pattern-trailing-length"
          min={10}
          max={30}
          step={1}
          value={trailingLength}
          containerClassName="pr-4"
          onChange={(e) => setTrailingLength(Number(e.target.value))}
        />
      </SettingsSection>

      <SettingsSection className="mt-4" title="Настройки игры">
        <RangeField
          title="гэп точек"
          id="dots-pattern-bg-dots-gap"
          min={4}
          max={16}
          step={1}
          value={dotsGap}
          containerClassName="mt-6 pr-4"
          onChange={(e) => setDotsGap(Number(e.target.value))}
        />

        <RangeField
          title="макс. длина трейла"
          id="dots-pattern-trailing-length"
          min={10}
          max={30}
          step={1}
          value={trailingLength}
          containerClassName="pr-4"
          onChange={(e) => setTrailingLength(Number(e.target.value))}
        />
      </SettingsSection>
    </aside>
  )
}

export interface RangeFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Дополнительный класс для контейнера */
  containerClassName?: string
  /** Класс для лейбла (отображает текущее значение) */
  labelClassName?: string
  title?: string
}

export function RangeField({
  title,
  id,
  value,
  onChange,
  containerClassName = '',
  labelClassName = '',
  className, // позволим прокинуть свои классы
  ...inputProps
}: RangeFieldProps) {
  // приведём value к числу
  const numericValue =
    typeof value === 'string' ? Number(value) : (value as number)

  return (
    <div className={cn(containerClassName)}>
      <span className="[text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">{title}</span>
      <div className="inline-flex items-center justify-between w-full">
        <input
          id={id}
          type="range"
          value={numericValue}
          onChange={onChange}
          className={cn(
            'flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-auto [&::-moz-range-thumb]:appearance-auto [&::-ms-thumb]:appearance-auto',
            className,
          )}
          {...inputProps}
        />
        {id && (
          <label
            htmlFor={id}
            className={`ml-4 text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] ${
              labelClassName || ''
            }`}
          >
            {numericValue}
          </label>
        )}
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  children,
  className,
  useAction,
}: {
  title: string
  children: React.ReactNode
  className?: string
  useAction?: boolean
}) {
  return (
    <section
      className={`
        border-2
        p-4
        bg-white/50
        ${className}
      `}
    >
      <h3 className="text-xl mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
        {title}
      </h3>
      {children}

      {useAction && (
        <button className="bg-black px-3 py-2 rounded-lg cursor-pointer">
          Применить
        </button>
      )}
    </section>
  )
}

// {/* 2. Трейл (вся настройка) */}
// <section className={sectionBg}>
//   <h3 className={titleStyle}>Трейл</h3>
//   <label className="flex items-center mb-4 text-[#e8eaed]">
//     <input
//       type="checkbox"
//       checked={trailing}
//       onChange={e => setTrailing(e.target.checked)}
//       className="mr-2 accent-[#1abcfe]"
//     />
//     Enable Trail
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Trail Length</div>
//     <input
//       type="number" min={1} max={50}
//       value={trailLength}
//       onChange={e => setTrailLength(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Min Trail Length</div>
//     <input
//       type="number" min={1} max={20}
//       value={minTrailLength}
//       onChange={e => setMinTrailLength(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Trail Lifetime (ms)</div>
//     <input
//       type="number" min={10} max={2000}
//       value={trailingLifetime}
//       onChange={e => setTrailingLifetime(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Trail Radius</div>
//     <input
//       type="number" min={1} max={50}
//       value={trailingRadius}
//       onChange={e => setTrailingRadius(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Trail Color</div>
//     <input
//       type="color"
//       value={trailingColor}
//       onChange={e => setTrailingColor(e.target.value)}
//       className="w-full h-8 p-0 border-none"
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Gradient From</div>
//     <input
//       type="color"
//       value={trailingGradientFrom}
//       onChange={e => setTrailingGradientFrom(e.target.value)}
//       className="w-full h-8 p-0 border-none"
//     />
//   </label>
//   <label>
//     <div className={labelText}>Gradient To</div>
//     <input
//       type="color"
//       value={trailingGradientTo}
//       onChange={e => setTrailingGradientTo(e.target.value)}
//       className="w-full h-8 p-0 border-none"
//     />
//   </label>
// </section>

// <section className={sectionBg}>
//   <h3 className={titleStyle}>Волны</h3>
//   <label className="flex items-center mb-4 text-[#e8eaed]">
//     <input
//       type="checkbox"
//       checked={waveOnPointerUp}
//       onChange={e => setWaveOnPointerUp(e.target.checked)}
//       className="mr-2 accent-[#1abcfe]"
//     />
//     Wave on Pointer Up
//   </label>
//   <label className="flex items-center mb-4 text-[#e8eaed]">
//     <input
//       type="checkbox"
//       checked={waveOnPointerMove}
//       onChange={e => setWaveOnPointerMove(e.target.checked)}
//       className="mr-2 accent-[#1abcfe]"
//     />
//     Wave on Pointer Move
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Wave Reach</div>
//     <input
//       type="number" min={10} max={500}
//       value={waveReach}
//       onChange={e => setWaveReach(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Wave Strength</div>
//     <input
//       type="range" min={0} max={1} step={0.01}
//       value={waveStrength}
//       onChange={e => setWaveStrength(+e.target.value)}
//       className="w-full accent-[#1abcfe]"
//     />
//     <div className="text-right text-xs text-[#9aa0a6] mt-1">
//       {waveStrength.toFixed(2)}
//     </div>
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Wave Thickness</div>
//     <input
//       type="range" min={0} max={1} step={0.01}
//       value={waveThickness}
//       onChange={e => setWaveThickness(+e.target.value)}
//       className="w-full accent-[#1abcfe]"
//     />
//     <div className="text-right text-xs text-[#9aa0a6] mt-1">
//       {waveThickness.toFixed(2)}
//     </div>
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Wave Duration (s)</div>
//     <input
//       type="number" min={0.1} max={5} step={0.1}
//       value={waveDuration}
//       onChange={e => setWaveDuration(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label>
//     <div className={labelText}>Wave Color</div>
//     <input
//       type="color"
//       value={waveColor}
//       onChange={e => setWaveColor(e.target.value)}
//       className="w-full h-8 p-0 border-none"
//     />
//   </label>
// </section>

// {/* 3. Айтемы */}
// {/* SettingsPanel.tsx — секция “Айтемы” */}
// {/* 4. Взрыв / Коллайдер */}
// <section className={sectionBg}>
//   <h3 className={titleStyle}>Взрыв / Коллайдер</h3>
//   <label className="block mb-4">
//     <div className={labelText}>Collider Size (px)</div>
//     <input
//       type="number"
//       min={0}
//       value={colliderPx}
//       onChange={e => setColliderPx(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
// </section>

// {/* 5. Временные чанки */}
// <section className={sectionBg}>
//   <h3 className={titleStyle}>Временные чанки</h3>
//   <label className="block mb-4">
//     <div className={labelText}>Life Min (ms)</div>
//     <input
//       type="number"
//       min={0}
//       value={lifeMin}
//       onChange={e => setLifeMin(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Life Max (ms)</div>
//     <input
//       type="number"
//       min={lifeMin}
//       value={lifeMax}
//       onChange={e => setLifeMax(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label>
//     <div className={labelText}>Group Count</div>
//     <input
//       type="number"
//       min={1}
//       max={10}
//       value={groupCount}
//       onChange={e => setGroupCount(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
// </section>

// {/* 6. Тайминги */}
// <section className={sectionBg}>
//   <h3 className={titleStyle}>Тайминги</h3>
//   <label className="block mb-4">
//     <div className={labelText}>Auto Exit (ms)</div>
//     <input
//       type="number"
//       min={0}
//       value={autoExitMs}
//       onChange={e => setAutoExitMs(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label className="block mb-4">
//     <div className={labelText}>Manual Exit (ms)</div>
//     <input
//       type="number"
//       min={0}
//       value={manualExitMs}
//       onChange={e => setManualExitMs(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
//   <label>
//     <div className={labelText}>Manual Delay (ms)</div>
//     <input
//       type="number"
//       min={0}
//       value={manualDelay}
//       onChange={e => setManualDelay(+e.target.value)}
//       className={inputBase}
//     />
//   </label>
// </section>
