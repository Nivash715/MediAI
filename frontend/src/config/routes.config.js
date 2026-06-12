export const ROUTES = {
  // Auth
  LOGIN:    '/login',
  REGISTER: '/register',

  // Core
  HOME:            '/home',
  PHARMACIES:      '/pharmacies',
  PHARMACY_DETAIL: '/pharmacies/:id',
  MEDICINES:       '/medicines',
  MEDICINE_DETAIL: '/medicines/:id',
  CART:            '/cart',
  ORDERS:          '/orders',
  ORDER_DETAIL:    '/orders/:id',
  PAYMENTS:        '/payments',
  DELIVERY:        '/delivery/:orderId',

  // Health features
  SYMPTOMS:       '/symptoms',
  AI_ASSISTANT:   '/ai-assistant',
  CONSULTATION:   '/consultation',
  PRESCRIPTIONS:  '/prescriptions',
  HEALTH_RECORDS: '/health-records',
  EMERGENCY:      '/emergency',

  // User
  PROFILE:         '/profile',
  ADMIN:           '/admin',
  NOTIFICATIONS:   '/notifications',

  // Aliases for clarity
  SYMPTOM_CHECKER: '/symptoms',
}

/** Build a dynamic path e.g. buildPath(ROUTES.PHARMACY_DETAIL, { id: '123' }) */
export function buildPath(route, params = {}) {
  return Object.entries(params).reduce(
    (path, [key, val]) => path.replace(`:${key}`, val),
    route,
  )
}
