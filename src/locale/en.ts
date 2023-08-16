import type { Locale } from 'types/locale'

export const en: Locale = {
  UPLOADER_CONFIG_URL: 'Lychee Web URL',
  UPLOADER_CONFIG_TOKEN: 'Lychee API Token',
  UPLOADER_CONFIG_ALBUM_ID: 'Album ID',
  UPLOADER_CONFIG_UNIQUE_IMAGE: 'Avoid uploading duplicate images in the album',
  UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT:
    'Do not validate image duplicates if the image size exceeds this value',

  UPLOADER_CONFIG_URL_VALIDATE_EMPTY: 'Lychee Web URL cannot be empty',
  UPLOADER_CONFIG_TOKEN_VALIDATE_EMPTY: 'Lychee API Token cannot be empty',

  UPLOADER_CONFIG_FORMATTER_INVALID:
    'Plugin configuration is invalid (${configName}), please check the configuration file.',
  UPLOADER_CONFIG_FORMATTER_RESULT_LOG: 'Formatted config: `${config}`',

  UPLOADER_NO_INPUT: 'Missing input file',
}
