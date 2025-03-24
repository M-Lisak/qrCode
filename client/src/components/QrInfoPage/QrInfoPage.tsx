import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store/hooks'
import { AppDispatch } from '../../store/store'
import { changeName, changeUrl, checkAuth, getQrById, registrationQrCode } from '../../store/slices/userSlice'
import LoginForm from '../LoginForm/LoginForm'
import classes from './QrInfoPage.module.scss'
import Header from '../Header/Header'
import { getIdFromUrl } from '../../utils'

//Логика должна быть такая, что в случае если у qr нет userId,
//то только тогда это страница регистрации,
//в остальных случаях это страница отображения всей инфы по конкретному qr-коду

function QrInfoPage() {
    //если мы на этой странице, то мы работаем с QR-кодом
    const dispatch = useDispatch<AppDispatch>()
    const qrCode = useAppSelector(state => state.user.qrCode)
    const isAuth = useAppSelector(state => state.user.isAuth)
    const user = useAppSelector(state => state.user.user)
    const loading = useAppSelector(state => state.user.loading)

    //получаем все данные qr-кода
    const qrId = window.location.pathname.split('/')[1]

    useEffect(() => {
        (async() => {
            //нужно наверняка проверить авторизован ли пользователь
            if(localStorage.getItem('token')) {
                dispatch(checkAuth())
            }
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

    const changeLocName = (shortUrl: string) => {//ограничение на кол-во симоволов
        const newName = prompt('Введите новое название')
        if(!newName) return
        dispatch(changeName({shortUrl, newName}))
    }

    if(loading) {//есть момент, в котором пользователь не авторизован, и при этом loading false
        return <>Загрузка...</>
    }

    if(!isAuth) {
        return <LoginForm />
    }
    //если у qrCode нет userId, то присваиваем этот qr этому пользователю

    if(!qrCode?.shortUrl) {
        return <div className={classes['qr-info-page']}>
            <Header/>
            <div>Похоже, что такого QR-кода не существует</div>
        </div>
    } else if(!qrCode?.userId && user.id && qrId) {
        //присваиваем этот QR-код этому пользователю
        dispatch(registrationQrCode({qrId, userId: user.id }))
    }

    if(user.id === qrCode.userId) {
        return <div className={classes['qr-info-page']}>
            <Header />
            <div className={classes['qr-info-page__main']}>
                <h3>{qrCode?.name}</h3>
                <img src={`http://45.131.99.100:5014/qrCodes/${getIdFromUrl(qrCode?.shortUrl)}.png`}></img>
                <span>{qrCode?.originalUrl}</span>
                <button onClick={() => changeLocUrl(qrCode?.shortUrl)}>Заменить URL</button>
                <button onClick={() => changeLocName(qrCode?.shortUrl)}>Сменить название</button>
            </div>
        </div>
    }

    return <div className={classes['qr-info-page']}>
        <Header />
        этот QR-код не принадлежит вам
    </div>
}

export default QrInfoPage  