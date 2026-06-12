import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const authService = {
  login:     (data)            => api.post(API_ENDPOINTS.LOGIN, data),
  register:  (data)            => api.post(API_ENDPOINTS.REGISTER, data),
  logout:    ()                => api.post(API_ENDPOINTS.LOGOUT),
  getMe:     ()                => api.get(API_ENDPOINTS.ME),
  sendOtp:   (mobile)          => api.post(API_ENDPOINTS.SEND_OTP, { mobile }),
  verifyOtp: (data)            => api.post(API_ENDPOINTS.VERIFY_OTP, data),
  refresh:   (refreshToken)    => api.post(API_ENDPOINTS.REFRESH, { refresh_token: refreshToken }),
  updateProfile: (data)        => api.put(API_ENDPOINTS.ME, data),
}
