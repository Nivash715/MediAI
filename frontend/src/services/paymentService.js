import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const paymentService = {
  initiate: (data)          => api.post(API_ENDPOINTS.PAYMENT_INITIATE, data),
  verify:   (data)          => api.post(API_ENDPOINTS.PAYMENT_VERIFY, data),
  history:  (params)        => api.get(API_ENDPOINTS.PAYMENT_HISTORY, { params }),

  /** Load Razorpay SDK dynamically and open checkout */
  openRazorpay: ({ orderId, amount, currency = 'INR', name, description, prefill, onSuccess, onFailure }) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const rzp = new window.Razorpay({
          key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount:      amount * 100,
          currency,
          name:        name || 'MediAI',
          description: description || 'Medicine Order',
          order_id:    orderId,
          prefill,
          theme:       { color: '#2563EB' },
          handler: (response) => { onSuccess?.(response); resolve(response) },
          modal: { ondismiss: () => { onFailure?.('dismissed'); reject(new Error('Payment dismissed')) } },
        })
        rzp.open()
      }
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
      document.body.appendChild(script)
    })
  },
}
