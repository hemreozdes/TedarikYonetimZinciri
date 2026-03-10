import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)
      navigate('/')
    } catch {
        setError('Kullanıcı adı veya şifre hatalı!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px'
      }}>
      <main className="w-full max-w-md">
        <section className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
          
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">TZY Panel</h1>
            <p className="text-sm text-slate-500 font-medium">Tedarik Zinciri Yönetim Sistemi</p>
          </header>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-400 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-400 text-slate-900"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium text-center">{error}</p>
            )}

            <div className="pt-2">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-sidebar-navy hover:bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </div>

          <footer className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
              Yetkili Personel
            </p>
          </footer>
        </section>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">© 2026 TZY Logistics Solutions.</p>
        </div>
      </main>
    </div>
    )
}