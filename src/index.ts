import { PLUGIN_NAME, PLUGIN_DISPLAY } from './constants'
import { config } from './config'
import { uploader } from './uploader'
import { en, zhCN, zhTW } from './locale'
import type { PicGo, IPicGoPluginInterface } from 'picgo'

export = function (ctx: PicGo): IPicGoPluginInterface {
  const register = (): void => {
    ctx.i18n.addLocale('en', en)
    ctx.i18n.addLocale('zh-CN', zhCN)
    ctx.i18n.addLocale('zh-TW', zhTW)

    ctx.helper.uploader.register(PLUGIN_NAME, { name: PLUGIN_DISPLAY, handle: uploader, config })
  }

  return {
    register,
    config,
    uploader: PLUGIN_NAME,
  }
}
