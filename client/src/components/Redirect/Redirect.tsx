import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { getQrById } from '../../store/slices/userSlice'

function RedirectPage() {
    //получить адрес куда нужно переходить
    const qrId = window.location.pathname.split('/')[1]
    console.log('qrId', qrId)
    const dispatch = useDispatch<AppDispatch>()
    

    
    useEffect(() => {
        (async() => {
            const origUrl = await dispatch(getQrById(qrId))
            console.log('origUrl', origUrl)
            window.location.href = origUrl as any
        })()
    }, [])

    return <></>
}

export default RedirectPage
  