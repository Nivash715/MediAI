import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, DollarSign, Check } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCart } from '@hooks/useCart'
import { useAuth } from '@hooks/useAuth'
import { paymentService } from '@services/paymentService'
import { orderService } from '@services/orderService'
import PageWrapper from '@components/layout/PageWrapper'
import Button from '@components/common/Button'
import { formatCurrency } from '@utils/helpers'
import { ROUTES, buildPath } from '@config/routes.config'

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Cards / UPI / Net Banking', icon: CreditCard, desc: 'Powered by Razorpay' },
  { id: 'upi',      label: 'UPI',                       icon: Smartphone,  desc: 'Google Pay, PhonePe, BHIM' },
  { id: 'cod',      label: 'Cash on Delivery',          icon: DollarSign,  desc: 'Pay when you receive' },
]

export default function PaymentsPage() {
  const [method, setMethod] = useState('razorpay')
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      // 1. Create order
      const orderRes = await orderService.create({ items, paymentMethod: method })
      const order = orderRes.data

      if (method === 'cod') return order

      // 2. Initiate Razorpay payment
      const payRes = await paymentService.initiate({ orderId: order.id, amount: total })
      const payData = payRes.data

      // 3. Open Razorpay checkout
      await paymentService.openRazorpay({
        orderId: payData.razorpayOrderId,
        amount: total,
        prefill: { name: user?.name, email: user?.email, contact: user?.mobile },
        onSuccess: async (response) => {
          await paymentService.verify({ ...response, orderId: order.id })
        },
      })

      return order
    },
    onSuccess: (order) => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate(buildPath(ROUTES.ORDER_DETAIL, { id: order.id }))
    },
    onError: (err) => {
      if (err.message !== 'Payment dismissed') toast.error('Payment failed. Please try again.')
    },
  })

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-5">Checkout</h1>

      {/* Payment methods */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Payment Method</h2>
        {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              method === id
                ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method === id ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Icon className={`w-5 h-5 ${method === id ? 'text-primary-600' : 'text-gray-500'}`} />
            </div>
            <div className="text-left flex-1">
              <p className={`text-sm font-bold ${method === id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-800 dark:text-white'}`}>{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            {method === id && (
              <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Order Summary</h3>
        <div className="space-y-1.5 text-xs text-gray-500 mb-3">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span className="truncate flex-1 mr-2">{i.name} ×{i.quantity}</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <hr className="border-gray-100 dark:border-gray-800 mb-3" />
        <div className="flex justify-between font-black text-base">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button fullWidth size="lg" loading={placeOrderMutation.isPending} onClick={() => placeOrderMutation.mutate()}>
        {method === 'cod' ? `Place Order · ${formatCurrency(total)}` : `Pay ${formatCurrency(total)}`}
      </Button>
    </PageWrapper>
  )
}
