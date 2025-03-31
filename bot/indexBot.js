import dotenv from 'dotenv/config'
import { startBot } from './bot.js'
import express from 'express'

startBot()
const app = express()

// app.use(cors({
//     origin: '*'
// }))

app.get('/notification', (req, res) => {
    //отправить уведомление
    console.log('notification', req.query)
})

app.listen(5016, () => console.log('listen port 5016'))