import { useEffect, useRef } from 'react'
import type { AlbumPhoto } from '../data/album'

type PhotoLightboxProps = {
  photo: AlbumPhoto
  hasNavigation: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export function PhotoLightbox({ photo, hasNavigation, onClose, onPrevious, onNext }: PhotoLightboxProps) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => { closeButton.current?.focus() }, [])

  function keepFocus(event: React.KeyboardEvent) {
    if (event.key !== 'Tab' || !panel.current) return
    const controls = [...panel.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])')]
    if (controls.length === 0) return
    if (event.shiftKey && document.activeElement === controls[0]) {
      event.preventDefault()
      controls[controls.length - 1].focus()
    } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
      event.preventDefault()
      controls[0].focus()
    }
  }

  return (
    <div className="lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={panel} className="lightbox__panel" role="dialog" aria-modal="true" aria-label={`Фотография ${photo.id}`} onKeyDown={keepFocus}>
        <div className="lightbox__top">
          <span>Фото {photo.id}</span>
          <button ref={closeButton} type="button" onClick={onClose} aria-label="Закрыть фотографию">×</button>
        </div>
        <div className="lightbox__image-wrap">
          {hasNavigation && <button className="lightbox__arrow lightbox__arrow--prev" type="button" onClick={onPrevious} aria-label="Предыдущая фотография">‹</button>}
          <img src={photo.src} alt={photo.alt} />
          {hasNavigation && <button className="lightbox__arrow lightbox__arrow--next" type="button" onClick={onNext} aria-label="Следующая фотография">›</button>}
        </div>
      </div>
    </div>
  )
}
