import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux'
import { store } from './store/store';
import { BrowserRouter, Route, Routes } from 'react-router';
import RedirectPage from './components/Redirect/Redirect';
import RegistrationPage from './components/LoginForm/Registration/RegistrationPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<App/>}/>
            <Route path=':urlid' element={<RegistrationPage/>}/>
            <Route path='nav/:urlid' element={<RedirectPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
)
