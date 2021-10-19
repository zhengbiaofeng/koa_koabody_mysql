const Router = require('koa-router')
const {
    userValidator,
    verifyUser,
    verifyLogin,
    cryptPassword
} = require('../middleware/user.middleware')
const {
    auth
} = require('../middleware/auth.middleware')
const {
    register,
    login,
    changePassword
} = require('../controller/user.controller')

const router = new Router({
    prefix: '/users'
})

// Get /user/  注册接口
router.post('/register', userValidator, verifyUser, cryptPassword, register)
router.post('/login', userValidator, verifyLogin, login)
router.patch('/', auth, cryptPassword, changePassword)

module.exports = router