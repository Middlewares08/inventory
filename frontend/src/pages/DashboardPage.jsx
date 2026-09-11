import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import '../App.css'

function DashboardPage() {
  const { user, logout } = useAuth()
  const [status, setStatus] = useState('checking...')
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.health()
      .then(() => setStatus('connected'))
      .catch(() => setStatus('unreachable'))

    api.listItems()
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Inventory &amp; Monitoring</h1>
        <div>
          {user?.email && <span className="user-email">{user.email}</span>}
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <p>Backend status: {status}</p>

      <h2>Items</h2>
      {error && <p className="error">{error}</p>}
      {!error && items.length === 0 && <p>No items yet.</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — {item.quantity} {item.unit ?? ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DashboardPage
