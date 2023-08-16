import type { Nullable } from 'types/utils'

export interface SizeVariantResource {
  url: Nullable<string>
  width: Nullable<number>
  height: Nullable<number>
  filesize: Nullable<number>
}

export interface Photo {
  id: string
  album_id: Nullable<string>
  title: string
  type: string
  checksum: string
  original_checksum: string
  size_variants: {
    original: Nullable<SizeVariantResource>
  }
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  title: string
  num_photos: number
  photos: Photo[]
  created_at: string
  updated_at: string
}
