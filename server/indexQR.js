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

const PORT = process.env.PORT || 5014
const app = express()
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

app.use('/qrCodes', express.static('./qrCodes'))
app.use('/public', express.static('./public'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        UserModel.hasOne(TokenModel)
        UserModel.hasMany(QRModel)
        await sequelize.authenticate()
        await sequelize.sync(/* { alter: true } *//* {force: true} */)
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch(e) {
        console.error('err', e)
    }
}

start()