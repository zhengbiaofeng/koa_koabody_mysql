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
npm i nodemon -D
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

# 四. 添加路由

路由：根据不同的url，调用相应的处理函数

## 1 安装koa-router

```js
npm i koa-router
```

步骤：

1. 导入包
2. 实例化对象
3. 编写路由
4. 注册中间件

## 2 编写路由

创建src/router目录，编写user.route.js

```js
const Router = require('koa-router')

const router = new Router({
    prefix: '/users'
})

// Get /user/
router.get('/', (ctx, next) => {
    ctx.body = 'hello users'
})

module.exports = router
```

## 3改写main.js

```js
const userRouter = require('./router/user.route')

app.use(userRouter.routes())
```

# 五. 目录结构优化

## 1 将http服务和app业务拆分

创建src/app/index.js

```js
const Koa = require('koa')
const userRouter = require('../router/user.route')

const app = new Koa()
app.use(userRouter.routes())
module.exports = app
```

## 2 将路由和控制器拆分

路由：解析URL，并将URL和对应的控制器一一对应

控制器：处理不同的业务

改写user.route.js

```js
const Router = require('koa-router')
const {
    register,
    login
} = require('../controller/user.controller')

const router = new Router({
    prefix: '/users'
})

// Get /user/  注册接口
router.post('/register', register)
router.post('/login', login)

module.exports = router
```

创建controller/user.controller.js

```js
class UserController {
    async register(ctx, next) {
        ctx.body = '用户注册成功'
    }
    async login(ctx,next){
        ctx.body = '用户登陆成功'
    }
}

module.exports = new UserController()
```



#  六.解析body

## 1 安装koa-body

```js
npm i koa-body
```

## 2 注册中间件

改写app/index.js

```js
const Koa = require('koa')
//1 引入
const koaBody = require('koa-body')
const userRouter = require('../router/user.route')

const app = new Koa()
// 2 注册
app.use(koaBody())
app.use(userRouter.routes())
module.exports = app
```

## 3 解析请求数据

改写user.controller.js

```js
const {
    createUser
} = require('../service/user.service')
class UserController {
    async register(ctx, next) {
        // 1、获取数据
        console.log(ctx.request.body)
        const {
            user_name,
            password
        } = ctx.request.body
        // 2、操作数据库
        const res = await createUser(user_name, password)
        // 3、返回结果
        ctx.body = res
    }
    async login(ctx, next) {
        ctx.body = '用户登陆成功'
    }
}

module.exports = new UserController()
```

## 4 拆分service层

service主要做数据库处理

创建src/service/user.service.js

```js
class UserService {
    async createUser(user_name, password) {
        // todo:写入数据库
        return '写入数据库成功'
    }
}
module.exports = new UserService()
```





















