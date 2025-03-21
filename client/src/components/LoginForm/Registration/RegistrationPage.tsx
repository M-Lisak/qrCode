import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../store/hooks'
import { AppDispatch } from '../../../store/store'
import { changeUrl, checkAuth, getQrById, registrationQrCode } from '../../../store/slices/userSlice'
import LoginForm from '../LoginForm'

//переименовать лист, и назвать Страница конкретного QR-кода
//Логика должна быть такая, что в случае если у qr нет userId,
//то только тогда это страница регистрации,
//в остальных случаях это страница отображения всей инфы по конкретному qr-коду

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
    //если у qrCode нет userId, то присваиваем этот qr этому пользователю

    if(!qrCode?.shortUrl) {
        return <div>Похоже, что такого QR-кода не существует</div>
    } else if(!qrCode?.userId && user.id && qrId) {
        //присваиваем это QR-код этому пользователю
        dispatch(registrationQrCode({qrId, userId: user.id }))
    }


    if(user.id === qrCode.userId) {
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
  