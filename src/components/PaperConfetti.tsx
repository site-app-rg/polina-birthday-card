type Placement = 'cover' | 'album' | 'envelope' | 'transition' | 'together' | 'letter' | 'slider-gap'
type Piece = readonly [x: number, y: number, width: number, height: number, angle: number]

// Hand-placed in the empty margins, underneath photos, lettering and existing decor.
// Coordinates are percentages; sizes stay small at every screen width.
const layouts: Record<Placement, readonly Piece[]> = {
  cover: [[6, 66, 5, 8, -22], [9, 70, 4, 4, 0], [92, 64, 6, 8, 24], [94, 70, 3, 3, 0], [30, 94, 6, 8, -17], [38, 96, 4, 5, 32], [43, 92, 3, 3, 0]],
  album: [[43, 4, 5, 7, 28], [49, 6, 3, 3, 0], [38, 83, 6, 8, -24], [43, 86, 4, 5, 18], [39, 96, 3, 3, 0]],
  envelope: [[33, 96, 6, 8, -23], [40, 93, 4, 5, 21], [46, 97, 3, 3, 0]],
  transition: [[75, 7, 6, 8, -25], [82, 9, 5, 6, 28], [88, 13, 4, 6, 20], [6, 65, 5, 7, -28], [6, 69, 3, 3, 0], [89, 72, 6, 7, 18], [85, 78, 4, 5, -12]],
  together: [[81, 5, 5, 8, 24], [89, 8, 3, 3, 0], [84, 44, 6, 8, -17], [90, 47, 4, 5, 32], [12, 59, 5, 7, -24], [20, 61, 3, 3, 0], [12, 21, 5, 8, -27], [20, 23, 4, 5, 19], [8, 25, 3, 3, 0], [72, 71, 5, 7, -18], [82, 73, 4, 6, 32], [91, 70, 3, 3, 0], [32, 96, 5, 8, 21], [43, 94, 3, 3, 0], [56, 98, 4, 6, -24]],
  letter: [[90, 8, 6, 8, -20], [95, 12, 3, 3, 0], [76, 96, 5, 7, 23], [86, 98, 3, 3, 0], [47, 95, 5, 7, -21], [58, 93, 4, 6, 30], [64, 97, 3, 3, 0]],
  // Между счётчиком слайдера и письмом Полины лежат только редкие мелкие конфетти; высота разделов и управление слайдером не меняются.
  'slider-gap': [[9, 36, 5, 7, -23], [17, 68, 3, 3, 0], [28, 47, 4, 6, 19], [35, 78, 3, 4, -16], [43, 31, 5, 6, 27], [53, 65, 3, 3, 0], [62, 42, 4, 5, -31], [70, 74, 3, 4, 13], [78, 28, 5, 7, -18], [89, 58, 4, 5, 24], [94, 81, 3, 3, 0]],
}

export function PaperConfetti({ placement }: { placement: Placement }) {
  return (
    <div className={`paper-confetti paper-confetti--${placement}`} aria-hidden="true">
      {layouts[placement].map(([x, y, width, height, angle], index) => (
        <span key={index} className={`paper-confetti__piece paper-confetti__piece--${index % 3}${width === height ? ' is-dot' : ''}`}
          style={{ left: `${x}%`, top: `${y}%`, width, height, transform: `rotate(${angle}deg)` }} />
      ))}
    </div>
  )
}
