import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux'
import { store } from './store/store';
import { BrowserRouter, Route, Routes } from 'react-router';
import RedirectPage from './components/Redirect/Redirect';
import QrInfoPage from './components/QrInfoPage/QrInfoPage';
import TelegramWeb from './components/TelegramWeb/TelegramWeb';
import InfoPage from './components/Info/Info';
import InfoNotifications from './components/InfoNotifications/InfoNotifications';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<App/>}/>
            <Route path=':urlid' element={<QrInfoPage/>}/>
            <Route path='nav/:urlid' element={<RedirectPage/>}/>
            <Route path='info' element={<InfoPage/>}/>
            <Route path='notifications' element={<TelegramWeb/>}/>
            <Route path='infoNotifications' element={<InfoNotifications />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
)
