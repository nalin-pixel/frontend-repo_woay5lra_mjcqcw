import { Link, useLocation } from 'react-router-dom'

const NavLink = ({ to, label }) => {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-700/50'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur bg-slate-900/70 border-b border-blue-500/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-white font-semibold">
            <img src="/flame-icon.svg" alt="CloudChef" className="w-6 h-6" />
            CloudChef
          </Link>
          <div className="flex items-center gap-2">
            <NavLink to="/customer" label="Customer" />
            <NavLink to="/kitchen" label="Kitchen" />
            <NavLink to="/admin" label="Admin" />
            <NavLink to="/test" label="Test" />
          </div>
        </div>
      </div>
    </nav>
  )
}
