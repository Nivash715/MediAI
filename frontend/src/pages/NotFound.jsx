import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '@components/common/Button'
import { ROUTES } from '@config/routes.config'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8 text-center">
      <div className="text-7xl mb-4">🔍</div>
      <h1 className="font-black text-4xl text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-500 mt-2 mb-6">Page not found</p>
      <Button onClick={() => navigate(ROUTES.HOME)}>
        <Home className="w-4 h-4" /> Go Home
      </Button>
    </div>
  )
}
