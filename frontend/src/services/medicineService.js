import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const medicineService = {
  getAll:        (params)   => api.get(API_ENDPOINTS.MEDICINES, { params }),
  getById:       (id)       => api.get(API_ENDPOINTS.MEDICINE_BY_ID.replace(':id', id)),
  search:        (q, params)=> api.get(API_ENDPOINTS.MEDICINE_SEARCH, { params: { q, ...params } }),
  getCategories: ()         => api.get(API_ENDPOINTS.CATEGORIES),
  getByPharmacy: (pharmId)  => api.get(API_ENDPOINTS.MEDICINES, { params: { pharmacy_id: pharmId } }),
}
