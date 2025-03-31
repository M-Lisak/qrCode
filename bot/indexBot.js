import dotenv from 'dotenv/config'
import { bot, startBot } from './bot.js'
import express from 'express'

startBot()
const app = express()

// app.use(cors({
//     origin: '*'
// }))

app.get('/notification', async (req, res) => {
    // console.log('notification', req.query)

    const { chatId, name } = req.query
    if(!chatId) res.json('Отсутствует chatId')
    
    await bot.sendMessage(chatId, `Переход по вашему QR-коду: ${name}`)
    return res.json('success')
})

app.listen(5016, () => console.log('listen port 5016'))