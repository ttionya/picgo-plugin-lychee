export interface UserConfig {
  url: string
  token: string
  albumId?: string
  // Avoid uploading identical images within the same album.
  uniqueImage?: boolean
  // Avoiding duplicates requires recalculating file hashes, and large images may consume a significant amount of time.
  uniqueImageSizeLimit?: string
}
