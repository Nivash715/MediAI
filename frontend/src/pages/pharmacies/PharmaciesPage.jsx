import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { pharmacyService } from '@services/pharmacyService'
import { useGeolocation } from '@hooks/useGeolocation'
import { useDebounce } from '@hooks/useDebounce'
import PageWrapper from '@components/layout/PageWrapper'
import { PharmacyList } from '@components/pharmacy'

const SORT_OPTIONS = [
  { value: 'distance',  label: 'Nearest' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'delivery',  label: 'Fastest Delivery' },
]

export default function PharmaciesPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('distance')
  const debouncedSearch = useDebounce(search, 400)
  const { coords } = useGeolocation()

  const { data, isLoading } = useQuery({
    queryKey: ['pharmacies', debouncedSearch, sort, coords],
    queryFn: () => pharmacyService.getAll({ q: debouncedSearch, sort, lat: coords?.lat, lng: coords?.lng }),
    select: (res) => res.data,
  })

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Pharmacies</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pharmacies…"
            className="input pl-10"
          />
        </div>
        <button className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Sort tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              sort === value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {coords && (
        <p className="flex items-center gap-1 text-xs text-green-600 mb-3">
          <MapPin className="w-3 h-3" /> Using your location
        </p>
      )}

      <PharmacyList pharmacies={data} loading={isLoading} />
    </PageWrapper>
  )
}
