import { clsx } from 'clsx'

const variants = {
  primary:  'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  success:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  warning:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  danger:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  info:     'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  neutral:  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export default function Badge({ children, variant = 'neutral', className = '', dot = false }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
      variants[variant],
      className,
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full bg-current')} />}
      {children}
    </span>
  )
}
