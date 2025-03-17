import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { getQrById } from '../../store/slices/userSlice'
import { useAppSelector } from '../../store/hooks'

function RedirectPage() {
    //получить адрес куда нужно переходить
    const qrId = window.location.pathname.split('/')[1]
    console.log('qrId', qrId)
    const dispatch = useDispatch<AppDispatch>()
    const origUrl = useAppSelector(state => state.user.goToOrigUrl)

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
  