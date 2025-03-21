const Router = require('express').Router
const userController = require('../controllers/user-controller')
const qrController = require('../controllers/qr-controller')
const router = new Router()
const { body } = require('express-validator')

router.post('/registration',
            body('phone').isMobilePhone('ru-RU',),
            body('password').isLength({min: 3, max: 32}),
            userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
// router.get('/:urlid', qrController.navigation)

router.get('/getQrById', qrController.getQrById)

router.get('/test', (req, res, next) => res.json('test success'))

router.post('/setQr', qrController.setQr)
router.get('/getQrs', qrController.getQrs)
router.post('/changeUrl', qrController.changeUrl)
router.post('/registrationQrCode', qrController.registrationQrCode)

router.post('/createQRs', qrController.create)


module.exports = router