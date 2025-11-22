import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function KitchenBoard() {
  const [orders, setOrders] = useState([])
  const fetchOrders = () => {
    fetch(`${API}/api/orders`).then(r => r.json()).then(setOrders).catch(() => setOrders([]))
  }
  useEffect(() => { fetchOrders(); const t = setInterval(fetchOrders, 4000); return () => clearInterval(t) }, [])

  const accept = async (id) => {
    await fetch(`${API}/api/orders/${id}/accept`, { method: 'POST' })
    fetchOrders()
  }
  const advance = async (id) => {
    await fetch(`${API}/api/orders/${id}/advance`, { method: 'POST' })
    fetchOrders()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">Kitchen Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o.id} className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-4">
            <div className="font-semibold mb-1">Order #{o.id?.slice(-6)}</div>
            <div className="text-xs text-blue-300/80 mb-2">{o.customer?.name} • {o.customer?.phone}</div>
            <ul className="text-sm list-disc ml-4 mb-3 text-blue-200/90">
              {o.items?.map((it, idx) => (
                <li key={idx}>x{it.quantity} {it.menu_item_id}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between">
              <span className="text-blue-300 font-mono">${o.total?.toFixed?.(2) || o.total}</span>
              <span className="px-2 py-1 rounded bg-slate-700 text-xs">{o.status}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {o.status === 'created' && (
                <button onClick={() => accept(o.id)} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500">Accept</button>
              )}
              {o.status !== 'delivered' && (
                <button onClick={() => advance(o.id)} className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500">Advance</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
