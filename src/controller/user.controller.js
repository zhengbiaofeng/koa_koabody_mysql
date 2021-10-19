const jwt = require('jsonwebtoken')
const {
    JWT_SECRET
} = require('../config/config.default')
const {
    createUser,
    getUserInfo,
    updateById
} = require('../service/user.service')
const {
    userRegisterError
} = require('../constant/err.type')

class UserController {
    // 注册接口
    async register(ctx, next) {
        // 1、获取数据
        console.log(ctx.request.body)
        const {
            user_name,
            password
        } = ctx.request.body

        // 2、操作数据库

        try {
            const res = await createUser(user_name, password)
            ctx.body = {
                code: 0,
                message: '用户注册成功',
                result: {
                    id: res.id,
                    user_name: res.user_name
                }
            }

        } catch (error) {
            console.log('error', error)
            ctx.app.emit('error', userRegisterError)
        }
        // 3、返回结果

    }
    // 登录接口
    async login(ctx, next) {
        let {
            user_name
        } = ctx.request.body
        // 1. 获取用户信息（要在token的payload中，记录id，user_name, is_admin）
        try {
            const {
                password,
                ...res
            } = await getUserInfo({
                user_name
            })
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
        // ctx.body = `欢迎回来，${user_name}`
    }
    //修改密码接口
    async changePassword(ctx, next) {
        // 1.获取数据
        const id = ctx.state.user.id
        const password = ctx.request.body.password
        console.log(id, password)
        // 2.更新数据库
        if (await updateById({
                id,
                password
            })) {
            ctx.body = {
                code: 0,
                message: '修改密码成功',
                result: ''
            }
        } else {
            ctx.body = {
                code: '10007',
                // message:'修改密码失败',
                result: ''
            }
        }
        // 3.返回结果
    }
}

module.exports = new UserController()