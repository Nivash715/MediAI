import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems]           = useState([])       // [{ medicine, quantity, pharmacyId }]
  const [pharmacyId, setPharmacyId] = useState(null)
  const [coupon, setCoupon]         = useState(null)

  /* ── Derived values ─────────────────────────────────────── */
  const subtotal     = useMemo(() => items.reduce((s, i) => s + i.medicine.price * i.quantity, 0), [items])
  const deliveryFee  = useMemo(() => (subtotal > 299 ? 0 : 29), [subtotal])
  const tax          = useMemo(() => Math.round(subtotal * 0.05), [subtotal])
  const discount     = coupon ? Math.round(subtotal * (coupon.percent / 100)) : 0
  const total        = subtotal + deliveryFee + tax - discount
  const itemCount    = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])

  /* ── Actions ────────────────────────────────────────────── */
  const addItem = useCallback((medicine, qty = 1) => {
    // Block mixing pharmacies
    if (pharmacyId && medicine.pharmacyId !== pharmacyId) {
      toast.error('Clear cart to order from a different pharmacy')
      return false
    }
    setPharmacyId(medicine.pharmacyId)
    setItems(prev => {
      const idx = prev.findIndex(i => i.medicine.id === medicine.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty }
        return updated
      }
      return [...prev, { medicine, quantity: qty }]
    })
    toast.success(`${medicine.medicineName} added to cart`)
    return true
  }, [pharmacyId])

  const removeItem = useCallback((medicineId) => {
    setItems(prev => {
      const next = prev.filter(i => i.medicine.id !== medicineId)
      if (next.length === 0) setPharmacyId(null)
      return next
    })
  }, [])

  const updateQty = useCallback((medicineId, qty) => {
    if (qty <= 0) { removeItem(medicineId); return }
    setItems(prev => prev.map(i => i.medicine.id === medicineId ? { ...i, quantity: qty } : i))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    setPharmacyId(null)
    setCoupon(null)
  }, [])

  const applyCoupon = useCallback((code) => {
    const coupons = { MEDIAI10: { percent: 10, label: '10% OFF' }, FIRST20: { percent: 20, label: '20% OFF for new users' } }
    const found = coupons[code.toUpperCase()]
    if (found) { setCoupon({ ...found, code }); toast.success(`Coupon applied: ${found.label}`) }
    else toast.error('Invalid coupon code')
  }, [])

  return (
    <CartContext.Provider value={{
      items, pharmacyId, coupon, subtotal, deliveryFee, tax, discount, total, itemCount,
      addItem, removeItem, updateQty, clearCart, applyCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
