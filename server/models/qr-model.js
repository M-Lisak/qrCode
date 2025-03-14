const sequelize = require('../bd')
const { DataTypes } = require('sequelize')

const QRModel = sequelize.define('qr', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, defaultValue: '' },
    originalUrl: { type: DataTypes.TEXT, defaultValue: 'http://45.131.99.100:5001/' },
    shortUrl: { type: DataTypes.TEXT, unique: true },
}, {timestamps: false, createdAt: false, updatedAt: false})

module.exports = {
    QRModel
}