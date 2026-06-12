import { useQuery } from '@tanstack/react-query'
import { Users, ShoppingBag, TrendingUp, DollarSign, Package, Stethoscope } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import axios from '@services/api'
import { API_ENDPOINTS } from '@config/api.config'
import PageWrapper from '@components/layout/PageWrapper'
import { formatCurrency } from '@utils/helpers'

const KPI_COLORS = ['from-blue-500 to-primary-600', 'from-teal-500 to-green-500', 'from-amber-400 to-orange-500', 'from-purple-500 to-pink-500']
const PIE_COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => axios.get(API_ENDPOINTS.ADMIN_STATS || '/admin/stats'),
    select: (r) => r.data,
  })

  const kpis = [
    { label: 'Total Users',    value: stats?.totalUsers    || '12,453', icon: Users,       gradient: KPI_COLORS[0] },
    { label: 'Total Orders',   value: stats?.totalOrders   || '4,821',  icon: ShoppingBag, gradient: KPI_COLORS[1] },
    { label: 'Revenue',        value: stats?.revenue ? formatCurrency(stats.revenue) : '₹9.2L', icon: DollarSign,  gradient: KPI_COLORS[2] },
    { label: 'Consultations',  value: stats?.consultations || '1,087',  icon: Stethoscope, gradient: KPI_COLORS[3] },
  ]

  const revenueData = stats?.revenueChart || [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 58000 },
    { month: 'Mar', revenue: 51000 },
    { month: 'Apr', revenue: 73000 },
    { month: 'May', revenue: 65000 },
    { month: 'Jun', revenue: 92000 },
  ]

  const categoryData = stats?.categoryChart || [
    { name: 'Tablets',   value: 38 },
    { name: 'Ayurveda',  value: 22 },
    { name: 'Skincare',  value: 18 },
    { name: 'Baby Care', value: 12 },
    { name: 'Others',    value: 10 },
  ]

  const recentOrders = stats?.recentOrders || []

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-5">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {kpis.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white`}>
            <Icon className="w-5 h-5 mb-2 opacity-80" />
            <p className="text-xl font-black">{value}</p>
            <p className="text-xs opacity-80 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Revenue (₹)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} barCategoryGap="35%">
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              formatter={(v) => [formatCurrency(v), 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[6,6,0,0]} fill="url(#barGradient)" />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Sales by Category</h3>
        <div className="flex items-center gap-4">
          <PieChart width={120} height={120}>
            <Pie data={categoryData} cx={55} cy={55} innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value">
              {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
          </PieChart>
          <div className="flex-1 space-y-1.5">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-400">{c.name}</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left pb-2">Order ID</th>
                  <th className="text-left pb-2">Customer</th>
                  <th className="text-right pb-2">Amount</th>
                  <th className="text-right pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 font-mono text-gray-500">#{o.id.slice(-6)}</td>
                    <td className="py-2 text-gray-800 dark:text-gray-200">{o.customerName}</td>
                    <td className="py-2 text-right font-semibold text-gray-900 dark:text-white">{formatCurrency(o.total)}</td>
                    <td className="py-2 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
