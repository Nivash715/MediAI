import { useQuery } from '@tanstack/react-query'
import { HeartPulse, Activity, Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import axios from '@services/api'
import { API_ENDPOINTS } from '@config/api.config'
import PageWrapper from '@components/layout/PageWrapper'
import { formatDate } from '@utils/helpers'

const METRIC_ICONS = {
  'Heart Rate': { icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  'Blood Pressure': { icon: Activity, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  'Temperature': { icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  'Blood Sugar': { icon: Droplets, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
}

const TrendIcon = ({ trend }) => {
  if (trend === 'up')   return <TrendingUp className="w-3 h-3 text-red-500" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-green-500" />
  return <Minus className="w-3 h-3 text-gray-400" />
}

export default function HealthRecords() {
  const { data: records } = useQuery({
    queryKey: ['health-records'],
    queryFn: () => axios.get(API_ENDPOINTS.HEALTH_RECORDS),
    select: (r) => r.data,
  })

  const metrics = records?.metrics || []
  const timeline = records?.timeline || []
  const aiSummary = records?.aiSummary

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Health Records</h1>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-primary-600 to-teal-500 rounded-2xl p-4 text-white mb-5">
          <p className="text-xs font-bold opacity-80 mb-1">AI Monthly Summary</p>
          <p className="text-sm leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map((m) => {
          const config = METRIC_ICONS[m.name] || { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100' }
          const Icon = config.icon
          return (
            <div key={m.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{m.name}</p>
              <div className="flex items-end gap-1 mt-0.5">
                <span className="text-lg font-black text-gray-900 dark:text-white">{m.value}</span>
                <span className="text-xs text-gray-400 mb-0.5">{m.unit}</span>
                <TrendIcon trend={m.trend} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Medical Timeline */}
      <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">Medical History</h2>
      {timeline.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">No records available</div>
      ) : (
        <div className="relative pl-4">
          <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-4">
            {timeline.map((event) => (
              <div key={event.id} className="relative pl-4">
                <div className="absolute -left-[3px] top-2 w-3 h-3 rounded-full bg-primary-500 border-2 border-white dark:border-gray-950" />
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{event.title}</p>
                    <span className="text-[10px] text-gray-400">{formatDate(event.date)}</span>
                  </div>
                  {event.description && <p className="text-xs text-gray-500">{event.description}</p>}
                  {event.doctor && <p className="text-xs text-primary-600 mt-1">Dr. {event.doctor}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
