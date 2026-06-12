import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Phone, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { orderService } from '@services/orderService'
import PageWrapper from '@components/layout/PageWrapper'
import { OrderTimeline } from '@components/order'
import Spinner from '@components/common/Spinner'

export default function DeliveryPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const { data: tracking, isLoading } = useQuery({
    queryKey: ['delivery', orderId],
    queryFn: () => orderService.trackDelivery(orderId),
    select: (r) => r.data,
    refetchInterval: 15000,
  })

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <PageWrapper padded={false}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-[64px] z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-base font-black text-gray-900 dark:text-white">Live Tracking</h1>
      </div>

      {/* ETA Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-500 px-4 py-4">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-white/80 flex-shrink-0" />
          <div className="text-white">
            <p className="text-xl font-black">{tracking?.eta || '25–30 min'}</p>
            <p className="text-xs opacity-80">Estimated Delivery</p>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="h-52 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapPin className="w-10 h-10 mx-auto mb-2 text-primary-400" />
            <p className="text-xs">Map loading…</p>
            <p className="text-[10px] mt-0.5">Google Maps integration required</p>
          </div>
        </div>
        {/* Animated delivery partner dot */}
        <motion.div
          className="absolute w-6 h-6 rounded-full bg-primary-600 shadow-lg border-2 border-white flex items-center justify-center"
          animate={{ top: ['40%', '45%', '40%'], left: ['45%', '50%', '45%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <span className="text-[10px]">🛵</span>
        </motion.div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Delivery partner */}
        {tracking?.partner && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Delivery Partner</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xl">
                {tracking.partner.avatar || '👤'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{tracking.partner.name}</p>
                <p className="text-xs text-gray-500">{tracking.partner.vehicle}</p>
              </div>
              <a
                href={`tel:${tracking.partner.phone}`}
                className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-green-600" />
              </a>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Delivery Progress</h3>
          <OrderTimeline status={tracking?.status || 'preparing'} />
        </div>
      </div>
    </PageWrapper>
  )
}
