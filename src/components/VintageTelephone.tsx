import { useCallback, useEffect, useRef, useState } from 'react'

type Playback = 'idle' | 'playing' | 'finished'
const media = (name: string) => `${import.meta.env.BASE_URL}media/${name}`

// Телефон между коллажами Полины: при первом появлении в поле зрения до трёх раз проигрывает короткий механический звонок с паузами. Нажатие прекращает звонок и управляет полной мелодией; сигнал активности позволяет в будущем приостанавливать фоновую музыку.
export function VintageTelephone({ onActivityChange }: { onActivityChange: (active: boolean) => void }) {
  const section = useRef<HTMLElement>(null)
  const ring = useRef<HTMLAudioElement>(null)
  const melody = useRef<HTMLAudioElement>(null)
  const timer = useRef<number | null>(null)
  const started = useRef(false)
  const playbackState = useRef<Playback>('idle')
  const activity = useRef(onActivityChange)
  const [ringing, setRinging] = useState(false)
  const [playback, setPlayback] = useState<Playback>('idle')
  const [error, setError] = useState('')
  useEffect(() => { activity.current = onActivityChange }, [onActivityChange])

  const stopRing = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    ring.current?.pause()
    if (ring.current) ring.current.currentTime = 0
    setRinging(false)
  }, [])

  // При запуске видео телефон Полины сразу прекращает звонок или мелодию, чтобы два источника звука не звучали одновременно.
  useEffect(() => {
    const stopForVideo = () => {
      stopRing()
      melody.current?.pause()
      if (melody.current) melody.current.currentTime = 0
      if (playbackState.current === 'playing') { playbackState.current = 'finished'; setPlayback('finished') }
      activity.current(false)
    }
    window.addEventListener('polina-video-start', stopForVideo)
    return () => window.removeEventListener('polina-video-start', stopForVideo)
  }, [stopRing])

  useEffect(() => {
    const target = section.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      let count = 0
      const chime = () => {
        count += 1
        setRinging(true)
        activity.current(true)
        if (ring.current) {
          ring.current.currentTime = 0
          void ring.current.play().catch(() => { /* Мобильный браузер может запретить звук до нажатия. */ })
        }
        timer.current = window.setTimeout(() => {
          ring.current?.pause()
          setRinging(false)
          if (count < 3) timer.current = window.setTimeout(chime, 2200)
          else { timer.current = null; activity.current(false) }
        }, 2100)
      }
      chime()
    }, { threshold: .55 })
    observer.observe(target)
    return () => { observer.disconnect(); stopRing(); melody.current?.pause(); activity.current(false) }
  }, [stopRing])

  async function toggle() {
    stopRing()
    setError('')
    const audio = melody.current
    if (!audio) return
    if (playbackState.current === 'playing') {
      audio.pause()
      audio.currentTime = 0
      playbackState.current = 'finished'; setPlayback('finished')
      activity.current(false)
      return
    }
    audio.currentTime = 0
    activity.current(true)
    playbackState.current = 'playing'; setPlayback('playing')
    try { await audio.play() }
    catch {
      if (playbackState.current === 'playing') {
        playbackState.current = 'idle'; setPlayback('idle')
        setError('Не удалось включить мелодию. Нажми ещё раз.'); activity.current(false)
      }
    }
  }

  const hint = playback === 'playing' ? 'Нажми, чтобы остановить' : playback === 'finished' ? 'Прослушать ещё раз' : 'Нажми, чтобы ответить'
  return <section className="vintage-telephone" ref={section} aria-label="Музыкальный телефон">
    <p className="vintage-telephone__title">Тебе звонят…</p>
    <button className={`vintage-telephone__button${ringing ? ' vintage-telephone__button--ringing' : ''}`} type="button" onClick={() => void toggle()} aria-label={hint}>
      <img src={media('telephone-provence.webp')} width="1000" height="1000" alt="" loading="lazy" />
    </button>
    <p className="vintage-telephone__hint" aria-live="polite">{hint}</p>
    {error && <p className="vintage-telephone__error" role="status">{error}</p>}
    <audio ref={ring} src={media('vintage-ring.wav')} preload="auto" />
    {/* Копия мелодии телефона Полины создана из оригинала с итоговым уровнем 49%, чтобы снижение действовало и на iPhone. Звонок остаётся прежним. */}
    <audio ref={melody} src={media('put-49.mp3')} preload="metadata" onEnded={() => { playbackState.current = 'finished'; setPlayback('finished'); activity.current(false) }} />
  </section>
}
