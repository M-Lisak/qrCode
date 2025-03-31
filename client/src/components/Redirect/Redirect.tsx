import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { getQrByIdRedirect } from '../../store/slices/userSlice'
import { useAppSelector } from '../../store/hooks'

function RedirectPage() {
    //получить адрес куда нужно переходить
    const qrId = window.location.pathname.split('/')[2]
    const dispatch = useDispatch<AppDispatch>()
    const origUrl = useAppSelector(state => state.user.qrCode?.originalUrl)

    if(origUrl) {
        //прибавляем кол-во переходов, а так же отправляем уведомление в телеграм
        window.location.href = origUrl
    }
    
    useEffect(() => {
        (async() => {
            await dispatch(getQrByIdRedirect(qrId))
        })()
    }, [qrId])

    return <></>
}

export default RedirectPage
  