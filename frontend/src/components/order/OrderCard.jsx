import { Link } from 'react-router-dom'
import { ChevronRight, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from '@components/common/Badge'
import { statusClass, statusLabel, formatCurrency, formatRelative } from '@utils/helpers'
import { buildPath, ROUTES } from '@config/routes.config'
import OrderTimeline from './OrderTimeline'

export default function OrderCard({ order, index = 0 }) {
  const { id, status, items = [], total, createdAt, pharmacyName } = order

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={buildPath(ROUTES.ORDER_DETAIL, { id })} className="block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">#{id.slice(-8).toUpperCase()}</span>
              </div>
              {pharmacyName && <p className="text-sm font-semibold text-gray-800 dark:text-white">{pharmacyName}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusClass(status)}>{statusLabel(status)}</Badge>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Items preview */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">
            {items.map((i) => i.name).join(', ')}
          </div>

          <OrderTimeline status={status} compact />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400">{formatRelative(createdAt)}</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(total)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
