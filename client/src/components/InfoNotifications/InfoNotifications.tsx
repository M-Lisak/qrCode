import React from 'react'
import classes from './InfoNotifications.module.scss'
import Header from '../Header/Header'

function InfoNotifications() {
    return <div className={classes['notifications']}>
        <Header/>
        <div className={classes['notifications__container']}>
            <img className={classes['notifications__img']} src=''></img>
        </div>

    </div>
}

export default InfoNotifications