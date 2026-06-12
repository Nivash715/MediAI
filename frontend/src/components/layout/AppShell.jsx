import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

// Pages that hide bottom nav (e.g. full-screen flows)
const HIDE_BOTTOM_NAV = ['/checkout', '/payment', '/delivery']

export default function AppShell() {
  const { pathname } = useLocation()
  const hideNav = HIDE_BOTTOM_NAV.some((p) => pathname.startsWith(p))

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-0 sm:px-4 pt-0 pb-nav">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
