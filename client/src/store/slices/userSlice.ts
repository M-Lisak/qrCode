import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import AuthService from "../../services/AuthService"
import { IUser } from "../../models/IHost"
import axios from "axios"
import { AuthResponse } from "../../models/response/AuthResponse"
import { API_URL } from "../../http"

const initialState = {
    user: {
        phone: '',
        id: '',
        notifications: false,
        tgId: '',
    },
    qrCode: {} as any,
    qrCodes: [] as any,
    isAuth: false,
    loading: false,
    error: '',
}

export const login = createAsyncThunk(
    'user/login',
    async ({phone, password}: userData, thunkAPI) => {
        try {
            const response = await AuthService.login(phone, password)
            localStorage.setItem('token', response.data.accessToken)
            return { user: response.data.user, qrCodes: response.data.qrCodes }
        } catch (e: any) {
            console.log('login error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const registration = createAsyncThunk(
    'user/registration',
    async ({phone, password}: userData, thunkAPI) => {
        try {
            const response = await AuthService.registration(phone, password)
            localStorage.setItem('token', response.data.accessToken)
            return response.data.user
        } catch (e: any) {
            console.log('registration error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async (_, thunkAPI) => {
        try {
            await AuthService.logout()
            localStorage.removeItem('token')
        } catch (e: any) {
            console.log('logout error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const setNotification = createAsyncThunk(
    'user/setNotification',
    async (data: any, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/setNotification`, data)

            return response.data
        } catch (e: any) {
            console.log('setNotification error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)

            return { user: response.data.user, qrCodes: response.data.qrCodes }
        } catch (e: any) {
            console.log('checkAuth error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const setQrCode = createAsyncThunk(
    'user/setQrCode',
    async (user: any, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/setQr`, user)
            // return response.data
            return response
        } catch (e: any) {
            console.log('setQrCode error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const getQrCodes = createAsyncThunk(
    'user/getQrCodes',
    async (user: any, thunkAPI) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/getQrs?userId=${user.id}`, { withCredentials: true })

            return response.data
        } catch (e: any) {
            console.log('getQrCodes error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const getQrById = createAsyncThunk(
    'user/getQrById',
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/getQrById?id=${id}`, { withCredentials: true })

            return response.data
        } catch (e: any) {
            console.log('getQrById error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const getQrByIdRedirect = createAsyncThunk(
    'user/getQrByIdRedirect',
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/getQrByIdRedirect?id=${id}`, { withCredentials: true })

            return response.data
        } catch (e: any) {
            console.log('getQrByIdRedirect error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const changeUrl = createAsyncThunk(
    'user/changeUrl',
    async (data: any, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/changeUrl`, data)

            return response.data
        } catch (e: any) {
            console.log('changeUrl error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const changeName = createAsyncThunk(
    'user/changeName',
    async (data: any, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/changeName`, data)

            return response.data
        } catch (e: any) {
            console.log('changeName error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)

export const registrationQrCode = createAsyncThunk(
    'user/registrationQrCode',
    async (data: any, thunkAPI) => {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/registrationQrCode`, data)

            return response.data
        } catch (e: any) {
            console.log('registrationQrCode error', e?.response?.data?.message)
            return thunkAPI.rejectWithValue(e?.response?.data?.message)
        }
    }
)




export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setAuth: (state, action) => {
            state.isAuth = action.payload
        }
    },
    extraReducers: builder => {
        builder
            //login
            .addCase(login.pending, (state) => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action: any) => {
                state.loading = false
                state.isAuth = true
                state.user = action.payload?.user
                state.qrCodes = action.payload?.qrCodes
            })
            .addCase(login.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //registration
            .addCase(registration.pending, (state) => {
                state.loading = true
            })
            .addCase(registration.fulfilled, (state, action: any) => {
                state.loading = false
                state.isAuth = true
                state.user = action.payload
            })
            .addCase(registration.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //logout
            .addCase(logout.pending, (state) => {
                state.loading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false
                state.isAuth = false
                state.user = {} as IUser
            })
            .addCase(logout.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //setNotification
            .addCase(setNotification.pending, (state) => {
                state.loading = true
            })
            .addCase(setNotification.fulfilled, (state, action: any) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(setNotification.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //checkAuth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
            })
            .addCase(checkAuth.fulfilled, (state, action: any) => {
                state.loading = false
                state.isAuth = true
                state.user = action.payload?.user
                state.qrCodes = action.payload?.qrCodes
            })
            .addCase(checkAuth.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //setQrCode
            .addCase(setQrCode.pending, (state) => {
                state.loading = true
            })
            .addCase(setQrCode.fulfilled, (state, action: any) => {
                state.loading = false
                if(action.payload?.userId) {
                    state.qrCodes.push(action.payload)//мб нужно переделать
                }
            })
            .addCase(setQrCode.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //getQrCodes
            .addCase(getQrCodes.pending, (state) => {
                state.loading = true
            })
            .addCase(getQrCodes.fulfilled, (state, action: any) => {
                state.loading = false
                state.qrCodes = action.payload
            })
            .addCase(getQrCodes.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //getQrById
            .addCase(getQrById.pending, (state) => {
                state.loading = true
            })
            .addCase(getQrById.fulfilled, (state, action: any) => {
                state.loading = false
                state.qrCode = action.payload
            })
            .addCase(getQrById.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //getQrByIdRedirect
            .addCase(getQrByIdRedirect.pending, (state) => {
                state.loading = true
            })
            .addCase(getQrByIdRedirect.fulfilled, (state, action: any) => {
                state.loading = false
                state.qrCode = action.payload
            })
            .addCase(getQrByIdRedirect.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //changeUrl
            .addCase(changeUrl.pending, (state) => {
                state.loading = true
            })
            .addCase(changeUrl.fulfilled, (state, action: any) => {
                state.loading = false
                //нужно уже у имеющегося qr кода обновить originalUrl
                state.qrCodes = state.qrCodes.map((qr: any) => {
                    if(qr?.shortUrl === action.payload?.shortUrl) {
                        return {...qr, originalUrl: action.payload?.originalUrl}
                    }

                    return qr
                })
                state.qrCode = action.payload
            })
            .addCase(changeUrl.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //changeName
            .addCase(changeName.pending, (state) => {
                state.loading = true
            })
            .addCase(changeName.fulfilled, (state, action: any) => {
                state.loading = false
                //нужно уже у имеющегося qr кода обновить originalUrl
                state.qrCodes = state.qrCodes.map((qr: any) => {
                    if(qr?.shortUrl === action.payload?.shortUrl) {
                        return {...qr, originalUrl: action.payload?.name}
                    }

                    return qr
                })
                state.qrCode = action.payload
            })
            .addCase(changeName.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
            //registrationQrCode
            .addCase(registrationQrCode.pending, (state) => {
                state.loading = true
            })
            .addCase(registrationQrCode.fulfilled, (state, action: any) => {
                state.loading = false
                //нужно qr-коду заменить userId
                state.qrCode = {...state.qrCode, userId: action.payload}//по сути можно даже не action.payload, а текущий user.id
            })
            .addCase(registrationQrCode.rejected, (state, action: any) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { setUser, setAuth } = userSlice.actions

interface userData {
    phone: string
    password: string
}


export default userSlice.reducer
