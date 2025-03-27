const { nanoid } = require('nanoid')
const { QRModel } = require('../models/qr-model')
const ApiError = require('../exceptions/api-error')
const fs = require('fs')
const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js')
const { JSDOM } = require('jsdom')
const nodeCanvas = require('canvas')
const path = require('path')

class QRController {
    async create(req, res, next) {
        try {
            const { count } = req.body

            const base = process.env.BASE

            const rootDir = path.resolve()

            const pathToLogo = path.join(rootDir, '/public/logo6.png')

            //ВНИМАНИЕ не должно быть одинаковых ID, нужно за ранее получить все qr-коды,
            //и при создании нового искать в этом массиве, если всё норм, то после создания добавлять его в этот массив

            for(let i = 0; i < count; i++) {
                const ID = nanoid()
                const shortUrl = `${base}/nav/${ID}`
                const originalUrl = `${base}/${ID}`

                const qrCode = new QRCodeStyling({
                    jsdom: JSDOM,
                    nodeCanvas,
                    width: 300,
                    height: 300,
                    image: pathToLogo,
                    data: shortUrl,
                    dotsOptions: {
                      type: "rounded",
                      color: '#F17E00',
                    //   gradient: {
                    //     type: 'radial',
                    //     color: '#ffffff',
                    //     colorStops: [{offset: 0, color: '#ffffff'}, {offset: 1, color: '#ffffff'}]
                    //   }
                    },
                    backgroundOptions: {
                        color: '#ffffff',
                        // gradient: {
                        //     type: 'linear',
                        //     colorStops: [{offset: 0, color: '#0B6B5C'}, {offset: 1, color: '#14825B'}],
                        //     rotation: 90
                        // }
                    },
                    cornersSquareOptions: {
                        color: '#F17E00',
                        type: 'extra-rounded',
                    },
                    cornersDotOptions: {
                        color: '#F17E00'
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        saveAsBlob: true
                    }
                })

                qrCode.getRawData('png').then(async (buffer) => {
                    await QRModel.create({ shortUrl, originalUrl, name: ID })

                    const pathToQr = path.join(rootDir, `/qrCodes/${ID}.png`)
                    fs.writeFileSync(pathToQr, buffer)
                })
            }

            res.json('success')
        } catch (e) {
            console.log('QRController create ERRROR', e)
            next(e)
        }
    }

    async navigation(req, res, next) {
        try {
            const base = process.env.BASE
            const qrCode = await QRModel.findOne({ where: {shortUrl: `${base}/${req.params.urlid}`}})
            //добавить кол-во переходов по ссылке

            if(qrCode) {
                qrCode.count += 1
                await qrCode.save()
                //здесь же можно отправлять уведомление о переходе
                return res.redirect(302, qrCode.originalUrl)//мб поставить это выше по коду?
            } else {
                res.status(404).json("Not found")
            }
        } catch (e) {
            console.log('QRController navigation Error', e)
            next(e)
        }
    }

    async setQr(req, res, next) {
        try {
            const { qrId, user }  = req.body
            const base = process.env.BASE

            //ищем qr-code в нашей базе, смотрим на его использование(можно понять по userId)
            const qrCode = await QRModel.findOne({ where: {shortUrl: `${base}/${qrId}`}})

            if(!qrCode) {
                return res.json('qr-код не найден')
            }

            if(qrCode.userId) {
                //к этому qr уже привязан пользователь
                return res.json(`этот qr-код уже привязан к пользователю с id: ${qrCode.userId}`)
            } else {
                //привязываем qr к пользователю
                qrCode.userId = user.id
                await qrCode.save()
            }

            return res.json(qrCode)
        } catch (e) {
            console.log('QRController setQr Error', e)
            next(e)
        }
    }

    async getQrs(req, res, next) {
        try {
            const { userId }  = req.query

            if(!userId) {
                throw ApiError.UnauthorizedError()
            }

            const qrCodes = await QRModel.findAll({ where: { userId }})

            return res.json(qrCodes)
        } catch (e) {
            console.log('QRController getQrs Error', e)
            next(e)
        }
    }

    async changeUrl(req, res, next) {
        try {
            const { shortUrl, newUrl } = req.body

            const qr = await QRModel.findOne({ where: { shortUrl }})

            if(!qr) return res.json('qr-код не найден')

            qr.originalUrl = newUrl
            await qr.save()

            return res.json(qr)
        } catch (e) {
            console.log('QRController getQrs Error', e)
            next(e)
        }
    }

    async changeName(req, res, next) {
        try {
            const { shortUrl, newName } = req.body

            const qr = await QRModel.findOne({ where: { shortUrl }})

            if(!qr) return res.json('qr-код не найден')

            qr.name = newName
            await qr.save()

            return res.json(qr)
        } catch (e) {
            console.log('QRController getQrs Error', e)
            next(e)
        }
    }

    async getQrById(req, res, next) {
        try {
            const { id } = req.query
            const base = process.env.BASE

            const qrCode = await QRModel.findOne({ where: { shortUrl: `${base}/nav/${id}` }})

            if(!qrCode) return res.json({})//на наш сайт, но написать, что такого qr-кода не найдено

            return res.json(qrCode)
        } catch (e) {
            console.log('QRController getQrById Error', e)
            next(e)
        }
    }

    async registrationQrCode(req, res, next) {
        try {
            const { userId, qrId } = req.body
            const base = process.env.BASE

            const qrCode = await QRModel.findOne({ where: { shortUrl: `${base}/nav/${qrId}` }})

            if(!qrCode) return res.json('err registration')//на наш сайт, но написать, что такого qr-кода не найдено
            
            qrCode.userId = userId
            await qrCode.save()

            return res.json(userId)
        } catch (e) {
            console.log('QRController registrationQrCode Error', e)
            next(e)
        }
    }

}

module.exports = new QRController()