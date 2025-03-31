import React, { useEffect, useState } from 'react'
import styles from './TeleframWeb.module.scss'

function TelegramWeb() {
    //@ts-ignore
    const tg = window?.Telegram?.WebApp

    const [ login, setLogin ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ data, setData ] = useState('')

    useEffect(() => {
        tg?.ready()
        tg?.expand()
        tg?.disableVerticalSwipes()
        // tg.enableClosingConfirmation()
    }, [tg])

    const onClose = () => {
        tg?.close()
    }


    const signIn = async () => {
        fetch('https://qr-love.ru:5015/api/regTg',{
            method: 'POST',
            // credentials: 'include',//возможно что-то другое здесь должно быть
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({phone: login, password, chatId: tg?.initDataUnsafe?.user?.id })
        }).then(res => {
        setData('Успешно')
            //закрыть приложение
            // onClose()
        })
        .catch(e => {
            console.log('e', e)
            setData('Ошибка авторизации. Номер/почта или пароль не верный')
        })
        
    }
    
    return (
        <div className={styles["TelegramWeb"]}>
        <input
            onChange={e => setLogin(e.target.value)}
            value={login}
            type="text"
            placeholder="Номер телефона/почта"
        />
        <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Пароль"
        />
        <span>{data}</span>
        <button onClick={signIn}>Войти</button>
        </div>
    )
}

export default TelegramWeb
