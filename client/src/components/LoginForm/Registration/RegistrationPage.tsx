import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../store/hooks'
import { AppDispatch } from '../../../store/store'
import { changeUrl, checkAuth, getQrById } from '../../../store/slices/userSlice'
import LoginForm from '../LoginForm'


function RegistrationPage() {
    console.log('registration page')
    //если мы на этой странице, то мы работаем с QR-кодом
    const dispatch = useDispatch<AppDispatch>()
    const qrCode = useAppSelector(state => state.user.qrCode)
    const isAuth = useAppSelector(state => state.user.isAuth)
    const user = useAppSelector(state => state.user.user)

    //получаем все данные qr-кода
    const qrId = window.location.pathname.split('/')[1]

    useEffect(() => {
        (async() => {
            //нужно наверняка проверить авторизован ли пользователь
            if(localStorage.getItem('token')) {
                dispatch(checkAuth())
            }
            console.log('isAuth useEffect', isAuth)
            if(isAuth) {
                await dispatch(getQrById(qrId))
            }
        })()
    }, [isAuth, qrId])

    //если есть данные по qr-коду, то проверяем принаделжит ли этот qr-код текущему пользователю



    const changeLocUrl = (shortUrl: string) => {
        //откроется промпт и в него вставить новую ссылку
        const newUrl = prompt('Введите новый url')
        if(!newUrl) return //так же можно regex проверить
        dispatch(changeUrl({ shortUrl, newUrl }))
    
        //нужно заменить ссылку на бэке
    }

    console.log('qrCode',qrCode)

    if(!isAuth) {
        return <LoginForm />
    }

    if(!qrCode?.shortUrl) {
        return <div>Нет данных по этому QR-коду</div>
    }


    if(user.id === qrCode.userId  || !user.id) {
        //выводим все данные qr-кода
        return <div>
            <span style={{background: '#d0d0d0'}}>{qrCode?.name}</span>
            <span style={{background: 'red'}}>{qrCode?.originalUrl}</span>
            <button onClick={() => changeLocUrl(qrCode?.shortUrl)}>Заменить</button>
        </div>
    }

    return <div>
        этот QR-код не принадлежит вам
    </div>
}

export default RegistrationPage
  