import React, { useEffect } from 'react'
import classes from './Info.module.scss'
import Header from '../Header/Header'

function InfoPage() {
    useEffect(() => {
        (async() => {

        })()
    }, [])

    return <div className={classes['info']}>
        <Header/>
        <div className={classes['info__container']}>
            <img className={classes['info__img']} src='/info.jpg'></img>
        </div>
    </div>
}

export default InfoPage
  