import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const orderService = {
  getAll:       (params)   => api.get(API_ENDPOINTS.ORDERS, { params }),
  getById:      (id)       => api.get(API_ENDPOINTS.ORDER_BY_ID.replace(':id', id)),
  create:       (data)     => api.post(API_ENDPOINTS.ORDERS, data),
  cancel:       (id)       => api.post(API_ENDPOINTS.CANCEL_ORDER.replace(':id', id)),
  reorder:      (id)       => api.post(API_ENDPOINTS.REORDER.replace(':id', id)),
  getStatus:    (id)       => api.get(API_ENDPOINTS.ORDER_STATUS.replace(':id', id)),
  trackDelivery:(orderId)  => api.get(API_ENDPOINTS.DELIVERY_TRACK.replace(':orderId', orderId)),
}
