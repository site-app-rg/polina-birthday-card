import { useEffect } from 'react'
import type { CSSProperties } from 'react'

const pieces = Array.from({ length: 38 }, (_, index) => {
  const angle = (200 + index * 137.508 % 140) * Math.PI / 180
  const reach = 110 + index * 43 % 175
  const burstX = Math.cos(angle) * reach
  const burstY = Math.sin(angle) * reach
  const drift = ((index * 19) % 55) - 27
  return {
    '--burst-x': `${burstX}px`,
    '--burst-y': `${burstY}px`,
    '--float-x': `${burstX + drift * .4}px`,
    '--float-y': `${burstY * .2 + 85}px`,
    '--landing-x': `${burstX + drift}px`,
    '--fall-y': `${210 + index * 31 % 100}px`,
    '--spin': `${(index % 2 ? -1 : 1) * (75 + index * 23 % 160)}deg`,
    '--delay': `${index % 5 * 20}ms`,
    // Конфетти при открытии открытки Полины: только новые цвета, траектории и число частиц сохранены.
    '--paper-color': ['#B5A3C7', '#9DA88B', '#DFD2BD', '#D5B0AE'][index % 4],
  } as CSSProperties
})

export function OpeningConfetti({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3000)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return <div className="opening-confetti" aria-hidden="true">
    {pieces.map((style, index) => <span key={index} className={`opening-confetti__piece opening-confetti__piece--${index % 3}`} style={style} />)}
  </div>
}
