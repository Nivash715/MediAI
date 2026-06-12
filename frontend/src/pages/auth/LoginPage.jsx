import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'
import { authService } from '@services/authService'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import { loginSchema, otpLoginSchema } from '@utils/validators'
import { ROUTES } from '@config/routes.config'

export default function LoginPage() {
  const [mode, setMode] = useState('email') // 'email' | 'otp'
  const [otpSent, setOtpSent] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const { login, loginWithOtp } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from?.pathname || ROUTES.HOME

  const emailForm = useForm({ resolver: zodResolver(loginSchema) })
  const otpForm   = useForm({ resolver: zodResolver(otpLoginSchema) })

  const onEmailSubmit = async (data) => {
    await login({ email: data.email, password: data.password })
    navigate(from, { replace: true })
  }

  const onSendOtp = async () => {
    const mobile = otpForm.getValues('mobile')
    if (!mobile) { otpForm.setError('mobile', { message: 'Enter mobile number' }); return }
    try {
      await authService.sendOtp(mobile)
      setOtpSent(true)
    } catch { /* toast shown by interceptor */ }
  }

  const onVerifyOtp = async (data) => {
    await loginWithOtp({ mobile: data.mobile, otp: data.otp, step: 'verify' })
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-teal-500 flex items-center justify-center shadow-medical">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <span className="font-black text-2xl bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">MediAI</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-medical p-6 border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to continue your health journey</p>

          {/* Mode switch */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6">
            {['email', 'otp'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setOtpSent(false) }}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${mode === m ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-400'}`}
              >
                {m === 'email' ? 'Email' : 'OTP'}
              </button>
            ))}
          </div>

          {mode === 'email' ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...emailForm.register('email')}
                error={emailForm.formState.errors.email?.message}
              />
              <Input
                label="Password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                rightIcon={showPwd ? EyeOff : Eye}
                onRightIconClick={() => setShowPwd((v) => !v)}
                {...emailForm.register('password')}
                error={emailForm.formState.errors.password?.message}
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary-600 font-semibold">Forgot password?</button>
              </div>
              <Button type="submit" fullWidth loading={emailForm.formState.isSubmitting}>Sign In</Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
              <Input
                label="Mobile number"
                type="tel"
                placeholder="9876543210"
                icon={Phone}
                maxLength={10}
                {...otpForm.register('mobile')}
                error={otpForm.formState.errors.mobile?.message}
              />
              {otpSent && (
                <Input
                  label="OTP"
                  type="text"
                  placeholder="6-digit OTP"
                  maxLength={6}
                  {...otpForm.register('otp')}
                  error={otpForm.formState.errors.otp?.message}
                  hint="Check your SMS for the OTP"
                />
              )}
              {!otpSent ? (
                <Button type="button" fullWidth onClick={onSendOtp}>Send OTP</Button>
              ) : (
                <Button type="submit" fullWidth loading={otpForm.formState.isSubmitting}>Verify & Sign In</Button>
              )}
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary-600 font-semibold">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
