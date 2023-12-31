/* eslint-disable @typescript-eslint/member-ordering */

import { Buffer } from 'buffer'
import crypto from 'crypto'
import FormData from 'form-data'
import { CONFIG_KEY, IMAGE_HASH_TYPE } from './constants'
import { formatUserConfig } from './config'
import type { IPicGo, IReqOptionsWithBodyResOnly, IImgInfo } from 'picgo'
import type { FormattedUserConfig } from 'types/config'
import type { SizeVariantResource, Photo, Album } from 'types/lychee'
import type { LocaleKey } from 'types/locale'

class UploaderUtils {
  public userConfig: FormattedUserConfig

  private ctx: IPicGo

  private imageHashMap = new Map<string, { url?: SizeVariantResource['url'] }>()

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

  /**
   * create normal tasks
   */
  public async createNormalTasks(outputs: IImgInfo[]): Promise<void> {
    await Promise.all(outputs.map((imageInfo) => this.createNormalTask(imageInfo)))
  }

  private async createNormalTask(imageInfo: IImgInfo): Promise<void> {
    const uploadedPhotoData = await this.uploadPhoto(imageInfo, this.userConfig.albumId)

    // only new images will return image information
    if (uploadedPhotoData.size_variants.original?.url) {
      return this.setImageInfo(imageInfo, uploadedPhotoData.size_variants.original?.url)
    }

    // get photo data by photoId
    const photoData = await this.getPhotoById(uploadedPhotoData.id)

    return this.setImageInfo(imageInfo, photoData.size_variants.original?.url)
  }

  /**
   * create unique tasks
   */
  public async createUniqueTasks(outputs: IImgInfo[]): Promise<void> {
    await this.preUniqueTask(outputs)

    await Promise.all(outputs.map((imageInfo) => this.createUniqueTask(imageInfo)))

    await this.postUniqueTask(outputs)
  }

  private async preUniqueTask(outputs: IImgInfo[]): Promise<void> {
    const albumData = await this.getAlbumById(this.userConfig.albumId)

    albumData.photos.forEach((photo) => {
      this.imageHashMap.set(photo.original_checksum, { url: photo.size_variants.original?.url })
    })

    outputs.forEach((imageInfo) => {
      imageInfo['checksum'] = this.getImageHash(imageInfo)
    })
  }

  private async createUniqueTask(imageInfo: IImgInfo): Promise<void> {
    const imageHash: string = imageInfo['checksum']
    const tmpImgUrl: { url?: SizeVariantResource['url'] } = { url: null }

    if (imageHash) {
      if (this.imageHashMap.has(imageHash)) {
        imageInfo['tmpImgUrl'] = this.imageHashMap.get(imageHash)

        this.ctx.log.info(
          this.ctx.i18n.translate<LocaleKey>('UPLOADER_UPLOAD_UNIQUE_LOG', {
            filename: imageInfo.fileName || '',
          })
        )

        return
      }

      this.imageHashMap.set(imageHash, (imageInfo['tmpImgUrl'] = tmpImgUrl))
    }

    await this.createNormalTask(imageInfo)

    tmpImgUrl.url = imageInfo['imgUrl']?.slice(this.userConfig.url.length + 1)
  }

  private async postUniqueTask(outputs: IImgInfo[]): Promise<void> {
    outputs.forEach((imageInfo) => this.setImageInfo(imageInfo, imageInfo['tmpImgUrl'].url))
  }

  private getImageHash(imageInfo: IImgInfo): string {
    const size = imageInfo.buffer!.byteLength

    // if the image size exceeds the limit, the hash won't be computed
    if (size > this.userConfig.uniqueImageSizeLimit) {
      return ''
    }

    return crypto.createHash(IMAGE_HASH_TYPE).update(imageInfo.buffer!).digest('hex').toLowerCase()
  }

  private setImageInfo(imageInfo: IImgInfo, imageUrl?: SizeVariantResource['url']): void {
    const url = imageUrl ? `${this.userConfig.url}/${imageUrl}` : ''

    imageInfo['imgUrl'] = url
    imageInfo['url'] = url
  }

  private async uploadPhoto(imageInfo: IImgInfo, albumId: string): Promise<Photo> {
    const formData = new FormData()

    formData.append('albumID', albumId)
    formData.append('file', imageInfo.buffer, imageInfo.fileName)

    this.ctx.log.info(
      this.ctx.i18n.translate<LocaleKey>('UPLOADER_UPLOAD_IMAGE_LOG', {
        filename: imageInfo.fileName || '',
        checksum: imageInfo['checksum'] || 'empty',
        size: `${imageInfo.buffer!.byteLength}`,
        albumId,
      })
    )

    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Photo::add',
      data: formData,
    })
  }

  private async getPhotoById(photoId: string): Promise<Photo> {
    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Photo::get',
      data: {
        photoID: photoId,
      },
    })
  }

  private async getAlbumById(albumId: string): Promise<Album> {
    return this.ctx.request({
      ...this.globalRequestConfig,
      url: 'Album::get',
      data: {
        albumID: albumId,
      },
    })
  }

  private get globalRequestConfig(): IReqOptionsWithBodyResOnly {
    return {
      baseURL: `${this.userConfig.url}/api/`,
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
  const outputs = ctx.output.filter((imageInfo) => {
    // if only base64 is available without a buffer, then convert the base64 to a buffer
    if (!imageInfo.buffer?.byteLength && imageInfo.base64Image) {
      imageInfo.buffer = Buffer.from(imageInfo.base64Image, 'base64')
    }

    const valid = !!imageInfo.buffer?.byteLength

    if (!valid) {
      ctx.log.warn(
        ctx.i18n.translate<LocaleKey>('UPLOADER_INVALID_INPUT', {
          filename: imageInfo.fileName || '',
        })
      )
    }

    return valid
  })

  if (!outputs.length) {
    const errorMessage = ctx.i18n.translate<LocaleKey>('UPLOADER_NO_INPUT')

    ctx.log.error(errorMessage)

    throw new Error(errorMessage)
  }

  try {
    if (!uploaderUtils.userConfig.uniqueImage) {
      await uploaderUtils.createNormalTasks(outputs)
    } else {
      await uploaderUtils.createUniqueTasks(outputs)
    }

    outputs.forEach((imageInfo) => {
      ctx.log.info(
        ctx.i18n.translate<LocaleKey>('UPLOADER_UPLOAD_RESULT_LOG', {
          filename: imageInfo.fileName || '',
          url: imageInfo.imgUrl || '',
        })
      )
    })
  } catch (err: unknown) {
    ctx.log.error(ctx.i18n.translate<LocaleKey>('UPLOADER_FAILED'))
    ctx.log.error(err as Error)

    ctx.emit('notification', {
      title: ctx.i18n.translate<LocaleKey>('UPLOADER_FAILED_TITLE_NOTIFY'),
      body: ctx.i18n.translate<LocaleKey>('UPLOADER_FAILED_BODY_NOTIFY'),
      text: '',
    })

    throw err
  }
}
