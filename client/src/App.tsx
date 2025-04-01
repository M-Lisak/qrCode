import React, { useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { checkAuth } from './store/slices/userSlice';
import { useAppSelector } from './store/hooks';
import classes from './App.module.scss'
import { useNavigate } from 'react-router';
import { getIdFromUrl } from './utils';
import Header from './components/Header/Header';
//в идеале, чтобы здесь нельзя было заменить ссылку на qr

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useAppSelector(state => state.user.isAuth)
  const isLoading = useAppSelector(state => state.user.loading)
  const qrCodes = useAppSelector(state => state.user.qrCodes) || []
  const navigate = useNavigate()

  useEffect( () => {
    if(localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
  }, [])

  if(isLoading) {
    return <div>...Загрузка</div>
  }

  if(!isAuth) {
    return <LoginForm/>
  }

  const goToQr = (url: string) => {
    const identificate = getIdFromUrl(url)
    navigate(`/${identificate}`)
  }

  return (
    <div className={classes['App']}>
      <Header />
      <div className={classes['main']}>
        {
          qrCodes.map((el: any) => {
            const sourceImg = `https://qr-love.ru:5015/qrCodes/${getIdFromUrl(el.shortUrl)}.png`
            return (<div key={el.name} className={classes['main__qr-list']} onClick={() => goToQr(el.shortUrl)}>
                <img id="img" src={sourceImg}></img>
                <p>Кол-во переходов: {el.count}</p>
                <span>{el.name}</span>
              </div>)
          })
        }
      </div>
    </div>
  )
}

export default App;
