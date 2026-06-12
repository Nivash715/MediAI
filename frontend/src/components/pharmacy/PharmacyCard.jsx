import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, Bike } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from '@components/common/Badge'
import { ROUTES, buildPath } from '@config/routes.config'

export default function PharmacyCard({ pharmacy, index = 0 }) {
  const { id, name, rating, reviewCount, deliveryTime, deliveryFee, distance, isOpen, tags = [], image } = pharmacy

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={buildPath(ROUTES.PHARMACY_DETAIL, { id })} className="block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden">
          {/* Image */}
          <div className="relative h-36 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-950 dark:to-teal-950 overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl">🏪</div>
            )}
            <div className="absolute top-2 left-2">
              <Badge variant={isOpen ? 'success' : 'danger'} dot>{isOpen ? 'Open' : 'Closed'}</Badge>
            </div>
            {deliveryFee === 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="info">Free Delivery</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 truncate">{name}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">{rating}</span>
                <span>({reviewCount})</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />{distance}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />{deliveryTime}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Bike className="w-3 h-3" />
                {deliveryFee === 0 ? <span className="text-green-600 font-semibold">Free</span> : `₹${deliveryFee}`}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px]">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
