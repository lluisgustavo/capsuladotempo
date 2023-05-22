'use client'

import { ChangeEvent, useState } from 'react'
import Image from 'next/image'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const type = files[0].type
    const previewURL = URL.createObjectURL(files[0])
    setPreview(previewURL)

    if (type.includes('image')) return setType('image')

    setType('video')
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="media"
        id="media"
        accept="image/*, video/*"
        className="invisible h-0 w-0"
      />

      {preview &&
        (type && type === 'image' ? (
          <Image
            src={preview}
            alt=""
            className="aspect-video w-full rounded-lg object-cover"
            width={500}
            height={500}
          />
        ) : (
          <video
            className="aspect-video w-full rounded-lg object-cover"
            src={preview}
            controls
          />
        ))}
    </>
  )
}
