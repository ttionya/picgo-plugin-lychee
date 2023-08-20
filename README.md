# picgo-plugin-lychee

[![npm](https://img.shields.io/npm/v/picgo-plugin-lychee?label=NPM&logo=npm)](https://www.npmjs.com/package/picgo-plugin-lychee) [![npm](https://img.shields.io/npm/dm/picgo-plugin-lychee?label=Downloads&logo=npm)](https://www.npmjs.com/package/picgo-plugin-lychee) [![npm](https://img.shields.io/npm/l/picgo-plugin-lychee?label=License&logo=npm)](https://github.com/ttionya/picgo-plugin-lychee/blob/master/LICENSE)

[PicGo](https://github.com/PicGo/PicGo-Core) plugin for uploading to [Lychee](https://github.com/LycheeOrg/Lychee).

<br>

## Install

- for GUI: search `lychee`
- for Core: run `picgo add lychee`

<br>

## Configuration

`picgo set uploader lychee`

### `url`

- `Required`
- Example: `https://mylychee.com`

Lychee web URL, including the protocol.

### `token`

- `Required`
- Example: `xxxxxxxxxxxxx`

Lychee API token.

You can generate an API Token from the settings.

![](https://raw.githubusercontent.com/ttionya/picgo-plugin-lychee/master/assets/20230820144556.png)

### `albumId`

- Default: `unsorted`
- Example: `mTmo_j9SVEie3ETcCMY3YruI`

Album ID, you can only use regular `Album`, **not** `Tag Album`.

After entering the album, you can find the album ID in the URL.

![](https://raw.githubusercontent.com/ttionya/picgo-plugin-lychee/master/assets/20230820145149.png)

### `uniqueImage`

- Default: `false`

If you want to ensure that identical images in the album are unique, you can enable this option.

Enabling this option will result in additional requests and hash calculations during upload, which may consume more network and system resources.

### `uniqueImageSizeLimit`

- Default: `100m`
- Example: `1g` `500k` `1048576` `1m`

This setting only takes effect when `uniqueImage` is enabled.

It further prevents excessive system resource usage when calculating hashes for large images. Images larger than this value will no longer be guaranteed to be unique in the album.

<br>

## LICENSE

MIT
