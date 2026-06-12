import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const pharmacyService = {
  getAll:   (params)         => api.get(API_ENDPOINTS.PHARMACIES, { params }),
  getById:  (id)             => api.get(API_ENDPOINTS.PHARMACY_BY_ID.replace(':id', id)),
  getNearby:(lat, lng, r=5)  => api.get(API_ENDPOINTS.NEARBY_PHARMACIES, { params: { lat, lng, radius: r } }),
}
