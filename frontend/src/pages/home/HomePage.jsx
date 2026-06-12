import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Mic, Stethoscope, Pill, Truck, HeartPulse, ShieldAlert, Bot, ChevronRight, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import PageWrapper from '@components/layout/PageWrapper'
import { ROUTES } from '@config/routes.config'
import { getGreeting } from '@utils/helpers'

const QUICK_ACTIONS = [
  { icon: Pill,        label: 'Medicines',   route: ROUTES.MEDICINES,   color: 'from-blue-500 to-primary-600' },
  { icon: Stethoscope, label: 'Consult',     route: ROUTES.CONSULTATION, color: 'from-teal-500 to-green-500' },
  { icon: Bot,         label: 'AI Chat',     route: ROUTES.AI_ASSISTANT, color: 'from-purple-500 to-pink-500' },
  { icon: HeartPulse,  label: 'Symptom AI',  route: ROUTES.SYMPTOM_CHECKER, color: 'from-red-400 to-rose-500' },
  { icon: Truck,       label: 'Track Order', route: ROUTES.ORDERS,       color: 'from-amber-400 to-orange-500' },
  { icon: ShieldAlert, label: 'Emergency',   route: ROUTES.EMERGENCY,    color: 'from-red-600 to-red-700' },
]

const CATEGORIES = [
  { emoji: '💊', label: 'Tablets' },
  { emoji: '💉', label: 'Injections' },
  { emoji: '🌿', label: 'Ayurveda' },
  { emoji: '🧴', label: 'Skincare' },
  { emoji: '👶', label: 'Baby Care' },
  { emoji: '🦷', label: 'Dental' },
  { emoji: '👁️', label: 'Eye Care' },
  { emoji: '💆', label: 'Wellness' },
]

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`${ROUTES.MEDICINES}?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <PageWrapper padded={false}>
      {/* Hero gradient banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 px-5 pt-6 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary-200 text-sm font-medium">{getGreeting()},</p>
          <h1 className="text-white font-black text-2xl mt-0.5">
            {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-primary-200 text-xs mt-1">How can MediAI help you today?</p>
        </motion.div>
      </div>

      {/* Search bar floating over hero */}
      <div className="px-4 -mt-8 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-medical-lg p-3 border border-gray-100 dark:border-gray-800"
        >
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0 ml-1" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 bg-transparent outline-none"
            placeholder="Search medicines, symptoms, doctors…"
          />
          <button type="button" className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/30">
            <Mic className="w-4 h-4 text-primary-600" />
          </button>
        </motion.form>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Quick actions */}
        <section>
          <h2 className="text-sm font-black text-gray-900 dark:text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, route, color }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(route)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover active:scale-95 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Categories</h2>
            <button onClick={() => navigate(ROUTES.MEDICINES)} className="text-xs text-primary-600 font-semibold flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(({ emoji, label }) => (
              <button
                key={label}
                onClick={() => navigate(`${ROUTES.MEDICINES}?category=${encodeURIComponent(label)}`)}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card active:scale-95 transition-all"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Health tip */}
        <section>
          <div className="bg-gradient-to-r from-teal-500 to-primary-600 rounded-2xl p-4 text-white">
            <div className="flex items-start gap-3">
              <HeartPulse className="w-8 h-8 flex-shrink-0 opacity-90" />
              <div>
                <p className="font-bold text-sm">AI Health Tip of the Day</p>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">
                  Staying hydrated helps maintain medication efficacy. Aim for 8 glasses of water daily.
                </p>
                <button
                  onClick={() => navigate(ROUTES.AI_ASSISTANT)}
                  className="mt-2 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Chat with AI →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Near pharmacies CTA */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Nearby Pharmacies</h2>
            <button onClick={() => navigate(ROUTES.PHARMACIES)} className="text-xs text-primary-600 font-semibold flex items-center gap-1">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => navigate(ROUTES.PHARMACIES)}
            className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl flex-shrink-0">🏪</div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Find pharmacies near you</p>
              <p className="text-xs text-gray-500 mt-0.5">Fast delivery • Open now • Verified</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
          </button>
        </section>
      </div>
    </PageWrapper>
  )
}
