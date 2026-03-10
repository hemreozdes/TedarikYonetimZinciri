import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ type: 'LOJISTIK', amount: '', date: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses')
      setExpenses(response.data)
    } catch {
      console.error('Giderler yüklenemedi')
    }
  }

  const openModal = () => {
    setForm({ type: 'LOJISTIK', amount: '', date: '' })
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSave = async () => {
    if (!form.amount || !form.date) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }
    setLoading(true)
    try {
      await api.post('/expenses', {
        type: form.type,
        amount: Number(form.amount),
        date: form.date
      })
      await fetchExpenses()
      closeModal()
    } catch {
      alert('Gider eklenemedi!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu gideri silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/expenses/${id}`)
      await fetchExpenses()
    } catch {
      console.error('Silme başarısız')
    }
  }

  const getTypeBadge = (type) => {
    const styles = {
      LOJISTIK: 'bg-blue-100 text-blue-800',
      GUMRUK: 'bg-purple-100 text-purple-800',
      DEPO_KIRA: 'bg-yellow-100 text-yellow-800',
      DIGER: 'bg-slate-200 text-slate-800'
    }
    const labels = {
      LOJISTIK: 'LOJİSTİK',
      GUMRUK: 'GÜMRÜK',
      DEPO_KIRA: 'DEPO KİRA',
      DIGER: 'DİĞER'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    )
  }

  const filtered = expenses.filter(e =>
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    String(e.id).includes(search)
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Giderler</h2>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki tüm gider kayıtlarını yönetin.</p>
        </div>
        <button
          onClick={openModal}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Gider Ekle
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Gider ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tür</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">Gider bulunamadı</td>
                </tr>
              ) : (
                filtered.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">#{expense.id}</td>
                    <td className="px-6 py-4">{getTypeBadge(expense.type)}</td>
                    <td className="px-6 py-4 text-sm font-semibold">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{expense.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 text-sm text-slate-500">
          <p>Toplam {filtered.length} gider gösteriliyor</p>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold">Yeni Gider Kaydı</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Gider Türü</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                >
                  <option value="LOJISTIK">LOJİSTİK</option>
                  <option value="GUMRUK">GÜMRÜK</option>
                  <option value="DEPO_KIRA">DEPO KİRA</option>
                  <option value="DIGER">DİĞER</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tutar</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tarih</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}