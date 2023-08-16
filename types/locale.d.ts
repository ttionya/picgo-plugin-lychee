export interface Locale {
  // uploader config
  UPLOADER_CONFIG_URL: string
  UPLOADER_CONFIG_TOKEN: string
  UPLOADER_CONFIG_ALBUM_ID: string
  UPLOADER_CONFIG_UNIQUE_IMAGE: string
  UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT: string
}

export type LocaleKey = keyof Locale
