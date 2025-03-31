const ApiError = require('../exceptions/api-error')
const UserService = require('../services/user-service')
const {validationResult} = require('express-validator')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {phone, password} = req.body
            const userData = await UserService.registration(phone, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {phone, password} = req.body

            const userData = await UserService.login(phone, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch(e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies

            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
        } catch(e) {
            next(e)
        }
    }

    async regTg(req, res, next) {
        try {
            const {phone, password, chatId} = req.body

            const userData = await UserService.regTg(phone, password, chatId)

            return res.json(userData)
        } catch (e) {
            next(e)   
        }
    }

    async setNotification(req, res, next) {
        try {
            const { id, value } = req.body

            const userData = await UserService.setNotification(id, value)

            return res.json(userData)
        } catch (e) {
            next(e)   
        }
    }
}

module.exports = new UserController()