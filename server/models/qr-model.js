const sequelize = require('../bd')
const { DataTypes } = require('sequelize')

const QRModel = sequelize.define('qr', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, defaultValue: '' },
    originalUrl: { type: DataTypes.TEXT, defaultValue: 'https://qr-love.ru' },
    shortUrl: { type: DataTypes.TEXT, unique: true },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {timestamps: false, createdAt: false, updatedAt: false})

module.exports = {
    QRModel
}