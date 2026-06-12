import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const variants = {
  primary:   'btn-primary',
  outline:   'btn-outline',
  ghost:     'btn-ghost',
  danger:    'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50',
  success:   'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50',
}

const sizes = {
  sm: 'px-3 py-2 text-xs rounded-xl',
  md: '',
  lg: 'px-6 py-4 text-base rounded-3xl',
}

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, fullWidth = false,
  className = '', ...props
}) {
  return (
    <button
      className={clsx(variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
