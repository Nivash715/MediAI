import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus, Minus, ShieldAlert, Info, Pill } from 'lucide-react'
import { medicineService } from '@services/medicineService'
import { useCart } from '@hooks/useCart'
import PageWrapper from '@components/layout/PageWrapper'
import Badge from '@components/common/Badge'
import Button from '@components/common/Button'
import Spinner from '@components/common/Spinner'
import { formatCurrency } from '@utils/helpers'

export default function MedicineDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, updateQty, removeItem, items } = useCart()

  const { data: medicine, isLoading } = useQuery({
    queryKey: ['medicine', id],
    queryFn: () => medicineService.getById(id),
    select: (r) => r.data,
  })

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  const cartItem = items.find((i) => i.id === id)
  const qty = cartItem?.quantity || 0
  const discount = medicine?.discount_pct || (medicine?.mrp && medicine?.price ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100) : 0)

  return (
    <PageWrapper padded={false}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-[64px] z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-base font-black text-gray-900 dark:text-white truncate">{medicine?.name}</h1>
      </div>

      {/* Image */}
      <div className="h-52 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 flex items-center justify-center relative">
        {medicine?.image_url
          ? <img src={medicine.image_url} alt={medicine.name} className="h-40 w-auto object-contain" />
          : <Pill className="w-20 h-20 text-primary-200" />
        }
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-xl">{discount}% OFF</span>
        )}
        {medicine?.requires_prescription && (
          <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-xl">Rx Required</span>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Name + pricing */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{medicine?.name}</h2>
              {medicine?.brand && <p className="text-sm text-gray-500">{medicine.brand}</p>}
              {medicine?.category && <Badge variant="info" className="mt-1">{medicine.category}</Badge>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-black text-primary-600">{formatCurrency(medicine?.price)}</p>
              {medicine?.mrp > medicine?.price && (
                <p className="text-sm text-gray-400 line-through">{formatCurrency(medicine?.mrp)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {medicine?.description && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">About</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{medicine.description}</p>
          </div>
        )}

        {/* Dosage info */}
        {(medicine?.dosage_form || medicine?.strength) && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Dosage Info</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {medicine?.dosage_form && <div><span className="text-gray-400">Form:</span> <span className="font-medium text-gray-700 dark:text-gray-300">{medicine.dosage_form}</span></div>}
              {medicine?.strength && <div><span className="text-gray-400">Strength:</span> <span className="font-medium text-gray-700 dark:text-gray-300">{medicine.strength}</span></div>}
              {medicine?.manufacturer && <div className="col-span-2"><span className="text-gray-400">Manufacturer:</span> <span className="font-medium text-gray-700 dark:text-gray-300">{medicine.manufacturer}</span></div>}
            </div>
          </div>
        )}

        {/* Side effects */}
        {medicine?.side_effects && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Side Effects</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{medicine.side_effects}</p>
          </div>
        )}

        {/* Add to cart */}
        {medicine?.in_stock ? (
          <div className="sticky bottom-safe-bottom pt-2">
            {qty === 0 ? (
              <Button fullWidth size="lg" onClick={() => addItem({ ...medicine, id: medicine.id, quantity: 1 })}>
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-3 shadow-medical">
                <button
                  onClick={() => qty === 1 ? removeItem(medicine.id) : updateQty(medicine.id, qty - 1)}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <span className="flex-1 text-center text-xl font-black text-gray-900 dark:text-white">{qty}</span>
                <button
                  onClick={() => updateQty(medicine.id, qty + 1)}
                  className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm font-semibold">Currently out of stock</div>
        )}
      </div>
    </PageWrapper>
  )
}
