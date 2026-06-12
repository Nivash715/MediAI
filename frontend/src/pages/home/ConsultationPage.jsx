import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Star, Clock, Video, Phone, MessageSquare, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from '@services/api'
import { API_ENDPOINTS } from '@config/api.config'
import PageWrapper from '@components/layout/PageWrapper'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Badge from '@components/common/Badge'

const SPECIALIZATIONS = ['All', 'General', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic']

const CONSULT_TYPES = [
  { id: 'video', icon: Video,         label: 'Video' },
  { id: 'audio', icon: Phone,         label: 'Audio' },
  { id: 'chat',  icon: MessageSquare, label: 'Chat' },
]

export default function ConsultationPage() {
  const [spec, setSpec] = useState('All')
  const [selected, setSelected] = useState(null)
  const [type, setType] = useState('video')
  const [confirmed, setConfirmed] = useState(false)

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', spec],
    queryFn: () => axios.get(API_ENDPOINTS.CONSULTATIONS, { params: { specialization: spec === 'All' ? undefined : spec } }),
    select: (r) => r.data,
  })

  const bookMutation = useMutation({
    mutationFn: (data) => axios.post(API_ENDPOINTS.CONSULTATIONS, data),
    onSuccess: () => setConfirmed(true),
    onError: () => toast.error('Booking failed. Please try again.'),
  })

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Consult a Doctor</h1>

      {/* Specialization filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5">
        {SPECIALIZATIONS.map((s) => (
          <button
            key={s}
            onClick={() => setSpec(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              spec === s ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Doctors */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="flex gap-3"><div className="w-14 h-14 skeleton rounded-xl flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 skeleton rounded w-1/2" /><div className="h-3 skeleton rounded w-1/3" /></div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {doc.avatar || '👨‍⚕️'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{doc.specialization} · {doc.experience} yrs</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{doc.rating}</span>
                      </div>
                    </div>
                    <Badge variant={doc.isAvailable ? 'success' : 'neutral'} dot>
                      {doc.isAvailable ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-black text-primary-600">₹{doc.consultationFee}</span>
                    <Button size="sm" onClick={() => setSelected(doc)} disabled={!doc.isAvailable}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setConfirmed(false) }} title={confirmed ? 'Booking Confirmed!' : 'Book Consultation'}>
        {confirmed ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">All set!</h3>
            <p className="text-sm text-gray-500 mt-2">Your consultation with <strong>{selected?.name}</strong> has been booked.</p>
            <Button className="mt-5" fullWidth onClick={() => { setSelected(null); setConfirmed(false) }}>Done</Button>
          </div>
        ) : selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">👨‍⚕️</span>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.specialization}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Consultation Type</p>
              <div className="flex gap-2">
                {CONSULT_TYPES.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setType(id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${type === id ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-100 dark:border-gray-700 text-gray-500'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Consultation fee</span>
              <span className="text-lg font-black text-primary-600">₹{selected.consultationFee}</span>
            </div>

            <Button fullWidth loading={bookMutation.isPending} onClick={() => bookMutation.mutate({ doctorId: selected.id, type })}>
              Confirm Booking
            </Button>
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}
