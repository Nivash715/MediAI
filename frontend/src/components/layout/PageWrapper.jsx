import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function PageWrapper({ children, className = '', padded = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx('w-full', padded && 'px-4 py-5', className)}
    >
      {children}
    </motion.div>
  )
}
