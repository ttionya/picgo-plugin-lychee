# picgo-plugin-lychee

[PicGo](https://github.com/PicGo/PicGo-Core) [Lychee](https://github.com/LycheeOrg/Lychee) 上传插件。

<br>

## 安装

- 对于 GUI: 搜索 `lychee`
- 对于 Core: 运行 `picgo add lychee`

<br>

## 配置

`picgo set uploader lychee`

### `url`

- `Required`
- 示例: `https://mylychee.com`

Lychee 网页地址，需包含协议。

### `token`

- `Required`
- Example: `xxxxxxxxxxxxx`

Lychee API token.

你可以在设置中生成 API Token。

![](assets/20230820144556.png)

### `albumId`

- Default: `unsorted`
- Example: `mTmo_j9SVEie3ETcCMY3YruI`

Album ID, you can only use regular `Album`, **not** `Tag Album`.

After entering the album, you can find the album ID in the URL.

![](assets/20230820145149.png)

### `uniqueImage`

- Default: `false`

如果你想确保相册中相同的图像是唯一的，则可以启用此选项。

启用此选项将导致上传过程中产生额外的请求和哈希计算，这可能会消耗更多的网络和系统资源。

### `uniqueImageSizeLimit`

- Default: `100m`
- Example: `1g` `500k` `1048576` `1m`

此设置仅在启用 `uniqueImage` 时生效。

它进一步防止在计算大图像的哈希值时过度使用系统资源。大于此值的图像将不再保证在相册中是唯一的。

<br>

## LICENSE

MIT