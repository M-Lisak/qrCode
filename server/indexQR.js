require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sequelize = require('./bd');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const { UserModel } = require('./models/user-model');
const { TokenModel } = require('./models/token-model');
const { QRModel } = require('./models/qr-model');
const https = require('https')
const http = require('http')
const fs = require('fs')

// const PORT = process.env.PORT || 5014
const app = express()
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))


const httpsOptions = {
    key: fs.readFileSync('privatekey.pem', 'utf-8'),
    cert: fs.readFileSync('sertificat.pem', 'utf-8')
}

app.use('/qrCodes', express.static('./qrCodes'))
app.use('/public', express.static('./public'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'https://qr-love.ru'
}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        UserModel.hasOne(TokenModel)
        UserModel.hasMany(QRModel)
        await sequelize.authenticate()
        await sequelize.sync({ alter: true }/* {force: true} */)
        http.createServer(app).listen(5014, () => console.log('http listen 5014'))
        https.createServer(httpsOptions, app).listen(5015, () => console.log('https listen 5015'))
    } catch(e) {
        console.error('err', e)
    }
}

start()