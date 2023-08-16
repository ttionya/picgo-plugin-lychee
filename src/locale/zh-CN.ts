import type { Locale } from 'types/locale'

export const zhCN: Locale = {
  UPLOADER_CONFIG_URL: 'Lychee 网页地址',
  UPLOADER_CONFIG_TOKEN: 'Lychee API Token',
  UPLOADER_CONFIG_ALBUM_ID: '相册编号',
  UPLOADER_CONFIG_UNIQUE_IMAGE: '避免在相册中上传重复图片',
  UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT: '最大避免上传重复图片的大小',

  UPLOADER_CONFIG_URL_VALIDATE_EMPTY: 'Lychee 网页地址不能为空',
  UPLOADER_CONFIG_TOKEN_VALIDATE_EMPTY: 'Lychee API Token 不能为空',

  UPLOADER_CONFIG_FORMATTER_INVALID: '插件配置不合法 (${configName})，请检查配置文件。',
  UPLOADER_CONFIG_FORMATTER_RESULT_LOG: '格式化后的配置：`${config}`',

  UPLOADER_NO_INPUT: '缺少输入文件',
}
