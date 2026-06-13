import axios from 'axios'
import { API_BASE_URL } from '../config/api.config'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor: attach JWT ──────────────────── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Response interceptor: handle errors globally ──────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status
    const message = err.response?.data?.detail || err.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('mediai_token')
      window.location.href = '/login'
      return Promise.reject(new Error('Session expired. Please login again.'))
    }

    if (status === 422) {
      const errors = err.response?.data?.detail
      if (Array.isArray(errors)) {
        errors.forEach(e => toast.error(e.msg))
        return Promise.reject(new Error('Validation error'))
      }
    }

    if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (status >= 400) {
      toast.error(message)
    }

    return Promise.reject(new Error(message))
  },
)

export default api
