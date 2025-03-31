const sequelize = require('../bd')
const { DataTypes } = require('sequelize')

const UserModel = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    tgId: { type: DataTypes.STRING },
    notifications: {type: DataTypes.BOOLEAN, defaultValue: false },
}, {timestamps: false, createdAt: false, updatedAt: false})

module.exports = {
    UserModel
}