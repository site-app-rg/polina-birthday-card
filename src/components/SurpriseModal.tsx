import { useEffect, useRef } from 'react'

type SurpriseModalProps = {
  onClose: () => void
  onVideoActivityChange: (active: boolean) => void
}
export function SurpriseModal({ onClose, onVideoActivityChange }: SurpriseModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => { closeButton.current?.focus() }, [])
  useEffect(() => () => { videoRef.current?.pause(); onVideoActivityChange(false) }, [onVideoActivityChange])

  function keepFocus(event: React.KeyboardEvent) {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const controls = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), video[controls]')]
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
    <div className="surprise-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} className="surprise-card" role="dialog" aria-modal="true" aria-label="Видео для Полины" onKeyDown={keepFocus}>
        <button ref={closeButton} className="surprise-card__close" type="button" onClick={onClose} aria-label="Закрыть сюрприз">×</button>
        {/* Открытый конверт Полины: короткая надпись и исходное видео без верхней фотографии; бумажное обрамление поддерживает вертикальный формат ролика. */}
        {/* Поля бумажной подложки: три лёгких сердечка и небольшой утверждённый букет лаванды украшают свободные края, не закрывая текст, видео и управление. */}
        <span className="surprise-card__doodle surprise-card__doodle--heart-one" aria-hidden="true">♡</span>
        <span className="surprise-card__doodle surprise-card__doodle--heart-two" aria-hidden="true">♡</span>
        <span className="surprise-card__doodle surprise-card__doodle--heart-three" aria-hidden="true">♡</span>
        <img className="surprise-card__doodle surprise-card__doodle--lavender-one" src={`${import.meta.env.BASE_URL}decor/lavender-bouquet.webp`} alt="" aria-hidden="true" />
        <p className="surprise-card__note">Оставайся такой же озорной и жизнерадостной!</p>
        <div className="surprise-video-frame">
          {/* Видео Полины сохранено без перекодирования изображения; в рабочей копии звуковая дорожка снижена до 85%. */}
          <video ref={videoRef} className="surprise-video" src={`${import.meta.env.BASE_URL}media/birthday-video-85.mp4`} controls playsInline preload="metadata" tabIndex={0} onPlay={() => onVideoActivityChange(true)} onPause={() => onVideoActivityChange(false)} onEnded={() => onVideoActivityChange(false)} />
        </div>
      </div>
    </div>
  )
}
