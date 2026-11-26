import { mediaPath } from '../data/album'
import { PaperConfetti } from './PaperConfetti'

const decorPath = (filename: string) => `${import.meta.env.BASE_URL}decor/${filename}`

export function CardCover({ onOpen }: { onOpen: () => void }) {
  return (
    <main className="card-cover">
      <div className="cover-composition">
        <PaperConfetti placement="cover" />
        {/* Декор обложки Полины: прозрачная лаванда и утверждённые шары заменяют прежние изображения с бумажной подложкой; открытие открытки остаётся прежним. */}
        <img className="cover-decor cover-decor--lavender-sprig" src={decorPath('lavender-sprig.webp')} alt="" aria-hidden="true" />
        <img className="cover-decor cover-decor--lavender-composition" src={decorPath('lavender-composition.webp')} alt="" aria-hidden="true" />
        <img className="cover-decor cover-decor--balloon" src={decorPath('balloon-milk-provence.webp')} alt="" aria-hidden="true" />
        <img className="cover-decor cover-decor--balloons" src={decorPath('balloons-group-provence.webp')} alt="" aria-hidden="true" />
        <img className="cover-decor cover-decor--ribbon-left" src={decorPath('ribbon-long-lavender.webp')} alt="" aria-hidden="true" />
        <img className="cover-decor cover-decor--ribbon-right" src={decorPath('ribbon-curl-lavender.webp')} alt="" aria-hidden="true" />
        <figure className="cover-polaroid">
          <img className="cover-polaroid__pushpin" src={decorPath('lavender-pushpin.svg')} alt="" aria-hidden="true" />
          {/* Фото обложки Полины: отдельная копия снимка 16 обрезана только по чёрным полосам; исходник и прежнее фото обложки остаются в галерее. */}
          <img className="cover-polaroid__portrait" src={mediaPath('polina-16-cover.jpg')} alt="Полина" />
          <figcaption>♡ Полина ♡</figcaption>
        </figure>
        <div className="cover-copy">
          <h1>С днём<br />рождения!</h1>
          <span className="cover-brush" aria-hidden="true">
            <svg className="cover-brush__paint" viewBox="0 0 290 54" focusable="false">
              <path d="M9 29L46 20 40 25 108 11 103 16 179 7 171 12 267 3 261 10 285 9 274 18 283 21 244 28 250 31 174 37 180 40 94 46 103 41 23 51 29 44 4 46 17 37 7 37Z" fill="#B5A3C7" opacity=".64" />
              <path d="M23 37Q153 12 276 13M34 44Q158 23 265 22" fill="none" stroke="#FFFCF5" strokeWidth="1.5" opacity=".5" />
            </svg>
          </span>
          <button className="cover-open" type="button" onClick={onOpen}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6.5h18v12H3zM3.5 7l8.5 7 8.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            <span>Открыть поздравление</span>
          </button>
        </div>
        <img className="cover-decor cover-decor--gift" src={decorPath('gift-box-provence.webp')} alt="" aria-hidden="true" />
      </div>
    </main>
  )
}
