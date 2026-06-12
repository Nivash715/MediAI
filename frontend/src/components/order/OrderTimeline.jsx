import { CheckCircle, Circle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const STEPS = [
  { key: 'placed',     label: 'Placed' },
  { key: 'confirmed',  label: 'Confirmed' },
  { key: 'preparing',  label: 'Preparing' },
  { key: 'picked_up',  label: 'Picked Up' },
  { key: 'delivered',  label: 'Delivered' },
]

const STATUS_INDEX = {
  placed: 0, confirmed: 1, preparing: 2, picked_up: 3, delivered: 4, cancelled: -1,
}

export default function OrderTimeline({ status, compact = false }) {
  const current = STATUS_INDEX[status] ?? 0

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => {
          const done    = i < current
          const active  = i === current
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className={clsx(
                'w-2 h-2 rounded-full transition-colors flex-shrink-0',
                done   ? 'bg-green-500' :
                active ? 'bg-primary-600 ring-2 ring-primary-200' :
                         'bg-gray-200 dark:bg-gray-700',
              )} />
              {i < STEPS.length - 1 && (
                <div className={clsx('flex-1 h-0.5 transition-colors', done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700')} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {STEPS.map((s, i) => {
        const done   = i < current
        const active = i === current
        const future = i > current
        return (
          <div key={s.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                done   ? 'bg-green-100 dark:bg-green-900/30' :
                active ? 'bg-primary-100 dark:bg-primary-900/30' :
                         'bg-gray-100 dark:bg-gray-800',
              )}>
                {done   ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                 active ? <Loader2 className="w-4 h-4 text-primary-600 animate-spin" /> :
                          <Circle className="w-4 h-4 text-gray-400" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('w-0.5 h-8 mt-1 transition-colors', done ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700')} />
              )}
            </div>
            <div className="pt-1.5">
              <p className={clsx('text-sm font-semibold',
                done   ? 'text-green-700 dark:text-green-400' :
                active ? 'text-primary-700 dark:text-primary-400' :
                         'text-gray-400',
              )}>{s.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
