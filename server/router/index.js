const Router = require('express').Router
const userController = require('../controllers/user-controller')
const qrController = require('../controllers/qr-controller')
const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
// router.get('/:urlid', qrController.navigation)

router.get('/getQrById', qrController.getQrById)
router.get('/getQrByIdRedirect', qrController.getQrByIdRedirect)

router.post('/setQr', qrController.setQr)
router.get('/getQrs', qrController.getQrs)
router.post('/changeUrl', qrController.changeUrl)
router.post('/changeName', qrController.changeName)
router.post('/registrationQrCode', qrController.registrationQrCode)

//Telegram
router.post('/regTg', userController.regTg)

//Create QRs
router.post('/createQRs', qrController.create)


module.exports = router