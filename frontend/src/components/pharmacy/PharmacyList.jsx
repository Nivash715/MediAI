import PharmacyCard from './PharmacyCard'
import Spinner from '@components/common/Spinner'

export default function PharmacyList({ pharmacies = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="h-36 skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-4 skeleton rounded-lg w-2/3" />
              <div className="h-3 skeleton rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!pharmacies.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3">🏪</div>
        <p className="font-semibold">No pharmacies found</p>
        <p className="text-sm mt-1">Try a different search or location</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pharmacies.map((p, i) => <PharmacyCard key={p.id} pharmacy={p} index={i} />)}
    </div>
  )
}
