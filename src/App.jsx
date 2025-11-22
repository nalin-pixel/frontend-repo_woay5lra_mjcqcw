import Navbar from './components/Navbar'
import CustomerPortal from './components/CustomerPortal'
import KitchenBoard from './components/KitchenBoard'
import AdminDashboard from './components/AdminDashboard'

function HomeHero() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center text-white">
      <div>
        <h1 className="text-5xl font-bold mb-4">CloudChef</h1>
        <p className="text-blue-200/80 text-lg">Run your cloud kitchen end-to-end — menu, orders, payments, delivery, and KPIs in one place.</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <Navbar />
      <div className="relative">
        <HomeHero />
        <section id="customer" className="py-8"><CustomerPortal /></section>
        <section id="kitchen" className="py-8"><KitchenBoard /></section>
        <section id="admin" className="py-8"><AdminDashboard /></section>
      </div>
    </div>
  )
}

export default App
