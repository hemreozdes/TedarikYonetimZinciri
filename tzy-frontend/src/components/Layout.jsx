import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-navy flex flex-col flex-shrink-0">
        <div className="p-6 flex flex-col gap-1">
          <h1 className="text-white text-xl font-bold tracking-tight">TZY Panel</h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Supply Chain Admin</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined">home</span>
            Ana Sayfa
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined">package_2</span>
            Ürünler
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined">assignment</span>
            Siparişler
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Giderler
          </NavLink>

          <NavLink
            to="/profit"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined">bar_chart</span>
            Kâr Analizi
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">storefront</span>
            <h2 className="text-slate-800 text-lg font-semibold">Künefe Tedarik Zinciri</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 leading-none">{username || 'Admin'}</p>
              <p className="text-xs text-slate-500 mt-1">Supply Manager</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}