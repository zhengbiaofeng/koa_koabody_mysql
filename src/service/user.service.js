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