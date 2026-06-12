import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useCart } from '@hooks/useCart'
import PageWrapper from '@components/layout/PageWrapper'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/helpers'
import { ROUTES } from '@config/routes.config'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, deliveryFee, tax, discount, total, coupon, applyCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">cart</div>
        <h2 className="font-black text-xl text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mt-2 mb-6">Add medicines to get started</p>
        <Button onClick={() => navigate(ROUTES.MEDICINES)}>Browse Medicines</Button>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Your Cart</h1>

      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {items.map((item) => {
            const med = item.medicine
            return (
              <motion.div
                key={med.id}
                layout
                exit={{ opacity: 0, x: -40 }}
                className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-2xl flex-shrink-0">
                  {med.image
                    ? <img src={med.image} className="w-12 h-12 object-contain" alt={med.name} />
                    : '💊'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{med.name || med.medicineName}</p>
                  <p className="text-xs text-gray-500">{med.brand || med.category}</p>
                  <p className="text-sm font-black text-primary-600 mt-0.5">{formatCurrency(med.price || 0)}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => item.quantity === 1 ? removeItem(med.id) : updateQty(med.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center active:scale-90 transition-all"
                  >
                    {item.quantity === 1
                      ? <Trash2 className="w-3 h-3 text-red-500" />
                      : <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                  </button>
                  <span className="text-sm font-bold text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(med.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-xl bg-primary-600 flex items-center justify-center active:scale-90 transition-all"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">Apply Coupon</span>
        </div>
        {coupon ? (
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">{coupon.code} — {coupon.label}</span>
            <button onClick={() => window.location.reload()} className="text-xs text-red-500">Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="MEDIAI10 or FIRST20"
              className="input flex-1 !py-2 !text-xs"
            />
            <Button size="sm" onClick={() => { applyCoupon(couponInput); setCouponInput('') }}>Apply</Button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Price Details</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Subtotal',    value: formatCurrency(subtotal) },
            { label: 'Delivery',    value: deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee) },
            { label: 'Taxes (5%)', value: formatCurrency(tax) },
            ...(discount > 0 ? [{ label: 'Discount', value: '-' + formatCurrency(discount), cls: 'text-green-600' }] : []),
          ].map(({ label, value, cls }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className={'font-semibold text-gray-900 dark:text-white ' + (cls || '')}>{value}</span>
            </div>
          ))}
          <hr className="border-gray-100 dark:border-gray-800" />
          <div className="flex justify-between font-black text-base">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-primary-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <Button fullWidth size="lg" onClick={() => navigate(ROUTES.PAYMENTS)}>
        Proceed to Checkout
      </Button>
    </PageWrapper>
  )
}
