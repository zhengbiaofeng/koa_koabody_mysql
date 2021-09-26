const Koa = require('koa')
const koaBody = require('koa-body')
const errHandler = require('./errHandler')
const userRouter = require('../router/user.route')

const app = new Koa()
app.use(koaBody())
app.use(userRouter.routes())
// 统一的错误处理,handler接收两个参数，一个error，一个ctx.handler后期也会非常庞大，我们再单独抽离一个文件
app.on('error', errHandler);
module.exports = app