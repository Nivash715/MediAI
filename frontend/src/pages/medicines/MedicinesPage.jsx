import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { medicineService } from '@services/medicineService'
import { useDebounce } from '@hooks/useDebounce'
import PageWrapper from '@components/layout/PageWrapper'
import { MedicineList } from '@components/medicine'

const CATEGORIES = ['All', 'Tablets', 'Injections', 'Ayurveda', 'Skincare', 'Baby Care', 'Dental', 'Eye Care', 'Wellness', 'Vitamins']

export default function MedicinesPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useQuery({
    queryKey: ['medicines', debouncedSearch, category],
    queryFn: () => medicineService.getAll({ q: debouncedSearch, category: category === 'All' ? undefined : category }),
    select: (r) => r.data,
  })

  return (
    <PageWrapper>
      <h1 className="text-lg font-black text-gray-900 dark:text-white mb-4">Medicines</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search medicines…" className="input pl-10" />
        </div>
        <button className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              category === c
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <MedicineList medicines={data} loading={isLoading} />
    </PageWrapper>
  )
}
