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
