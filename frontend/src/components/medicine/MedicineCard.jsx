import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Pill } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import Badge from '@components/common/Badge'

export default function MedicineCard({ medicine, index = 0 }) {
  const { id, name, brand, price, mrp, image, category, requiresPrescription, inStock, discountPct } = medicine
  const { addItem, updateQty, removeItem, items } = useCart()
  const cartItem = items.find((i) => i.id === id)
  const qty = cartItem?.quantity || 0
  const discount = discountPct || (mrp && price ? Math.round(((mrp - price) / mrp) * 100) : 0)

  const handleAdd = (e) => {
    e.preventDefault()
    addItem({ ...medicine, quantity: 1 })
  }
  const handleInc = (e) => { e.preventDefault(); updateQty(id, qty + 1) }
  const handleDec = (e) => { e.preventDefault(); qty === 1 ? removeItem(id) : updateQty(id, qty - 1) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="h-24 w-auto object-contain" />
        ) : (
          <Pill className="w-12 h-12 text-primary-300" />
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
            {discount}% OFF
          </span>
        )}
        {requiresPrescription && (
          <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-lg">Rx</span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500">Out of stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{category}</p>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{name}</h3>
        {brand && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{brand}</p>}

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-black text-gray-900 dark:text-white text-sm">₹{price}</span>
            {mrp && mrp > price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{mrp}</span>
            )}
          </div>

          {inStock && (
            qty === 0 ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold text-xs hover:bg-primary-100 active:scale-95 transition-all"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleDec} className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all">
                  <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </button>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-5 text-center">{qty}</span>
                <button onClick={handleInc} className="w-7 h-7 rounded-xl bg-primary-600 flex items-center justify-center hover:bg-primary-700 active:scale-90 transition-all">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}
