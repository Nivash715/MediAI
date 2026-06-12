import { clsx } from 'clsx'

const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' }

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div className={clsx('rounded-full border-primary-200 border-t-primary-600 animate-spin', sizes[size], className)} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading…</p>
      </div>
    </div>
  )
}
