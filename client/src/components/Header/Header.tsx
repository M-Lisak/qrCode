import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/userSlice';
import classes from './Header.module.scss'
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router';

function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const phone = useAppSelector(state => state.user.user.phone)
  const navigate = useNavigate()

  const exit = () => {
    dispatch(logout())
  }

  const goToHome = () => {
    console.log('/goToHome')
    navigate('/')
  }

  return (
      <div className={classes['header']} onClick={goToHome}>
        <h3>Header</h3>
        <div className={classes['header__right-panel']}>
          <span>{phone}</span>
          <button onClick={exit}>Выйти</button>
        </div>
      </div>
    )
}

export default Header;
