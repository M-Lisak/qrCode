const { nanoid } = require('nanoid')
const validateUrl = require('../utils/validateUrl')
const { UserModel } = require('../models/user-model')
const QRCode = require('qrcode')
const { QRModel } = require('../models/qr-model')
const ApiError = require('../exceptions/api-error')

class QRController {
    async registration(req, res, next) {
        try {
            const { OriginalUrl } = req.body

            const base = process.env.BASE

            const ID = nanoid()

            if(validateUrl(OriginalUrl)){
                const url = await UserModel.findOne({ OriginalUrl })

                if(url) {
                    res.render("QRGen", {
                        OriginalUrl: url.OriginalUrl,
                        ShortUrl: url.ShortUrl,
                        qr_code: "",
                    })
                } else {
                    const shortUrl = `${base}/${ID}`

                    await UserModel.create({ OriginalUrl, ShortUrl: shortUrl })
                    
                    res.render("QRGen", {
                        OriginalUrl: OriginalUrl,
                        ShortUrl: shortUrl,
                        qr_code: "",
                    });
                }
            }
        } catch(e) {
            console.log('QRController ERRROR', e)
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const { count } = req.body

            const base = process.env.BASE

            //создаём qr-коды сохраняя их в БД
            const opts = {
                errorCorrectionLevel: "H",
                type: "png",
                quality: 0.3,//качество изображения 0-1 
                margin: 1.2,//ширина по краям QR-кода
                color: {
                  dark: "#0000",
                  light: "#FFFF",
                },
                width: 250,
            }

            for(let i = 0; i < count; i++) {
                const ID = nanoid()
                const shortUrl = `${base}/${ID}`
                const originalUrl = `${base}/${ID}`//страница регистрации??

                QRCode.toFile(`qrCodes/${ID}.png`, `${shortUrl}`, opts, async (err, src) => {
                    //сохраняем каждый QR в БД
                    await QRModel.create({ shortUrl, originalUrl, name: ID })
                })
            }
            res.json('success')
        } catch (e) {
            console.log('QRController ERRROR', e)
            next(e)
        }
    }

    async navigation(req, res, next) {
        console.log('navigation')
        try {
            const base = process.env.BASE
            const url = await QRModel.findOne({ where: {shortUrl: `${base}/${req.params.urlid}`}})
            console.log('url', url)
            if(url) {
                return res.redirect(302, url.originalUrl)
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

    async getQrById(req, res, next) {
        try {
            const { id } = req.query
            const base = process.env.BASE
            console.log('base', base)
            console.log('id', id)

            const qrCode = await QRModel.findOne({ where: { shortUrl: `${base}/${id}` }})
            console.log('qrCode', qrCode)
            if(!qrCode) return res.json('')//на наш сайт, но написать, извините, данный qr код не привязан ни к одному сайту

            return res.json(qrCode.originalUrl)
        } catch (e) {
            console.log('QRController getQrById Error', e)
            next(e)
        }
    }

}

module.exports = new QRController()