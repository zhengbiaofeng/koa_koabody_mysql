# 一.项目初始化

## 1 npm初始化

```js
npm init -y
```

生成`package.json`文件：

- 记录项目的依赖

## 2 git初始化

```js
git init
```

生成`.git`隐藏文件夹，git的本地仓库

## 3 创建ReadMe文件

# 二.搭建项目

## 1 安装koa框架

```js
npm i koa
```

## 2 编写最基本的app

创建`src/main.js`

```javascript
const Koa = require('koa')

const app = new Koa()

app.use((ctx,next)=>{
    ctx.body = 'hello api'
})

app.listen(3000,()=>{
    console.log('server is running on http://localhost:3000')
})
```

## 3 测试

使用`node src/main.js`，就可以看到输出效果。

#  三.项目的基本优化

## 1 自动重启服务

安装nodemon工具

```js
npm i nodemon
```

编写package.json脚本

```js
 "scripts": {
    "dev": "nodemon ./src/main.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

执行`npm run dev`

## 2 读取配置文件

安装dotenv，读取根目录中.env文件将配置写到process.env中

```js
npm i dotenv
```

创建.env文件

```js
APP_PORT = 8000
```

创建src/config/config.default.js

```js
const dotenv = require('dotenv')

dotenv.config()
// console.log(process.env.APP_PORT)
module.exports = process.env
```

改写main.js

```js
const Koa = require('koa')
const {APP_PORT} = require('./config/config.default'
const app = new Koa()
app.use((ctx,next)=>{
    ctx.body = 'hello apggg'
})
app.listen(APP_PORT,()=>{
    console.log(`server is running on http://localhost:${APP_PORT}`)
})
```















