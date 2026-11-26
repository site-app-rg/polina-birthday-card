import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type AlbumScrollHintProps = {
  sectionRef: RefObject<HTMLElement | null>
  modalOpen: boolean
}

export function AlbumScrollHint({ sectionRef, modalOpen }: AlbumScrollHintProps) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const nextSection = section.nextElementSibling
    let frame = 0
    const measure = () => {
      frame = 0
      const album = section.getBoundingClientRect()
      const nextTop = nextSection?.getBoundingClientRect().top ?? album.bottom
      // Keep the cue through both spreads, until the next section enters the viewport.
      setInView(album.top < window.innerHeight && album.bottom > 0 && nextTop >= window.innerHeight)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(section)
    if (nextSection) observer.observe(nextSection)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sectionRef])

  if (modalOpen) return null
  return <div className={`album-scroll-hint${inView ? ' is-visible' : ''}`} aria-hidden="true">
    <svg className="album-scroll-hint__arrow" viewBox="0 0 48 72" fill="none" aria-hidden="true"><path d="M24 6v58M11 51l13 13 13-13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
}
