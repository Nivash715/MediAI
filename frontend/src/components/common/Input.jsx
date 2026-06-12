import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(function Input({
  label, error, hint, icon: Icon, rightIcon: RightIcon,
  onRightIconClick, className = '', ...props
}, ref) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={clsx(
            'input',
            Icon       && 'pl-11',
            RightIcon  && 'pr-11',
            error      && 'border-red-400 focus:ring-red-400',
            className,
          )}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  )
})

export default Input
