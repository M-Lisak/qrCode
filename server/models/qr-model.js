const sequelize = require('../bd')
const { DataTypes } = require('sequelize')

const QRModel = sequelize.define('qr', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, defaultValue: '' },
    originalUrl: { type: DataTypes.TEXT, defaultValue: 'http://192.168.0.111:5000/' },
    shortUrl: { type: DataTypes.TEXT, unique: true },
}, {timestamps: false, createdAt: false, updatedAt: false})

module.exports = {
    QRModel
}