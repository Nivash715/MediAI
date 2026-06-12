export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN:        '/auth/login',
  REGISTER:     '/auth/register',
  LOGOUT:       '/auth/logout',
  REFRESH:      '/auth/refresh',
  ME:           '/auth/me',
  SEND_OTP:     '/auth/otp/send',
  VERIFY_OTP:   '/auth/otp/verify',

  // Medicines
  MEDICINES:       '/medicines',
  MEDICINE_BY_ID:  '/medicines/:id',
  MEDICINE_SEARCH: '/medicines/search',
  CATEGORIES:      '/medicines/categories',

  // Pharmacies
  PHARMACIES:        '/pharmacies',
  PHARMACY_BY_ID:    '/pharmacies/:id',
  NEARBY_PHARMACIES: '/pharmacies/nearby',

  // Orders
  ORDERS:        '/orders',
  ORDER_BY_ID:   '/orders/:id',
  ORDER_STATUS:  '/orders/:id/status',
  CANCEL_ORDER:  '/orders/:id/cancel',
  REORDER:       '/orders/:id/reorder',

  // Cart
  CART:          '/cart',
  CART_ADD:      '/cart/add',
  CART_REMOVE:   '/cart/remove/:itemId',
  CART_CLEAR:    '/cart/clear',
  APPLY_COUPON:  '/cart/coupon',

  // Payments
  PAYMENT_INITIATE: '/payments/initiate',
  PAYMENT_VERIFY:   '/payments/verify',
  PAYMENT_HISTORY:  '/payments/history',

  // Delivery
  DELIVERY_TRACK:   '/delivery/:orderId/track',
  DELIVERY_UPDATES: '/delivery/:orderId/updates',

  // AI / Health
  SYMPTOM_ANALYZE:  '/ai/symptoms/analyze',
  AI_CHAT:          '/ai/chat',
  DRUG_INTERACTION: '/ai/drug-interaction',
  HEALTH_SCORE:     '/ai/health-score',

  // Consultations
  CONSULTATIONS:     '/consultations',
  DOCTORS:           '/consultations/doctors',
  BOOK_CONSULTATION: '/consultations/book',
  MY_CONSULTATIONS:  '/consultations/me',

  // Prescriptions
  PRESCRIPTIONS:        '/prescriptions',
  UPLOAD_PRESCRIPTION:  '/prescriptions/upload',
  OCR_EXTRACT:          '/prescriptions/ocr',

  // Health Records
  HEALTH_RECORDS: '/health-records',
  HEALTH_SUMMARY: '/health-records/summary',

  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ:     '/notifications/:id/read',
}
