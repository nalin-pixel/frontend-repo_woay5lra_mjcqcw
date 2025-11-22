import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CustomerPortal() {
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState({})
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/menu`).then(r => r.json()).then(setMenu).catch(() => setMenu([]))
  }, [])

  const addToCart = (id, item) => {
    setCart(prev => ({ ...prev, [id]: { item, qty: (prev[id]?.qty || 0) + 1 } }))
  }

  const removeFromCart = (id) => {
    setCart(prev => {
      const next = { ...prev }
      if (!next[id]) return next
      next[id].qty -= 1
      if (next[id].qty <= 0) delete next[id]
      return next
    })
  }

  const total = Object.values(cart).reduce((sum, row) => sum + row.item.price * row.qty, 0)

  const placeOrder = async () => {
    setLoading(true)
    try {
      const items = Object.entries(cart).map(([id, row]) => ({ menu_item_id: id, quantity: row.qty }))
      const payload = {
        items,
        customer: { name: 'Guest', phone: '0000000000', address: 'N/A' },
        payment_method: 'card'
      }
      const res = await fetch(`${API}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      setOrder(data)
      setCart({})
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">Browse Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.map(m => (
          <div key={m.title + m.price} className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-4">
            <div className="font-semibold">{m.title}</div>
            <div className="text-blue-200/80 text-sm mb-2">{m.description}</div>
            <div className="flex items-center justify-between">
              <span className="text-blue-300 font-mono">${m.price.toFixed(2)}</span>
              <button onClick={() => addToCart(m._id || m.id || m.title, m)} className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500">Add</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-800/60 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-3">Your Cart</h3>
        {Object.keys(cart).length === 0 ? (
          <p className="text-blue-200/80">Cart is empty</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(cart).map(([id, row]) => (
              <div key={id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{row.item.title}</div>
                  <div className="text-xs text-blue-300/80">Qty: {row.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(id)} className="px-2 py-1 bg-slate-700 rounded">-</button>
                  <button onClick={() => addToCart(id, row.item)} className="px-2 py-1 bg-slate-700 rounded">+</button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-blue-500/20">
              <div className="font-semibold">Total</div>
              <div className="font-mono">${total.toFixed(2)}</div>
            </div>
            <button disabled={loading || total === 0} onClick={placeOrder} className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-md py-2">
              {loading ? 'Placing...' : 'Place Order & Pay'}
            </button>
          </div>
        )}
      </div>

      {order && (
        <div className="mt-6 p-4 rounded-lg bg-emerald-900/40 border border-emerald-500/30">
          <div className="font-semibold">Order placed!</div>
          <div className="text-sm text-emerald-200/80">Order ID: {order.order_id}</div>
          <div className="text-sm text-emerald-200/80">Amount: ${order.amount?.toFixed?.(2) || order.amount}</div>
        </div>
      )}
    </div>
  )
}
