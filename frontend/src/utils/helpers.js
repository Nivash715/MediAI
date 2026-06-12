/** Format a number as Indian Rupees */
export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n)

/** Format ISO date string */
export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))

/** Format ISO date as time */
export const formatTime = (d) =>
  new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(d))

/** Relative time string */
export function formatRelative(d) {
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60)    return 'Just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return formatDate(d)
}

/** Time-of-day greeting */
export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Alias */
export const getGreeting = greeting

/** Calculate discount percentage */
export const discountPct = (mrp, price) => Math.round(((mrp - price) / mrp) * 100)

/** Truncate long text */
export const truncate = (str, n = 60) => str.length > n ? str.slice(0, n) + '...' : str

/** Convert order status to Badge variant name */
export function statusClass(s) {
  const map = {
    placed:           'primary',
    confirmed:        'info',
    verified:         'info',
    packing:          'warning',
    preparing:        'warning',
    picked_up:        'warning',
    out_for_delivery: 'warning',
    delivered:        'success',
    cancelled:        'danger',
  }
  return map[s] || 'neutral'
}

/** Human-readable order status */
export function statusLabel(s) {
  const map = {
    placed:           'Order Placed',
    verified:         'Pharmacist Verified',
    packing:          'Packing',
    out_for_delivery: 'Out for Delivery',
    delivered:        'Delivered',
    cancelled:        'Cancelled',
  }
  return map[s] || s
}

/** Generate initials from name */
export const initials = (name) =>
  (name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
