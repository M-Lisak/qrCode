import React, { useEffect } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { changeUrl, checkAuth, logout, setQrCode } from './store/slices/userSlice';
import { useAppSelector } from './store/hooks';

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const isAuth = useAppSelector(state => state.user.isAuth)
  const user = useAppSelector(state => state.user.user)
  const isLoading = useAppSelector(state => state.user.loading)
  const qrCodes = useAppSelector(state => state.user.qrCodes) || []

  console.log('qrCodes', qrCodes)

  useEffect( () => {
    if(localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
  }, [])

  const exit = () => {
    dispatch(logout())
  }

  if(isLoading) {
    return <div>...Загрузка</div>
  }

  if(!isAuth) {
    return <LoginForm/>
  }


  const qrId = window.location.pathname.split('/')[1]

  console.log('isAuht', isAuth)
  console.log('user', user)
  console.log('qrId', qrId)

  if(isAuth && user?.id) {
    console.log('true')
    if(qrId) {
      console.log('qrId', qrId)
      dispatch(setQrCode({qrId, user}))
      window.location.href = 'http://45.131.99.100/'
    }
  }

  const changeLocUrl = (shortUrl: string) => {
    //откроется промпт и в него вставить новую ссылку?
    const newUrl = prompt('Введите новый url')
    if(!newUrl) return //так же можно regex проверить
    dispatch(changeUrl({ shortUrl, newUrl }))

    //нужно заменить ссылку на бэке
  }

  return (
    <div>
      {
        qrCodes.map((el: any) => (
          <div key={el.name}>
            <span style={{background: '#d0d0d0'}}>{el.name}</span>
            <span style={{background: 'red'}}>{el.originalUrl}</span>
            <button onClick={() => changeLocUrl(el.shortUrl)}>Заменить</button>
          </div>
        ))
      }

      <button onClick={exit}>Выйти</button>
    </div>
  )
}

export default App;
