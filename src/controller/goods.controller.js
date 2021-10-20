const { unSupportedFileType } = require('../constant/err.type')
const path = require('path')
class GoodsController {
    async upload (ctx, next) {
        const { file } = ctx.request.files
        const fileTypes = ['image/jpeg', 'image/png']
        if (file) {
            if (!fileTypes.includes(file.type)) {
                return ctx.app.emit('error', unSupportedFileType, ctx)
            }
            ctx.body = {
                code: 0,
                message: '商品上传成功',
                result: {
                    goods_img: path.basename(file.path),
                }
            }
        } else {
            return ctx.app.emit('error', fileUploadError, ctx)
        }
    }
}

module.exports = new GoodsController()