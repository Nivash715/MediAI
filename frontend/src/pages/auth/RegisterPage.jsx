import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { registerSchema } from '@utils/validators'
import { ROUTES } from '@config/routes.config'

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    await registerUser(data)
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-medical">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <span className="font-black text-2xl bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">MediAI</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-medical p-6 border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Start your AI-powered health journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full name" placeholder="John Doe" icon={User} {...register('name')} error={errors.name?.message} />
            <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} {...register('email')} error={errors.email?.message} />
            <Input label="Mobile" type="tel" placeholder="9876543210" icon={Phone} maxLength={10} {...register('mobile')} error={errors.mobile?.message} />
            <Input
              label="Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              icon={Lock}
              rightIcon={showPwd ? EyeOff : Eye}
              onRightIconClick={() => setShowPwd((v) => !v)}
              {...register('password')}
              error={errors.password?.message}
            />
            <Button type="submit" fullWidth loading={isSubmitting}>Create Account</Button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">
            By registering you agree to our{' '}
            <span className="text-primary-600">Terms</span> &amp; <span className="text-primary-600">Privacy Policy</span>
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
