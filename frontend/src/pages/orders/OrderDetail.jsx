import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { orderService } from '@services/orderService'
import PageWrapper from '@components/layout/PageWrapper'
import { OrderTimeline } from '@components/order'
import Badge from '@components/common/Badge'
import Button from '@components/common/Button'
import Spinner from '@components/common/Spinner'
import { formatCurrency, formatDate, statusClass, statusLabel } from '@utils/helpers'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    select: (r) => r.data,
    refetchInterval: (data) => ['placed','confirmed','preparing','picked_up'].includes(data?.status) ? 15000 : false,
  })

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancel(id),
    onSuccess: () => { toast.success('Order cancelled'); qc.invalidateQueries(['order', id]) },
  })

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  const canCancel = ['placed', 'confirmed'].includes(order?.status)

  return (
    <PageWrapper padded={false}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-[64px] z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-base font-black text-gray-900 dark:text-white">Order #{order?.id?.slice(-8)?.toUpperCase()}</h1>
          <p className="text-xs text-gray-500">{formatDate(order?.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusClass(order?.status)}>{statusLabel(order?.status)}</Badge>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Delivery Status</h3>
          <OrderTimeline status={order?.status} />
        </div>

        {/* Items */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Items ({order?.items?.length})</h3>
          <div className="space-y-3">
            {order?.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Bill Summary</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Item total', value: formatCurrency(order?.subtotal) },
              { label: 'Delivery fee', value: order?.deliveryFee === 0 ? 'FREE' : formatCurrency(order?.deliveryFee) },
              { label: 'Taxes', value: formatCurrency(order?.tax) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>
              </div>
            ))}
            <hr className="border-gray-100 dark:border-gray-800" />
            <div className="flex justify-between font-black text-base">
              <span className="text-gray-900 dark:text-white">Total Paid</span>
              <span className="text-primary-600">{formatCurrency(order?.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canCancel && (
          <Button variant="danger" fullWidth loading={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
            Cancel Order
          </Button>
        )}

        <Button variant="outline" fullWidth onClick={() => navigate(`/delivery/${id}`)}>
          Track Delivery
        </Button>
      </div>
    </PageWrapper>
  )
}
