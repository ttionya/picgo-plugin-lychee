import { CONFIG_KEY, DEFAULT_ALBUM_NAME } from './constants'
import type { IPicGo, IPluginConfig } from 'picgo'
import type { UserConfig } from 'types/config'
import type { LocaleKey } from 'types/locale'

export const config = (ctx: IPicGo): IPluginConfig[] => {
  const defaultUserConfig: UserConfig = {
    url: '',
    token: '',
    albumId: DEFAULT_ALBUM_NAME,
    uniqueImage: false,
    uniqueImageSizeLimit: '100m',
  }
  const userConfig: UserConfig = {
    ...defaultUserConfig,
    ...ctx.getConfig<IPluginConfig>(CONFIG_KEY),
  }

  return [
    {
      name: 'url',
      type: 'input',
      default: userConfig.url,
      required: true,
      get message(): string {
        return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_URL')
      },
      validate: (input: string): string | true => {
        if (input.trim() === '') {
          return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_URL_VALIDATE_EMPTY')
        }
        return true
      },
    },
    {
      name: 'token',
      type: 'password',
      default: userConfig.token,
      required: true,
      get message(): string {
        return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_TOKEN')
      },
      validate: (input: string): string | true => {
        if (input.trim() === '') {
          return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_TOKEN_VALIDATE_EMPTY')
        }
        return true
      },
    },
    {
      name: 'albumId',
      type: 'input',
      default: userConfig.albumId,
      required: false,
      get message(): string {
        return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_ALBUM_ID')
      },
    },
    {
      name: 'uniqueImage',
      type: 'confirm',
      default: userConfig.uniqueImage,
      required: false,
      get message(): string {
        return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_UNIQUE_IMAGE')
      },
    },
    {
      name: 'uniqueImageSizeLimit',
      type: 'input',
      default: userConfig.uniqueImageSizeLimit,
      required: false,
      get message(): string {
        return ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_UNIQUE_IMAGE_SIZE_LIMIT')
      },
      when: (answer: any) => answer.uniqueImage,
    },
  ]
}
