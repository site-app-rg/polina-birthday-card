import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { AlbumPhoto } from '../data/album'
import { albumPhotos, childhoodPhotos, firstCollagePhotos, secondCollagePhotos, letterParagraphs } from '../data/album'
import { PaperConfetti } from './PaperConfetti'
import { AlbumScrollHint } from './AlbumScrollHint'
import { PhotoSlider } from './PhotoSlider'
import { VintageTelephone } from './VintageTelephone'

type AlbumProps = {
  onBack: () => void
  onOpenPhoto: (photo: AlbumPhoto, trigger: HTMLButtonElement) => void
  onOpenSurprise: (trigger: HTMLButtonElement) => void
  onToggleMusic: () => void
  isMusicPlaying: boolean
  audioMessage: string
  modalOpen: boolean
  onPhoneActivityChange: (active: boolean) => void
}

const photo = (id: string) => albumPhotos.find((item) => item.id === id)!
const decorPath = (filename: string) => `${import.meta.env.BASE_URL}decor/${filename}`

function PhotoPrint({ item, caption, onOpen, className = '' }: { item: AlbumPhoto; caption?: string; onOpen: AlbumProps['onOpenPhoto']; className?: string }) {
  return (
    <button className={`photo-print ${className}`} type="button" onClick={(event) => onOpen(item, event.currentTarget)} aria-label={`Открыть фотографию: ${item.alt}`}>
      <span className="photo-print__image"><img src={item.src} alt="" loading="lazy" /></span>
      {caption && <span className="photo-print__caption">{caption}</span>}
    </button>
  )
}

function AlbumHeart({ className }: { className: string }) {
  return <svg className={`album-book__ornament ${className}`} viewBox="0 0 80 76" fill="none" aria-hidden="true" focusable="false">
    <path d="M40 68C25 56 7 44 7 26 7 15 15 8 25 9c8 1 13 7 16 13 4-8 11-14 19-13 10 1 15 9 14 18-1 18-19 31-34 41Z" />
    <path className="album-book__heart-sketch" d="M13 24c-2 13 8 24 18 33M47 18c6-7 13-8 19-3" />
  </svg>
}

function AlbumSequence({ onOpenPhoto, modalOpen }: Pick<AlbumProps, 'onOpenPhoto' | 'modalOpen'>) {
  const sequenceRef = useRef<HTMLElement>(null)
  const [turn, setTurn] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const sequence = sequenceRef.current
      if (!sequence) return
      const bounds = sequence.getBoundingClientRect()
      const travel = Math.max(1, bounds.height - window.innerHeight)
      const scrollPart = Math.max(0, Math.min(1, -bounds.top / travel))
      const next = Math.max(0, Math.min(1, (scrollPart - .22) / .56))
      setTurn((previous) => Math.abs(previous - next) > .004 ? next : previous)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const secondVisible = turn >= .5
  return (
    <section className={`album-sequence${secondVisible ? ' is-second' : ''}`} ref={sequenceRef} aria-label="Фотоальбом воспоминаний" data-turn-progress={turn.toFixed(2)}>
      <div className="album-sequence__stage">
        <AlbumScrollHint sectionRef={sequenceRef} modalOpen={modalOpen} />
        <PaperConfetti placement="album" />
        {/* Декор альбома Полины: новые прозрачные шары, подарок, ленты и букет; перелистывание и фотопросмотр не меняются. */}
        <img className="album-decor album-decor--lavender-bouquet" src={decorPath('lavender-bouquet.webp')} alt="" aria-hidden="true" />
        <img className="album-decor album-decor--balloons" src={decorPath('balloons-group-provence.webp')} alt="" aria-hidden="true" />
        <img className="album-decor album-decor--balloon" src={decorPath('balloon-milk-provence.webp')} alt="" aria-hidden="true" />
        <img className="album-decor album-decor--gift" src={decorPath('gift-box-provence.webp')} alt="" aria-hidden="true" />
        <img className="album-decor album-decor--ribbon-side" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" />
        <img className="album-decor album-decor--ribbon-bottom" src={decorPath('ribbon-long-lavender.webp')} alt="" aria-hidden="true" />
        <div className="album-book" style={{ '--turn-angle': `${-180 * turn}deg` } as CSSProperties}>
          <div className="book-page book-page--left album-book__left">
            {/* Левые страницы детского альбома: два набора сердечек и прозрачной лаванды сменяются вместе с разворотом; часть деталей расположена у переплёта и остаётся видимой на телефоне. */}
            <div className="album-book__composition album-book__composition--hearts" aria-hidden="true">
              <AlbumHeart className="album-book__heart--large" />
              <AlbumHeart className="album-book__heart--small" />
              <AlbumHeart className="album-book__heart--middle" />
              <img className="album-book__ornament album-book__sprig--hearts-top" src={decorPath('lavender-sprig.webp')} alt="" />
              <img className="album-book__ornament album-book__sprig--hearts-bottom" src={decorPath('lavender-sprig.webp')} alt="" />
            </div>
            <div className="album-book__composition album-book__composition--lavender" aria-hidden="true">
              <img className="album-book__ornament album-book__lavender--bouquet" src={decorPath('lavender-bouquet.webp')} alt="" />
              <img className="album-book__ornament album-book__lavender--sprig-right" src={decorPath('lavender-sprig.webp')} alt="" />
              <img className="album-book__ornament album-book__lavender--sprig-left" src={decorPath('lavender-sprig.webp')} alt="" />
              <AlbumHeart className="album-book__heart--lavender-right" />
              <AlbumHeart className="album-book__heart--lavender-left" />
            </div>
          </div>
          <div className="book-page book-page--right album-book__under" inert={!secondVisible} aria-hidden={!secondVisible}>
            <PhotoPrint item={childhoodPhotos[2]} onOpen={onOpenPhoto} className="book-photo book-photo--first" />
            <PhotoPrint item={childhoodPhotos[3]} onOpen={onOpenPhoto} className="book-photo book-photo--second" />
          </div>
          <div className="book-page book-page--right album-book__leaf" inert={secondVisible} aria-hidden={secondVisible}>
            <PhotoPrint item={childhoodPhotos[0]} onOpen={onOpenPhoto} className="book-photo book-photo--first" />
            <PhotoPrint item={childhoodPhotos[1]} onOpen={onOpenPhoto} className="book-photo book-photo--second" />
          </div>
          <span className="album-book__binding" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

export function Album({ onBack, onOpenPhoto, onOpenSurprise, onToggleMusic, isMusicPlaying, audioMessage, modalOpen, onPhoneActivityChange }: AlbumProps) {
  const letterRef = useRef<HTMLElement>(null)
  const [letterVisible, setLetterVisible] = useState(false)
  const [letterUnderControls, setLetterUnderControls] = useState(false)

  useEffect(() => {
    const letter = letterRef.current
    if (!letter) return
    const observer = new IntersectionObserver(([entry]) => setLetterVisible(entry.isIntersecting))
    observer.observe(letter)
    let frame = 0
    const measurePaper = () => {
      frame = 0
      const paper = letter.querySelector('.final-letter__paper')?.getBoundingClientRect()
      setLetterUnderControls(Boolean(paper && paper.top < 76 && paper.bottom > 0))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measurePaper) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measurePaper()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className={`card-story${letterVisible && letterUnderControls ? ' card-story--reading-letter' : ''}`}>
      <button className="story-return" type="button" onClick={onBack} aria-label="Вернуться к обложке">←</button>
      <div className="story-paper">
        <AlbumSequence onOpenPhoto={onOpenPhoto} modalOpen={modalOpen} />

        <section className="collage collage--transition" aria-label="Тёплые моменты">
          <PaperConfetti placement="transition" />
          <span className="collage-note collage-note--transition">Моменты, которые хочется помнить <span className="collage-note__heart" aria-hidden="true">♡</span></span>
          {firstCollagePhotos.map((item, index) => <PhotoPrint key={item.id} item={item} onOpen={onOpenPhoto} className={`collage-photo collage-photo--slot-${index + 1}`} />)}
          {/* Декор первого коллажа Полины: букет стоит в свободном поле у снимка со львом, шары находятся справа от совместного фото; карточки и подпись не меняются. */}
          <img className="collage__accent collage__accent--lion-bouquet" src={decorPath('lavender-bouquet.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__accent collage__accent--friends-balloons" src={decorPath('balloons-group-provence.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__ribbon collage__ribbon--transition" src={decorPath('ribbon-long-lavender.webp')} alt="" aria-hidden="true" loading="lazy" />
        </section>

        {/* Телефон Полины разделяет два фотоколлажа и управляет звонком и мелодией без отдельного плеера. */}
        <VintageTelephone onActivityChange={onPhoneActivityChange} />

        <section className="collage collage--together" aria-label="Воспоминания вместе">
          <PaperConfetti placement="together" />
          {/* Подписи двух коллажей Полины: одинаковые небольшие рукописные сердечки завершают утверждённый текст, бумажные карточки остаются на прежних местах. */}
          <span className="collage-note collage-note--together">Маленькие радости большой жизни <span className="collage-note__heart" aria-hidden="true">♡</span></span>
          {secondCollagePhotos.map((item, index) => <PhotoPrint key={item.id} item={item} onOpen={onOpenPhoto} className={`collage-photo collage-photo--slot-${index + 1}`} />)}
          {/* Декор второго коллажа Полины: лента, шар и букет занимают свободные поля у снимков 17, 15 и 18; нижние лента с подарком остаются у снимка 08. */}
          <img className="collage__ribbon collage__ribbon--together" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__accent collage__accent--dog-balloon" src={decorPath('balloon-milk-provence.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__accent collage__accent--sea-bouquet" src={decorPath('lavender-bouquet.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__ribbon collage__ribbon--gift" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__gift" src={decorPath('gift-box-provence.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="collage__lavender" src={decorPath('lavender-composition.webp')} alt="" aria-hidden="true" loading="lazy" />
        </section>

        <PhotoSlider onOpenPhoto={onOpenPhoto} />
        <section className="final-letter" ref={letterRef} aria-label="Поздравительное письмо">
          <PaperConfetti placement="letter" />
          {/* У письма показывается снимок 04 с двумя женщинами; снимок 05 остаётся только в слайдере. */}
          <PhotoPrint item={photo('04')} onOpen={onOpenPhoto} className="final-letter__photo" />
          {/* Переход от слайдера к письму: прозрачная лаванда заполняет свободное поле справа от снимка, не закрывая лица и текст. */}
          <img className="final-letter__transition-lavender" src={decorPath('lavender-composition.webp')} alt="" aria-hidden="true" loading="lazy" />
          <article className="final-letter__paper">
            <span className="paper-tape final-letter__tape" aria-hidden="true" />
            {/* Письмо Полины: исходное разделение утверждённой редакции на абзацы и строки, две заключительные строки выделены тем же рукописным шрифтом, что и вступление. */}
            <div className="final-letter__text">{letterParagraphs.map((paragraph, index) => <p key={index} className={index === 5 ? 'final-letter__closing' : undefined}>{paragraph.split('\n').map((line, lineIndex) => <Fragment key={lineIndex}>{lineIndex > 0 && <br />}{line}</Fragment>)}</p>)}</div>
            <span className="final-letter__heart" aria-hidden="true">♡</span>
          </article>
          <img className="final-letter__ribbon" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="final-letter__lavender" src={decorPath('lavender-sprig.webp')} alt="" aria-hidden="true" loading="lazy" />
        </section>

        <section className="envelope-section" aria-label="Конверт-сюрприз">
          <PaperConfetti placement="envelope" />
          <p className="envelope-section__note">Открой конвертик&nbsp;♡</p>
          <svg className="envelope-section__arrow" viewBox="0 0 390 430" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="envelope-arrow-outline" x1="0" y1="145" x2="0" y2="214" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFCF5" stopOpacity="0" />
                <stop offset="1" stopColor="#FFFCF5" stopOpacity=".95" />
              </linearGradient>
            </defs>
            <path d="M75 78C20 101 18 164 62 193C87 210 116 214 139 232M139 232l-14-2M139 232l-5-13" fill="none" stroke="url(#envelope-arrow-outline)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M75 78C20 101 18 164 62 193C87 210 116 214 139 232M139 232l-14-2M139 232l-5-13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <img className="envelope-section__ribbon" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" loading="lazy" />
          <img className="envelope-section__gift" src={decorPath('gift-box-provence.webp')} alt="" aria-hidden="true" loading="lazy" />
          <button className="surprise-envelope" type="button" onClick={(event) => onOpenSurprise(event.currentTarget)} aria-label="Открыть сюрприз">
            <span className="surprise-envelope__art">
              <img className="surprise-envelope__image" src={decorPath('envelope-provence.webp')} width={925} height={620} alt="" aria-hidden="true" loading="lazy" />
              {/* Бечёвка конверта Полины: две тонкие линии проходят поверх бумаги и уходят под существующую сургучную печать; исходный прозрачный ассет и его декор сохранены. */}
              <svg className="surprise-envelope__vertical-string" viewBox="0 0 925 620" fill="none" aria-hidden="true" focusable="false">
                <path className="surprise-envelope__string-shadow" d="M419 71C420 153 429 244 438 313M451 460C455 492 460 523 464 551" />
                <path className="surprise-envelope__string-body" d="M419 71C420 153 429 244 438 313M451 460C455 492 460 523 464 551" />
                <path className="surprise-envelope__string-twist" d="M419 71C420 153 429 244 438 313M451 460C455 492 460 523 464 551" />
              </svg>
            </span>
          </button>
        </section>
      </div>

      {/* Круглая кнопка музыки закреплена справа внизу при любой прокрутке, включая письмо; её управление обеими песнями Полины сохранено. */}
      <div className="music-control">
        <button type="button" onClick={onToggleMusic} aria-label={isMusicPlaying ? 'Приостановить музыку' : 'Включить музыку'} title={isMusicPlaying ? 'Приостановить музыку' : 'Включить музыку'}>
          {isMusicPlaying ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5v17l14-8.5z" fill="currentColor" /></svg>}
        </button>
        {audioMessage && <span className="music-control__message" role="status">{audioMessage}</span>}
      </div>
    </main>
  )
}
