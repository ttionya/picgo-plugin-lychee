import crypto from 'crypto'
import FormData from 'form-data'
import { CONFIG_KEY, DEFAULT_ALBUM_NAME, IMAGE_HASH_TYPE } from './constants'
import { formatUserConfig } from './config'
import type { IPicGo, IReqOptionsWithBodyResOnly, IImgInfo } from 'picgo'
import type { FormattedUserConfig } from 'types/config'
import type { Photo, Album } from 'types/lychee'
import type { LocaleKey } from 'types/locale'

class UploaderUtils {
  public userConfig: FormattedUserConfig

  private ctx: IPicGo

  constructor(ctx: IPicGo) {
    this.ctx = ctx

    this.userConfig = formatUserConfig(ctx, ctx.getConfig(CONFIG_KEY))

    ctx.log.info(
      ctx.i18n.translate<LocaleKey>('UPLOADER_CONFIG_FORMATTER_RESULT_LOG', {
        config: JSON.stringify({
          ...this.userConfig,
          token: `<length ${this.userConfig.token.length}>`,
        }),
      })
    )
  }

  public setOutput(imageInfo: IImgInfo, url?: string | null): void {
    if (!url) return

    const fullUrl = this.userConfig.url + '/' + url

    imageInfo.imgUrl = fullUrl
    imageInfo['url'] = fullUrl
  }

  public getImageHash(imageInfo: IImgInfo): string {
    if (!imageInfo.buffer) {
      // TODO log pass calculate hash
      this.ctx.log.warn('')

      return ''
    }

    // TODO need use uniqueImageSizeLimit
    return crypto.createHash(IMAGE_HASH_TYPE).update(imageInfo.buffer).digest('hex').toLowerCase()
  }

  public async uploadPhoto(imageInfo: IImgInfo, albumId?: string): Promise<Photo> {
    const formData = new FormData()

    formData.append('albumID', albumId || DEFAULT_ALBUM_NAME)
    formData.append('file', imageInfo.buffer, imageInfo.fileName)

    // TODO log upload filename size to album
    // this.ctx.log.info()

    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Photo::add',
      data: formData,
    })
  }

  public async getPhotoById(photoId: string): Promise<Photo> {
    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Photo::get',
      data: {
        photoID: photoId,
      },
    })
  }

  public async getAlbumById(albumId?: string): Promise<Album> {
    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Album::get',
      data: {
        albumID: albumId || DEFAULT_ALBUM_NAME,
      },
    })
  }

  private get globalRequestConfig(): IReqOptionsWithBodyResOnly {
    return {
      baseURL: `${this.userConfig.url.replace(/\/*$/, '')}/api/`,
      headers: {
        Authorization: this.userConfig.token,
      },
      method: 'POST',
      responseType: 'json',
    }
  }
}

export async function uploader(ctx: IPicGo): Promise<void> {
  const uploaderUtils = new UploaderUtils(ctx)
  const outputs = ctx.output

  if (!outputs.length) {
    throw new Error('no input')
  }

  // console.log(uploaderUtils.userConfig)

  try {
    // TODO cache album photos list and check outputs has same image
    // unique
    // if (uploaderUtils.userConfig.uniqueImage) {
    //   const hash = uploaderUtils.getImageHash(imageInfo)
    //
    //   // only
    //   if (hash) {
    //     const albumData = await uploaderUtils.getAlbumById(uploaderUtils.userConfig.albumId)
    //     const findExistedImage = albumData.photos.find((photo) => photo.original_checksum === hash)
    //
    //     console.log(albumData)
    //
    //     if (findExistedImage) {
    //       return uploaderUtils.setOutput(findExistedImage.size_variants.original?.url)
    //     }
    //   }
    // }

    await Promise.all(
      outputs.map(async (imageInfo) => {
        // upload
        const uploadedPhotoData = await uploaderUtils.uploadPhoto(
          imageInfo,
          uploaderUtils.userConfig.albumId
        )

        console.log(uploadedPhotoData)

        if (uploadedPhotoData.size_variants.original?.url) {
          return uploaderUtils.setOutput(imageInfo, uploadedPhotoData.size_variants.original?.url)
        }

        // get photo data by photoId
        const photoData = await uploaderUtils.getPhotoById(uploadedPhotoData.id)

        return uploaderUtils.setOutput(imageInfo, photoData.size_variants.original?.url)
      })
    )
  } catch (err: unknown) {
    // TODO
    ctx.log.error('error')
    ctx.log.error(err as Error)
    ctx.emit('notification', {
      title: 'upload failed',
      body: 'Please check the log',
      text: '',
    })

    throw err
  }
}
