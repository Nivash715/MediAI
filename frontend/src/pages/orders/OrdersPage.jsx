import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@services/orderService'
import { OrderCard } from '@components/order'
import PageWrapper from '@components/layout/PageWrapper'
import Spinner from '@components/common/Spinner'

const TABS = ['active', 'past']

export default function OrdersPage() {
  const [tab, setTab] = useState('active')

  const { data, isLoading } = useQuery({
    queryKey: ['orders', tab],
    queryFn: () => orderService.getAll({ status: tab }),
    select: (r) => r.data,
  })

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Orders</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl capitalize transition-all ${tab === t ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-12"><Spinner size="lg" /></div>
      ) : !data?.length ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p className="font-semibold">No {tab} orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
        </div>
      )}
    </PageWrapper>
  )
}
