import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-lg bg-slate-800/60 border border-blue-500/20">
      <div className="text-blue-300 text-sm">{label}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState({ total_orders: 0, revenue: 0, open_orders: 0 })
  const [menu, setMenu] = useState([])
  const [form, setForm] = useState({ title: '', price: 0, description: '' })
  const [slots, setSlots] = useState([])
  const [slotForm, setSlotForm] = useState({ label: '', start_time: '10:00', end_time: '22:00', capacity: 50 })

  const load = () => {
    fetch(`${API}/api/kpis`).then(r => r.json()).then(setKpis)
    fetch(`${API}/api/menu`).then(r => r.json()).then(setMenu)
    fetch(`${API}/api/slots`).then(r => r.json()).then(setSlots)
  }
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [])

  const addMenu = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/api/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: parseFloat(form.price) }) })
    if (res.ok) { setForm({ title: '', price: 0, description: '' }); load() }
  }

  const addSlot = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/api/slots`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(slotForm) })
    if (res.ok) { setSlotForm({ label: '', start_time: '10:00', end_time: '22:00', capacity: 50 }); load() }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">Operations Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Orders" value={kpis.total_orders} />
        <Stat label="Revenue" value={`$${kpis.revenue?.toFixed?.(2) || kpis.revenue}`} />
        <Stat label="Open Orders" value={kpis.open_orders} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-3">Manage Menu</h3>
          <form onSubmit={addMenu} className="space-y-2">
            <input className="w-full bg-slate-900/60 rounded p-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input className="w-full bg-slate-900/60 rounded p-2" placeholder="Price" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <textarea className="w-full bg-slate-900/60 rounded p-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <button className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2">Add Item</button>
          </form>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {menu.map((m, i) => (
              <div key={i} className="p-3 rounded bg-slate-900/60 border border-blue-500/10">
                <div className="font-semibold">{m.title}</div>
                <div className="text-xs text-blue-300/80">${m.price?.toFixed?.(2) || m.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-3">Delivery Slots</h3>
          <form onSubmit={addSlot} className="space-y-2">
            <input className="w-full bg-slate-900/60 rounded p-2" placeholder="Label" value={slotForm.label} onChange={e => setSlotForm({ ...slotForm, label: e.target.value })} required />
            <div className="grid grid-cols-2 gap-2">
              <input className="bg-slate-900/60 rounded p-2" placeholder="Start (HH:MM)" value={slotForm.start_time} onChange={e => setSlotForm({ ...slotForm, start_time: e.target.value })} required />
              <input className="bg-slate-900/60 rounded p-2" placeholder="End (HH:MM)" value={slotForm.end_time} onChange={e => setSlotForm({ ...slotForm, end_time: e.target.value })} required />
            </div>
            <input className="w-full bg-slate-900/60 rounded p-2" placeholder="Capacity" type="number" value={slotForm.capacity} onChange={e => setSlotForm({ ...slotForm, capacity: parseInt(e.target.value || '0', 10) })} required />
            <button className="w-full bg-blue-600 hover:bg-blue-500 rounded py-2">Add Slot</button>
          </form>
          <div className="mt-4 space-y-2">
            {slots.map((s, i) => (
              <div key={i} className="p-3 rounded bg-slate-900/60 border border-blue-500/10 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-xs text-blue-300/80">{s.start_time} - {s.end_time} • cap {s.capacity}</div>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-slate-700">{s.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
