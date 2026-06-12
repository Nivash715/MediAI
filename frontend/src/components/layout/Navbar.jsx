import { Link, useNavigate } from 'react-router-dom'
import { Bell, ShoppingCart, Search, Sun, Moon, Menu } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { useCart } from '@hooks/useCart'
import { useTheme } from '@hooks/useTheme'
import { ROUTES } from '@config/routes.config'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800" style={{ height: 'var(--nav-height)' }}>
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-medical">
            <span className="text-white text-xs font-black">M</span>
          </div>
          <span className="font-black text-lg bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">MediAI</span>
        </Link>

        {/* Desktop search */}
        <button
          onClick={() => navigate(ROUTES.MEDICINES)}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-64"
        >
          <Search className="w-4 h-4" />
          Search medicines…
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
          </button>

          <Link to={ROUTES.CART} className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {user && (
            <Link to={ROUTES.NOTIFICATIONS} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:block">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
          )}

          {/* Profile / Login */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-teal-400 text-white text-sm font-bold flex items-center justify-center ml-1"
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-11 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                  >
                    <Link to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Profile</Link>
                    <Link to={ROUTES.ORDERS} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Orders</Link>
                    <hr className="my-1 border-gray-100 dark:border-gray-800" />
                    <button onClick={() => { logout(); setMenuOpen(false) }} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Log out</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to={ROUTES.LOGIN} className="hidden md:block btn-primary !py-2 !px-4 !text-xs ml-2">Sign in</Link>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen((v) => !v)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {user ? (
                <>
                  <Link to={ROUTES.PROFILE} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-gray-700 dark:text-gray-300">Profile</Link>
                  <Link to={ROUTES.ORDERS} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-gray-700 dark:text-gray-300">Orders</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="py-2 text-left text-sm text-red-500">Log out</button>
                </>
              ) : (
                <Link to={ROUTES.LOGIN} onClick={() => setMenuOpen(false)} className="py-2 text-sm text-primary-600 font-semibold">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
