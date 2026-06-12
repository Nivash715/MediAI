import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Bell, Moon, Shield, LogOut, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import PageWrapper from '@components/layout/PageWrapper'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { ROUTES } from '@config/routes.config'

const profileSchema = z.object({
  name:   z.string().min(2, 'Name required'),
  email:  z.string().email('Invalid email'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, '10-digit mobile'),
})

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '' },
  })

  const onSubmit = async (data) => {
    await updateUser(data)
    setEditing(false)
  }

  const MENU_ITEMS = [
    { icon: Bell,   label: 'Notifications', action: () => navigate(ROUTES.NOTIFICATIONS) },
    { icon: Moon,   label: `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`, action: toggleTheme },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
  ]

  return (
    <PageWrapper>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center text-white text-3xl font-black">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <Camera className="w-3 h-3 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <h2 className="font-black text-lg text-gray-900 dark:text-white mt-2">{user?.name}</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      {/* Profile form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Personal Info</h3>
          <button onClick={() => setEditing((v) => !v)} className="text-xs text-primary-600 font-semibold">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input label="Name"   {...register('name')}   error={errors.name?.message} />
            <Input label="Email"  type="email" {...register('email')}  error={errors.email?.message} />
            <Input label="Mobile" type="tel"   {...register('mobile')} error={errors.mobile?.message} />
            <Button type="submit" fullWidth size="sm" loading={isSubmitting}>Save Changes</Button>
          </form>
        ) : (
          <div className="space-y-2 text-sm">
            {[
              { label: 'Name',   value: user?.name },
              { label: 'Email',  value: user?.email },
              { label: 'Mobile', value: user?.mobile },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b last:border-0 border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu items */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 mb-4 overflow-hidden">
        {MENU_ITEMS.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b last:border-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="danger"
        fullWidth
        onClick={() => { logout(); navigate(ROUTES.LOGIN) }}
      >
        <LogOut className="w-4 h-4" /> Log Out
      </Button>
    </PageWrapper>
  )
}
