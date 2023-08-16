import type { Locale } from 'types/locale'

export const zhTW: Locale = {
  UPLOADER_CONFIG_URL: 'Lychee 網頁地址',
  UPLOADER_CONFIG_TOKEN: 'Lychee API Token',
  UPLOADER_CONFIG_ALBUM_ID: '相簿編號',
  UPLOADER_CONFIG_UNIQUE_IMAGE: '避免在相簿中上傳重複圖片',
  UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT: '若圖片大小超過該值則不驗證圖片是否重複',

  UPLOADER_CONFIG_URL_VALIDATE_EMPTY: 'Lychee 網頁地址不能為空',
  UPLOADER_CONFIG_TOKEN_VALIDATE_EMPTY: 'Lychee API Token 不能為空',

  UPLOADER_CONFIG_FORMATTER_INVALID: '插件配置不合法 (${configName})，請檢查配置檔案。',
  UPLOADER_CONFIG_FORMATTER_RESULT_LOG: '格式化後的配置：`${config}`',

  UPLOADER_NO_INPUT: '缺少輸入文件',
}
