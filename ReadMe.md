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

使用`node src/main.js`，就可以看到输出效果





