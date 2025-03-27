import TelegramBot from 'node-telegram-bot-api'
import { MY_COMMANDS } from './myCommands.js'
import { callbackOnMessage } from './onMessage.js'

export const bot = new TelegramBot(process.env.TOKEN, {polling: true})

export const startBot = async() => {
    bot.setMyCommands(MY_COMMANDS)

    bot.on('message', callbackOnMessage)
}