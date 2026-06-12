import { useState, useCallback } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude })
        setLoading(false)
      },
      (err) => { setError(err.message); setLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  return { location, error, loading, getLocation }
}
