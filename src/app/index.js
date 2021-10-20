const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const errHandler = require('./errHandler')
// const userRouter = require('../router/user.route')
// const goodsRouter = require('../router/goods.route')
const router = require('../router')

const app = new Koa()
app.use(koaBody({
  multipart: true,
  formidable: {
    //在配置选项option里，不推荐使用相对路径。
    // 在option里的相对路径，不是相对当前文件，而是在koaBody里处理的，相对process.cwd(),也就是说脚本在哪里执行。他最后在app里面执行，因此容易出错
    // uploadDir: '../upload'
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  }
}))
app.use(koaStatic(path.join(__dirname, '../upload')))
app.use(router.routes()).use(router.allowedMethods())
// app.use(userRouter.routes())
// app.use(goodsRouter.routes())
// 统一的错误处理,handler接收两个参数，一个error，一个ctx.handler后期也会非常庞大，我们再单独抽离一个文件
app.on('error', errHandler);
module.exports = app