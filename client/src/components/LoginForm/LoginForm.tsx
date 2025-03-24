import React, { FC, useState } from "react";
import classes from "./LoginForm.module.scss"
import { useDispatch, /* useSelector */ } from "react-redux";
import { login, registration } from "../../store/slices/userSlice";
import { AppDispatch } from "../../store/store";

const LoginForm: FC = () => {
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()

    const singIn = async () => {
        console.log('singIn')   
        await dispatch(login({phone, password}))
    }

    const singUp = async () => {
        console.log('singUp')
        await dispatch(registration({phone, password}))
    }

    return (
        <div className={classes['login-form']}>
            <input
                onChange={e => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="Номер телефона"
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Пароль"
            />
            <button onClick={singIn}>Войти</button>
            <button onClick={singUp}>Регистрация</button>
        </div>
    )
}

export default LoginForm