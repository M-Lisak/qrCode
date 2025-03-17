import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { getQrById } from '../../store/slices/userSlice'
import { useAppSelector } from '../../store/hooks'

function RedirectPage() {
    console.log('redirect page')
    //получить адрес куда нужно переходить
    const qrId = window.location.pathname.split('/')[2]
    console.log('qrId', qrId)
    const dispatch = useDispatch<AppDispatch>()
    const origUrl = useAppSelector(state => state.user.qrCode?.originalUrl)

    if(origUrl) {
        window.location.href = origUrl
    }
    
    useEffect(() => {
        (async() => {
            await dispatch(getQrById(qrId))
        })()
    }, [])

    return <></>
}

export default RedirectPage
  