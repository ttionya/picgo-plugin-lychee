export interface Locale {
  // uploader config
  UPLOADER_CONFIG_URL: string
  UPLOADER_CONFIG_TOKEN: string
  UPLOADER_CONFIG_ALBUM_ID: string
  UPLOADER_CONFIG_UNIQUE_IMAGE: string
  UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT: string

  // uploader config validate
  UPLOADER_CONFIG_URL_VALIDATE_EMPTY: string
  UPLOADER_CONFIG_TOKEN_VALIDATE_EMPTY: string

  // uploader config formatter
  UPLOADER_CONFIG_FORMATTER_INVALID: string
  UPLOADER_CONFIG_FORMATTER_RESULT_LOG: string
}

export type LocaleKey = keyof Locale
