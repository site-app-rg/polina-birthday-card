import type { ReactNode } from 'react'

type PhotoCrop = {
  position?: string
  scale?: number
}

type PolaroidPhotoProps = {
  src: string
  alt: string
  caption: ReactNode
  crop?: PhotoCrop
}

export function PolaroidPhoto({
  src,
  alt,
  caption,
  crop = { position: 'center', scale: 1 },
}: PolaroidPhotoProps) {
  return (
    <figure className="polaroid">
      <div className="polaroid__photo">
        <img
          src={src}
          alt={alt}
          style={{
            objectPosition: crop.position ?? 'center',
            transform: `scale(${crop.scale ?? 1})`,
          }}
          fetchPriority="high"
        />
      </div>
      <figcaption className="polaroid__caption">{caption}</figcaption>
    </figure>
  )
}
