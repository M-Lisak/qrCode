const jwt = require('jsonwebtoken')
const {TokenModel} = require('../models/token-model')

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({where: {userId}})

        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await TokenModel.create({userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.destroy({where: {refreshToken}})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({where: {refreshToken}})
        return tokenData
    }
}

module.exports = new TokenService()