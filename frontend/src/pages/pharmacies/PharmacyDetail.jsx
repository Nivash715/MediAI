import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Star, MapPin, Clock, Phone, Bike } from 'lucide-react'
import { pharmacyService } from '@services/pharmacyService'
import { medicineService } from '@services/medicineService'
import PageWrapper from '@components/layout/PageWrapper'
import { MedicineList } from '@components/medicine'
import Badge from '@components/common/Badge'
import Spinner from '@components/common/Spinner'

export default function PharmacyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: pharmacy, isLoading } = useQuery({
    queryKey: ['pharmacy', id],
    queryFn: () => pharmacyService.getById(id),
    select: (r) => r.data,
  })

  const { data: medicines, isLoading: medsLoading } = useQuery({
    queryKey: ['pharmacy-medicines', id],
    queryFn: () => medicineService.getByPharmacy(id),
    select: (r) => r.data,
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <PageWrapper padded={false}>
      {/* Header image */}
      <div className="relative h-44 bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-950 dark:to-teal-950 overflow-hidden">
        {pharmacy?.image
          ? <img src={pharmacy.image} alt={pharmacy.name} className="w-full h-full object-cover" />
          : <div className="flex items-center justify-center h-full text-6xl">🏪</div>
        }
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center shadow"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="absolute bottom-4 left-4">
          <Badge variant={pharmacy?.isOpen ? 'success' : 'danger'} dot>{pharmacy?.isOpen ? 'Open Now' : 'Closed'}</Badge>
        </div>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-xl font-black text-gray-900 dark:text-white">{pharmacy?.name}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{pharmacy?.rating} ({pharmacy?.reviewCount})</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pharmacy?.distance}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pharmacy?.deliveryTime}</span>
          <span className="flex items-center gap-1">
            <Bike className="w-3 h-3" />
            {pharmacy?.deliveryFee === 0 ? <span className="text-green-600 font-semibold">Free delivery</span> : `₹${pharmacy?.deliveryFee} delivery`}
          </span>
        </div>
        {pharmacy?.address && (
          <p className="text-xs text-gray-400 mt-2">{pharmacy.address}</p>
        )}

        <hr className="my-4 border-gray-100 dark:border-gray-800" />

        <h2 className="text-sm font-black text-gray-900 dark:text-white mb-4">Available Medicines</h2>
        <MedicineList medicines={medicines} loading={medsLoading} />
      </div>
    </PageWrapper>
  )
}
