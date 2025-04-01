import { bot } from "./bot.js"

export const callbackOnMessage = async (msg) => {
    try {
        const text = msg.text
        const chatId = msg.chat.id
    
        if(text === '/start') {
            //инструкция для работы с ботом
            await bot.sendMessage(chatId, 'Информация', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Регистрация', web_app: {url: process.env.WEB_APP_URL} }]
                    ]
                }
            })
        }

        return
    } catch (e) {
        console.log('callbackOnMessage error', e)
    }
}