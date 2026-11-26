import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { OpeningConfetti } from './components/OpeningConfetti'
import { Album } from './components/Album'
import { CardCover } from './components/CardCover'
import { PhotoLightbox } from './components/PhotoLightbox'
import { SurpriseModal } from './components/SurpriseModal'
import { albumPhotos, introSong, mainSong } from './data/album'
import type { AlbumPhoto } from './data/album'

type LightboxState = { photo: AlbumPhoto; source: 'album' | 'surprise' } | null

export default function App() {
  const [opened, setOpened] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const finishCelebrating = useCallback(() => setCelebrating(false), [])
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const [audioMessage, setAudioMessage] = useState('')
  const introAudioRef = useRef<HTMLAudioElement>(null)
  const mainAudioRef = useRef<HTMLAudioElement>(null)
  const introCompleteRef = useRef(false)
  const openedRef = useRef(false)
  const musicEnabledRef = useRef(true)
  const blockersRef = useRef(new Set<'phone' | 'video'>())
  const photoTriggerRef = useRef<HTMLButtonElement | null>(null)
  const envelopeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const modalOpen = Boolean(lightbox || surpriseOpen)

  useLayoutEffect(() => {
    if (introAudioRef.current) introAudioRef.current.volume = 0.5
    if (mainAudioRef.current) mainAudioRef.current.volume = 0.5
  }, [])

  useEffect(() => { if (opened) window.scrollTo({ top: 0, behavior: 'instant' }) }, [opened])
  useEffect(() => {
    if (!modalOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [modalOpen])

  // Единое управление звуком Полины: вступление звучит один раз до 11-й секунды, затем основная песня повторяется. Телефон и видео сохраняют текущую позицию музыки, а ручное выключение запрещает автоматическое возобновление.
  const syncBackground = useCallback(() => {
    const intro = introAudioRef.current
    const main = mainAudioRef.current
    if (!intro || !main) return
    if (!openedRef.current || !musicEnabledRef.current || blockersRef.current.size > 0) {
      intro.pause()
      main.pause()
      return
    }
    const current = introCompleteRef.current ? main : intro
    const other = introCompleteRef.current ? intro : main
    other.pause()
    if (!current.paused) return
    void current.play().catch((error: DOMException) => {
      if (error.name !== 'AbortError' && openedRef.current && musicEnabledRef.current && blockersRef.current.size === 0) {
        setAudioMessage('Нажми на кнопку музыки, чтобы включить песню.')
      }
    })
  }, [])

  const setSoundBlocker = useCallback((source: 'phone' | 'video', active: boolean) => {
    if (active) blockersRef.current.add(source)
    else blockersRef.current.delete(source)
    syncBackground()
  }, [syncBackground])
  const handlePhoneActivityChange = useCallback((active: boolean) => setSoundBlocker('phone', active), [setSoundBlocker])
  const handleVideoActivityChange = useCallback((active: boolean) => {
    setSoundBlocker('video', active)
    if (active) {
      window.dispatchEvent(new Event('polina-video-start'))
    }
  }, [setSoundBlocker])

  function finishIntro() {
    if (introCompleteRef.current) return
    introCompleteRef.current = true
    introAudioRef.current?.pause()
    if (mainAudioRef.current) mainAudioRef.current.currentTime = 0
    syncBackground()
  }

  function openCard() {
    openedRef.current = true
    setCelebrating(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setOpened(true)
    syncBackground()
  }
  function backToCover() {
    openedRef.current = false
    blockersRef.current.clear()
    syncBackground()
    setCelebrating(false)
    setOpened(false)
    setAudioMessage('')
  }
  function toggleMusic() {
    // Если браузер отклонил первый запуск, кнопка повторяет попытку по явному нажатию; во время телефона или видео она запоминает ручной выбор пользователя.
    musicEnabledRef.current = blockersRef.current.size > 0
      ? !musicEnabledRef.current
      : Boolean(introAudioRef.current?.paused && mainAudioRef.current?.paused)
    setAudioMessage('')
    syncBackground()
  }

  function openPhoto(photo: AlbumPhoto, trigger: HTMLButtonElement) {
    photoTriggerRef.current = trigger
    setLightbox({ photo, source: 'album' })
  }
  function closeLightbox() {
    setLightbox(null)
    requestAnimationFrame(() => photoTriggerRef.current?.focus())
  }
  function movePhoto(direction: -1 | 1) {
    if (!lightbox || lightbox.source !== 'album') return
    const currentIndex = albumPhotos.findIndex((photo) => photo.id === lightbox.photo.id)
    const nextIndex = (currentIndex + direction + albumPhotos.length) % albumPhotos.length
    setLightbox({ photo: albumPhotos[nextIndex], source: 'album' })
  }
  function openSurprise(trigger: HTMLButtonElement) {
    envelopeTriggerRef.current = trigger
    setSurpriseOpen(true)
  }
  function closeSurprise() {
    document.querySelector<HTMLVideoElement>('.surprise-video')?.pause()
    setSurpriseOpen(false)
    setSoundBlocker('video', false)
    requestAnimationFrame(() => envelopeTriggerRef.current?.focus())
  }

  useEffect(() => {
    if (!lightbox && !surpriseOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (lightbox) closeLightbox()
        else closeSurprise()
      } else if (lightbox?.source === 'album' && event.key === 'ArrowLeft') movePhoto(-1)
      else if (lightbox?.source === 'album' && event.key === 'ArrowRight') movePhoto(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return <>
    <audio ref={introAudioRef} src={introSong} preload="metadata" onPlay={() => { setIsMusicPlaying(true); setAudioMessage('') }} onPause={() => setIsMusicPlaying(false)} onTimeUpdate={(event) => { if (event.currentTarget.currentTime >= 11) finishIntro() }} onEnded={finishIntro} onError={() => setAudioMessage('Не удалось загрузить вступление.')} />
    <audio ref={mainAudioRef} src={mainSong} preload="metadata" loop onPlay={() => { setIsMusicPlaying(true); setAudioMessage('') }} onPause={() => setIsMusicPlaying(false)} onError={() => setAudioMessage('Не удалось загрузить песню.')} />
    {opened ? <Album onBack={backToCover} onOpenPhoto={openPhoto} onOpenSurprise={openSurprise} onToggleMusic={toggleMusic} isMusicPlaying={isMusicPlaying} audioMessage={audioMessage} modalOpen={modalOpen} onPhoneActivityChange={handlePhoneActivityChange} /> : <CardCover onOpen={openCard} />}
    {celebrating && <OpeningConfetti onComplete={finishCelebrating} />}
    {surpriseOpen && <SurpriseModal onClose={closeSurprise} onVideoActivityChange={handleVideoActivityChange} />}
    {lightbox && <PhotoLightbox photo={lightbox.photo} hasNavigation={lightbox.source === 'album'} onClose={closeLightbox} onPrevious={() => movePhoto(-1)} onNext={() => movePhoto(1)} />}
  </>
}
