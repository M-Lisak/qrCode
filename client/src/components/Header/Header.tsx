import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logout, setNotification } from '../../store/slices/userSlice';
import classes from './Header.module.scss'
import { useAppSelector } from '../../store/hooks';
import { useNavigate } from 'react-router';

function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useAppSelector(state => state.user.user)
  const navigate = useNavigate()

  const exit = () => {
    dispatch(logout())
  }

  const signIn = () => {
    navigate('/')
  }

  const goToHome = () => {
    navigate('/')
  }

  const _onChange = (value: any) => {
    //делаем проверку tgId 
    if(!user.tgId) {
      navigate('/infoNotifications')
      
      return
    }
    dispatch(setNotification({ id: user.id, value }))
  }

  return (
      <div className={classes['header']}>
        <img onClick={goToHome} src='/logotip.png' className={classes['header__logo']}></img>
        <div className={classes['header__right-space']}>
          {
            user?.id
             ? <div>
                <span style={{fontSize: '11px', marginRight: '5px'}}>Уведомления:</span>
                <label className={classes['header__switch']}>
                  <input type='checkbox' checked={user?.notifications as any} onChange={(e) => _onChange(e.target.checked)}></input>
                  <span className={classes['header__slider']}></span>
                </label>
              </div>
              : <></>
          }
          <div className={classes['header__right-panel']}>
            {
              user?.id
                ? <button onClick={exit}>Выйти</button>
                : <button onClick={signIn}>Войти</button>
            }
          </div>
        </div>
      </div>
    )
}

export default Header;
