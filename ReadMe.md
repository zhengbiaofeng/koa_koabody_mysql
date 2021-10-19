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

# 七.数据库操作

通过sequelize ORM数据库工具（基于promise的Node.js的ORM）

ORM：对象关系映射，面向对象的方式操作数据库

- 数据表映射一个类
- 数据表中的数据行对应一个对象
- 数据库的操作映射成对象的方法
- 数据表的字段映射成对象的属性

## 1 安装sequelize

```js
npm i mysql2 sequelize
```

## 2 安装数据库

src/db/seq.js

```js
const {
    Sequelize
} = require('sequelize')
const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB,
} = require('../config/config.default')

const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql'
})

seq.authenticate().then(() => {
    console.log('数据库链接成功')
}).catch((err) => {
    console.log('数据库链接失败', err)
})

module.exports = seq
```

## 3 编写配置文件

.env

```js
APP_PORT = 8000
MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = root
MYSQL_PWD = *******
MYSQL_DB = zdsc
```

## 4 数据库中创建表

创建zdsc数据库和zd_users:

![image-20210914152904445](/Users/fengzhizi/Library/Application Support/typora-user-images/image-20210914152904445.png)

表创建后，表格式和数据我们用代码自动插入。

## 5 用代码强制写入数据

拆分model层，新建src/model/user.model.js

```js
const {
    DataTypes
} = require('sequelize')
const seq = require('../db/seq')

// 创建模型 （Model zd_user -> zd_users）
const User = seq.define('zd_user', {
    // id 会被sequelize自动创建
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为管理员，0不是管理员，1是'
    }
})

// 模型同步，自动创建表,强制同步数据库
// User.sync({
//     force: true
// })
module.exports = User
```

表格式已经插入，通过ORM模型对应，接下来插入第一个用户数据，首先改写user.controller.js，用户注册成功会返回用户注册成功提示以及相应信息。

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
        ctx.body = {
            code: 0,
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name
            }
        }
    }
    async login(ctx, next) {
        ctx.body = '用户登陆成功'
    }
}

module.exports = new UserController()
```

改写src/service/user.service.js

```js
const User = require('../model/use.model')
class UserService {
    async createUser(user_name, password) {
        // 插入数据
        // await 表达式：promise对象成功的值
        const res = await User.create({
            user_name,
            password
        })
        console.log(res)
        return res.dataValues
    }
}
module.exports = new UserService()
```

最后，用postman调用该接口，插入数据

![image-20210914154539159](/Users/fengzhizi/Library/Application Support/typora-user-images/image-20210914154539159.png)

# 八. 数据校验

## 1 合法性和合理性

我们上面的代码，只保证了用户如果传递正确数据会返回注册成功，那么如果传递了重复数据或者没有传递必传项，后端也需要传递相对应的代码给前台去提示。

改写user.controller.js

```js
const {
    createUser,getUserInfo
} = require('../service/user.service')
class UserController {
    async register(ctx, next) {
        // 1、获取数据
        console.log(ctx.request.body)
        const {
            user_name,
            password
        } = ctx.request.body
        // 合法性
        if(!user_name || !password){
            console.error('用户名或密码为空',ctx.request.body)
            ctx.status = 400
            ctx.body = {
                code: '10001',
                message:'用户名或者密码为空',
                result:'',
            }
            return
        }
        // 合理性
        if(getUserInfo({user_name})){
            ctx.status = 409 // 表示冲突
            ctx.body = {
                code:'10002',
                message:'用户已经存在',
                result:''
            }
            return
        }
        // 2、操作数据库
        const res = await createUser(user_name, password)
        // 3、返回结果
        ctx.body = {
            code: 0,
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name
            }
        }
    }
    async login(ctx, next) {
        ctx.body = '用户登陆成功'
    }
}

module.exports = new UserController()
```

改写user.service.js

```js
const User = require('../model/use.model')
class UserService {
    async createUser(user_name, password) {
       // 同上...
    }
    async getUserInfo({id,user_name,password,is_admin}) {
        const whereOpt = {}
        id && Object.assign(whereOpt, {id})
        user_name && Object.assign(whereOpt, {user_name})
        password && Object.assign(whereOpt, {password})
        is_admin && Object.assign(whereOpt, {is_admin})

        const res = await User.findOne({
            attributes:['id','user_name','password','is_admin'],
            where:whereOpt
        })
        return res? res.dataValues: null
    }
}
module.exports = new UserService()
```

## 2 抽取数据校验中间件

use.controller.js是用来处理不同业务的，但是我们上面把数据校验写进去了，不符合我们的单一组件原则，因此我们做一个抽离，在一个地方统一规定数据校验的状态。

创建user.middleware.js

```js
const {
    getUserInfo
} = require('../service/user.service')
const userValidator = async (ctx, next) => {
    const {
        user_name,
        password
    } = ctx.request.body
    if (!user_name || !password) {
        console.error('用户名或密码为空', ctx.request.body)
        ctx.status = 400
        ctx.body = {
            code: '10001',
            message: '用户名或者密码为空',
            result: '',
        }
        return
    }
    await next()
}
const verifyUser = async (ctx, next) => {
    const {
        user_name,
        password
    } = ctx.request.body
    // 合理性
    if (await getUserInfo({
            user_name
        })) {
        ctx.status = 409 // 表示冲突
        ctx.body = {
            code: '10002',
            message: '用户已经存在',
            result: ''
        }
        return
    }
    await next()
}
module.exports = {
    userValidator,
    verifyUser
}
```

改写user.controller.js

```js
const {
    createUser,getUserInfo
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
        ctx.body = {
            code: 0,
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name
            }
        }
    }
    async login(ctx, next) {
        ctx.body = '用户登陆成功'
    }
}

module.exports = new UserController()
```

改写user.route.js，用户匹配到register路径时，会先经过两个校验器，验证合格才会进入控制器进行业务操作。

```js
const Router = require('koa-router')
const {userValidator, verifyUser} = require('../middleware/user.middleware')
const {
    register,
    login
} = require('../controller/user.controller')

const router = new Router({
    prefix: '/users'
})

// Get /user/  注册接口
router.post('/register', userValidator, verifyUser, register)
router.post('/login', login)

module.exports = router
```

## 3 统一抽取报错代码

错误类型是通用的，我们尽量把他们统一在一个单独的定义文件里。创建consitant/err.type.js

```js
module.exports = {
    userFormateError: {
        code: '10001',
        message: '用户名或者密码为空',
        result: '',
    },
    userAlreadyExited: {
        code: '10002',
        message: '用户已经存在',
        result: ''
    }
}
```

创建app/errHandler.js

```js
module.exports = (err, ctx) => {
    let status = 500
    switch (err.code) {
        case '10001':
            status = 400
            break
        case '10002':
            status = 409
            break
        default:
            status = 500
    }
    ctx.status = status
    ctx.body = err
}
```

改写app/index.js

```js
const Koa = require('koa')
const koaBody = require('koa-body')
const errHandler = require('./errHandler')
const userRouter = require('../router/user.route')

const app = new Koa()
app.use(koaBody())
app.use(userRouter.routes())
// 统一的错误处理,handler接收两个参数，一个error，一个ctx.handler后期也会非常庞大，因此单独抽离
app.on('error', errHandler);
module.exports = app
```



# 九. 加密

将密码保存到数据库之前，要对密码进行加密

## 1 安装bcryptjs

```js
npm i bcryptjs
```

## 2 拆分中间件

改写user.middleware.js

```js
const bcrypt = require('bcryptjs')

const bcryptPassword = async (ctx,next) =>{
  const {password} = ctx.request.body
  const slat = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, slat)
  ctx.request.body.password = hash
  await next()
}
```

## 3 在route中使用

改写user.route.js

```js
router.post('/register', userValidator, verifyUser, cryptPassword, register)
```

# 十. 验证登陆

用户登陆时，我们需要检验用户是否存在，密码是否正确。

## 1 改写登陆接口

改写user.route.js，在正式登陆前，判断是否为空（userValidator）,如果不为空，我们就要检验登陆的账号密码，写一个verifyLogin中间件

```js
router.post('/login', userValidator, verifyLogin, login)
```

## 2 检验账号密码

`user.middleware.js`中新增verifyLogin函数，做账号密码校验

```js
const verifyLogin = async (ctx,next) =>{
    // 1、判断用户是否存在（不存在：报错）
    const {user_name,password} = ctx.request.body
    try {
        const res = await getUserInfo({user_name})
        if(!res){
            console.error('用户名不存在',{user_name})
            ctx.app.emit('error',userDoesNotExist,ctx)
            return
        }
        // 2、判断密码是否正确（不正确：报错）
        if(!bcrypt.compareSync(password, res.password)){
            ctx.app.emit('error',invalidPassword,ctx)
            return
        }
    } catch (error) {
        console.error(error)
            ctx.app.emit('error',userLoginError,ctx)
    }
    await next()
}
```

## 3 新增三个报错规定

改写err.type.js

```js
 userDoesNotExist:{
        code:'10004',
        message:'用户不存在',
        result:''
    },
    userLoginError:{
        code:'10005',
        message:'登陆错误',
        result:''
    },
    invalidPassword:{
        code:'10006',
        message:'密码错误',
        result:''
    }
```

# 十一. 用户的认证

用户登录后，给用户颁发一个令牌token，用户在以后的每一次请求中都要携带这个令牌。我们选择使用jwt来制作token。它包括三部分构成`header`，`payload`，`signature`。（简介请看https://www.jianshu.com/p/576dbf44b2ae这篇文章）

## 1 颁发token

- 安装jsonwebtoken

```js
npm i jsonwebtoken
```

- 在控制器中改写login方法

```js
async login(ctx, next) {
        let {user_name} = ctx.request.body
        // 1. 获取用户信息（要在token的payload中，记录id，user_name, is_admin）
        try {
            const {password, ...res} = await getUserInfo({user_name})
            ctx.body = {
                code: 0,
                message: '用户登陆成功',
                result: {
                    token: jwt.sign(res, JWT_SECRET, {
                        expiresIn: '1d'
                    }),
                }
            }
        } catch (error) {
            console.error('用户登陆失败', error)
        }
    }
```

- 定义私钥

```js
JWT_SECRET = xzd
```

## 2 用户认证

- 创建auth中间件

```js
// auth.middleware.js
const jwt = require('jsonwebtoken')
const {
    JWT_SECRET
} = require('../config/config.default')
const {
    tokenExpiredError,
    invalidToken
} = require('../constant/err.type')
const auth = async (ctx, next) => {
    const {
        authorization
    } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    try {
        const user = jwt.verify(token, JWT_SECRET)
        ctx.state.user = user
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token 已经过期', err)
                return ctx.app.emit('error', tokenExpiredError, ctx)
            case 'JsonWebTokenError':
                console.error('无效的token', err)
                return ctx.app.emit('error', invalidToken, ctx)
        }
    }
    await next()
}

module.exports = {
    auth
}
```

- 改写router

```js
// 修改密码接口
router.patch('/', auth, (ctx, next) => {
  console.log(ctx.state.user)
  ctx.body = '修改密码成功'
})
```













