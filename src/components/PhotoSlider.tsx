import { useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import type { AlbumPhoto } from '../data/album'
import { sliderPhotos } from '../data/album'
import { PaperConfetti } from './PaperConfetti'

// Слайдер открытки Полины: текущая и обе соседние карточки загружаются сразу, поэтому превью видны до первого свайпа; стрелки, счётчик и увеличение снимка сохранены.
export function PhotoSlider({ onOpenPhoto }: { onOpenPhoto: (photo: AlbumPhoto, trigger: HTMLButtonElement) => void }) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)
  function move(direction: number) {
    setIndex((previous) => (previous + direction + sliderPhotos.length) % sliderPhotos.length)
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.changedTouches[0]
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStart.current === null) return
    const delta = event.changedTouches[0].clientX - touchStart.current.x
    const vertical = event.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(delta) < 40 || Math.abs(delta) < Math.abs(vertical) * 1.2) return
    suppressClick.current = true
    move(delta < 0 ? 1 : -1)
    window.setTimeout(() => { suppressClick.current = false }, 350)
  }

  return (
    <section className="photo-slider" aria-label="Наши фотографии" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="photo-slider__row">
        <button className="photo-slider__arrow" type="button" onClick={() => move(-1)} aria-label="Предыдущая фотография">‹</button>
        <div className="photo-slider__stage" aria-live="polite">
          {sliderPhotos.map((item, photoIndex) => {
            const distance = (photoIndex - index + sliderPhotos.length) % sliderPhotos.length
            const place = distance === 0 ? 'current' : distance === 1 ? 'next' : distance === sliderPhotos.length - 1 ? 'previous' : 'hidden'
            return <button key={item.id} className={`photo-print photo-slider__print photo-slider__print--${place}`} type="button" tabIndex={place === 'current' ? 0 : -1} aria-hidden={place !== 'current'} aria-label={place === 'current' ? `Открыть фотографию: ${item.alt}` : undefined} onClick={(event) => { if (place === 'current' && !suppressClick.current) onOpenPhoto(item, event.currentTarget) }}>
              <span className="photo-print__image"><img src={item.src} alt="" loading={place === 'hidden' ? 'lazy' : 'eager'} /></span>
            </button>
          })}
        </div>
        <button className="photo-slider__arrow" type="button" onClick={() => move(1)} aria-label="Следующая фотография">›</button>
      </div>
      <p className="photo-slider__count" aria-label={`Фотография ${index + 1} из ${sliderPhotos.length}`}>{index + 1} / {sliderPhotos.length}</p>
      {/* Редкое конфетти заполняет только свободный промежуток после счётчика, не меняя высоту слайдера и его управление. */}
      <PaperConfetti placement="slider-gap" />
    </section>
  )
}
