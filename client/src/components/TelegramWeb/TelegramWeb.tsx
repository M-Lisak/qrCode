import React, { useEffect, useState } from 'react'
import styles from './TeleframWeb.module.scss'
import { useTelegram } from './useTelegram'

function TelegramWeb() {
  const { tg, user, onClose } = useTelegram()
  const [ login, setLogin ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ data, setData ] = useState('')

  useEffect(() => {
    tg?.ready()
    tg?.expand()
    tg?.disableVerticalSwipes()
    if(!user?.id) {
        //уходим с этой страницы
        console.log('нет id')
        // window.location.href = 'https://qr-love.ru'
        // onClose()
    }
    // tg.enableClosingConfirmation()
  }, [tg])


  const signIn = async () => {
    fetch('https://qr-love.ru:5015/api/regTg',{
      method: 'POST',
      // credentials: 'include',//возможно что-то другое здесь должно быть
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({phone: login, password, chatId: user?.id })
    }).then(res => {
      setData('Успешно')
      //закрыть приложение
      onClose()
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
