import { useEffect, useState } from 'react'
import { api } from './api/client'
import './App.css'

function App() {
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
      <h1>Inventory & Monitoring</h1>
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

export default App
