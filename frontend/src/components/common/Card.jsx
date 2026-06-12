import { clsx } from 'clsx'

export default function Card({ children, className = '', hover = false, glass = false, onClick, padding = 'md' }) {
  const pads = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' }
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card',
        glass && 'glass',
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer',
        !hover && onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        pads[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
