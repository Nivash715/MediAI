import api from './api'
import { API_ENDPOINTS } from '../config/api.config'

export const aiService = {
  analyzeSymptoms: (data)        => api.post(API_ENDPOINTS.SYMPTOM_ANALYZE, data),
  chat:            (messages)    => api.post(API_ENDPOINTS.AI_CHAT, { messages }),
  checkDrugInteraction: (drugs)  => api.post(API_ENDPOINTS.DRUG_INTERACTION, { drugs }),
  getHealthScore:  ()            => api.get(API_ENDPOINTS.HEALTH_SCORE),
}
