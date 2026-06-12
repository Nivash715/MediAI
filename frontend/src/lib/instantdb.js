/**
 * Backend-proxied InstantDB client.
 * The frontend calls backend endpoints which use the InstantDB Admin API.
 * Configure `VITE_API_BASE_URL` in frontend/.env if your backend runs elsewhere.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function query(q) {
  const res = await fetch(`${API_BASE}/api/instantdb/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q }),
  })
  if (!res.ok) throw new Error(`InstantDB query failed: ${res.status} ${res.statusText}`)
  const payload = await res.json()
  return payload.data
}

async function transact(steps) {
  const res = await fetch(`${API_BASE}/api/instantdb/transact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ steps }),
  })
  if (!res.ok) throw new Error(`InstantDB transact failed: ${res.status} ${res.statusText}`)
  return res.json()
}

export default { query, transact }

export { query, transact }
