import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingBag, ClipboardList, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@hooks/useCart'
import { ROUTES } from '@config/routes.config'

const NAV_ITEMS = [
  { to: ROUTES.HOME,      icon: Home,         label: 'Home' },
  { to: ROUTES.MEDICINES, icon: Search,        label: 'Medicines' },
  { to: ROUTES.CART,      icon: ShoppingBag,   label: 'Cart',   badge: true },
  { to: ROUTES.ORDERS,    icon: ClipboardList, label: 'Orders' },
  { to: ROUTES.PROFILE,   icon: UserCircle,    label: 'Profile' },
]

export default function BottomNav() {
  const { itemCount } = useCart()
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800"
      style={{ height: 'calc(var(--bottom-nav) + var(--safe-bottom))', paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="flex h-[72px] items-center">
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => {
          const active = pathname === to || (to !== ROUTES.HOME && pathname.startsWith(to))
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            >
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 rounded-xl bg-primary-100 dark:bg-primary-900/30 -m-1.5"
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                  />
                )}
                <Icon className={`relative w-5 h-5 transition-colors ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                {badge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary-600' : 'text-gray-400'}`}>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
