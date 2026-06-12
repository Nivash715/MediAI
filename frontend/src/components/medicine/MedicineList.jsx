import MedicineCard from './MedicineCard'

export default function MedicineList({ medicines = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="h-32 skeleton" />
            <div className="p-3 space-y-2">
              <div className="h-3 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-5 skeleton rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!medicines.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">💊</div>
        <p className="font-semibold">No medicines found</p>
        <p className="text-sm mt-1">Try a different search or category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {medicines.map((m, i) => <MedicineCard key={m.id} medicine={m} index={i} />)}
    </div>
  )
}
