import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store/hooks'
import { AppDispatch } from '../../store/store'
import { changeName, changeUrl, checkAuth, getQrById, registrationQrCode } from '../../store/slices/userSlice'
import LoginForm from '../LoginForm/LoginForm'
import classes from './QrInfoPage.module.scss'
import Header from '../Header/Header'
import { getIdFromUrl } from '../../utils'
import Modal from '../Modal/Modal'

function QrInfoPage() {
    //если мы на этой странице, то мы работаем с QR-кодом
    const dispatch = useDispatch<AppDispatch>()
    const qrCode = useAppSelector(state => state.user.qrCode)
    const isAuth = useAppSelector(state => state.user.isAuth)
    const user = useAppSelector(state => state.user.user)
    const loading = useAppSelector(state => state.user.loading)
    const [ isModalActive, setModalActive ] = useState(false)
    const [ isModalActiveName, setModalActiveName ] = useState(false)
    const [ newLink, setNewLink ] = useState('')
    const [ errorInput, setErrorInput ] = useState('')
    const [ newName, setNewName ] = useState('')

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

    const handleModalOpen = () => {
        setModalActive(true);
    }
    const handleModalClose = () => {
        setModalActive(false);
        setNewLink('')
    }

    const handleModalOpenName = () => {
        setModalActiveName(true)
    }

    const handleModalCloseName = () => {
        setModalActiveName(false)
        setNewName('')
    }
    //если есть данные по qr-коду, то проверяем принаделжит ли этот qr-код текущему пользователю

    const saveNewLink = () => {
        //здесь отправляем запрос на бэк
        const regex = /^(https:\/\/)(t.me|vk.com|ok.ru\/profile)\/[^\s@]*$/

        const isLink = regex.test(newLink)

        if(!isLink) setErrorInput(`Ссылка должна быть в формате:\nhttps://t.me/username\nhttps://vk.com/username\nhttps://ok.ru/profile/username`)
        else {
            dispatch(changeUrl({ shortUrl: qrCode?.shortUrl, newUrl: newLink }))
            handleModalClose()
        }
    }

    const saveNewName = () => {
        dispatch(changeName({shortUrl: qrCode?.shortUrl, newName}))
        handleModalCloseName()
    }
    

    const onChangeLink = (link: string) => {
        //здесь меняем ссылку и валидируем её
        setNewLink(link)
        const regex = /^(https:\/\/)(t.me|vk.com|ok.ru\/profile)\/[^\s@]*$/

        const isLink = regex.test(link)
        //здесь мы можем окрашивать только в обычный цвет и удалять ошибки(если до этого были ошибки)
        if(isLink) setErrorInput('')
    }

    const onChangeName = (name: string) => {
        setNewName(name)
    }

    if(loading) {//есть момент, в котором пользователь не авторизован, и при этом loading false
        return <div className={classes['container']}><div className={classes['loader']}></div></div>
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
                <img src={`https://qr-love.ru:5015/qrCodes/${getIdFromUrl(qrCode?.shortUrl)}.png`}></img>
                <span style={{textDecoration: 'underline'}}>{qrCode?.originalUrl}</span>
                <span>Количество переходов: {qrCode?.count}</span>
                <button onClick={handleModalOpen}>Заменить URL</button>
                <button onClick={handleModalOpenName}>Сменить название</button>
            </div>
            {
                isModalActive && (
                    <Modal title="Введите новую ссылку" onClose={handleModalClose}>
                        <div className={classes['qr-info-page__main__modal']}>
                            <input
                                onChange={e => onChangeLink(e.target.value)}
                                value={newLink}
                                type="text"
                                placeholder="Ссылка"
                            />
                            {errorInput && <span>{errorInput}</span>}
                            <button onClick={saveNewLink}>Сохранить</button>
                            <button onClick={handleModalClose}>Отмена</button>
                        </div>
                    </Modal>
                )
            }
            {
                isModalActiveName && (
                    <Modal title="Введите новое название QR-кода" onClose={handleModalCloseName}>
                        <div className={classes['qr-info-page__main__modal']}>
                            <input
                                onChange={e => onChangeName(e.target.value)}
                                value={newName}
                                type="text"
                                placeholder="Название"
                            />
                            {errorInput && <span>{errorInput}</span>}
                            { newName && <button onClick={saveNewName}>Сохранить</button>}
                            <button onClick={handleModalCloseName}>Отмена</button>
                        </div>
                    </Modal>
                )
            }
        </div>
    }

    return <div className={classes['qr-info-page']}>
        <Header />
        этот QR-код не принадлежит вам
    </div>
}

export default QrInfoPage  