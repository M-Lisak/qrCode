import React, { FC, useState } from "react";
import classes from "./LoginForm.module.scss"
import { useDispatch, /* useSelector */ } from "react-redux";
import { login, registration } from "../../store/slices/userSlice";
import { AppDispatch } from "../../store/store";
import { useAppSelector } from "../../store/hooks";

const LoginForm: FC = () => {
    const [phone, setPhone] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [ regErr, setRegErr ] = useState('')
    const dispatch = useDispatch<AppDispatch>()
    const errors = useAppSelector(state => state.user.error)

    const singIn = async () => {
        await dispatch(login({phone, password}))
        setRegErr('')
    }

    const singUp = async () => {
        const regex = /^89\d{9}$|.+@.+\..+$/
        const isPhoneOrEmail = regex.test(phone)
        if(isPhoneOrEmail) {
            await dispatch(registration({phone, password}))
            setRegErr('')
        } else {
            setRegErr('Введите номер телефона или почту')
        }
    }

    return (
        <div className={classes['login-form']}>
            <input
                onChange={e => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="Номер телефона/почта"
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Пароль"
            />
            {errors && <span>{errors}</span>}
            {regErr && <span>{regErr}</span>}
            <button onClick={singIn}>Войти</button>
            <button onClick={singUp}>Регистрация</button>
        </div>
    )
}

export default LoginForm