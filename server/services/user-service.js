const { UserModel } = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const { QRModel } = require('../models/qr-model')

class UserService {
    async registration(phone, password) {
        const candidate = await UserModel.findOne({ where: { phone }})

        if(candidate) {
            throw ApiError.BadRequest(`Пользователь с номером телефона: ${phone} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3)

        const user = await UserModel.create({phone, password: hashPassword })

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        
        return { ...tokens, user: userDto}
    }

    async login(phone, password) {
        const user = await UserModel.findOne({where: { phone }})
        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким phone не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        const qrCodes = await QRModel.findAll({ where: { userId: user.id }})

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto, qrCodes}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)

        const tokenFromDb = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findByPk(userData.id)
        const qrCodes = await QRModel.findAll({ where: { userId: userData.id }})

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto, qrCodes}
    }

    async regTg(phone, password, chatId) {
        const user = await UserModel.findOne({where: { phone }})
        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким phone не найден')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
        }

        //пользователь верно ввёл свои данные можно присваивать ему chatId этого пользователя
        user.tgId = chatId
        await user.save()

        return user
    }

    async setNotification(id, value) {
        const user = await UserModel.findOne({where: { id }})
        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким id не найден')
        }

        //пользователь верно ввёл свои данные можно присваивать ему chatId этого пользователя
        user.notifications = value
        await user.save()

        return user
    }
}

module.exports = new UserService()