import { useState } from 'react'
import api from '../api/axios'

export default function ProfitPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [profit, setProfit] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!startDate || !endDate) {
      alert('Lütfen başlangıç ve bitiş tarihini seçin!')
      return
    }
    setLoading(true)
    try {
      const response = await api.get('/expenses/profit', {
        params: { start: startDate, end: endDate }
      })
      setProfit(response.data)
    } catch {
      alert('Hesaplama yapılamadı!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Kâr Analizi</h1>
        <p className="text-slate-500">Net kâr ve brüt kâr hesaplaması için dönem seçimi yapın.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Başlangıç Tarihi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">calendar_today</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Bitiş Tarihi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">calendar_month</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-8 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 w-full md:w-auto disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">calculate</span>
            {loading ? 'Hesaplanıyor...' : 'Hesapla'}
          </button>
        </div>
      </div>

      {/* Results */}
      {profit ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Toplam Gelir */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <span className="material-symbols-outlined text-blue-600">payments</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Toplam Gelir</p>
            <h3 className="text-2xl font-bold text-slate-900">${profit.totalRevenue.toFixed(2)}</h3>
          </div>

          {/* Toplam Maliyet */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <span className="material-symbols-outlined text-red-600">inventory_2</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Toplam Maliyet</p>
            <h3 className="text-2xl font-bold text-slate-900">${profit.totalCost.toFixed(2)}</h3>
          </div>

          {/* Brüt Kâr */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-primary">pie_chart</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Brüt Kâr</p>
            <h3 className="text-2xl font-bold text-slate-900">${profit.grossProfit.toFixed(2)}</h3>
          </div>

          {/* Toplam Giderler */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <span className="material-symbols-outlined text-yellow-600">receipt_long</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Toplam Giderler</p>
            <h3 className="text-2xl font-bold text-slate-900">${profit.totalExpenses.toFixed(2)}</h3>
          </div>

          {/* Net Kâr */}
          <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-2xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                  <span className="material-symbols-outlined text-4xl leading-none">account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-emerald-50 font-medium mb-1">Dönem Net Kârı</p>
                  <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${profit.netProfit < 0 ? 'text-red-200' : ''}`}>
                    ${profit.netProfit.toFixed(2)}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-emerald-100 text-sm">
                  {startDate} — {endDate}
                </p>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="absolute -left-12 -bottom-12 size-48 bg-black/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold">Kâr Detayları</h3>
          </div>
          <div className="p-12 text-center text-slate-400 italic text-sm">
            Hesaplama yapmak için yukarıdaki tarihleri seçip "Hesapla" butonuna tıklayın.
          </div>
        </div>
      )}
    </div>
  )
}