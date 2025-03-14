const sequelize = require('../bd')
const { DataTypes } = require('sequelize')

const TokenModel = sequelize.define('token', {
    refreshToken: { type: DataTypes.TEXT, allowNull: false },
}, {timestamps: false, createdAt: false, updatedAt: false})

module.exports = {
    TokenModel
}