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