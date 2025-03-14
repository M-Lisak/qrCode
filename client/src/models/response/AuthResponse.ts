import { IUser } from "../IHost"

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
    qrCodes?: any
}