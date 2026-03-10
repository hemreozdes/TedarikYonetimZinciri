import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ customerName: '', productId: '', quantity: 1, isPaid: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch {
      console.error('Siparişler yüklenemedi')
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch {
      console.error('Ürünler yüklenemedi')
    }
  }

  const openModal = () => {
    setForm({ customerName: '', productId: '', quantity: 1, isPaid: false })
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSave = async () => {
    if (!form.isPaid) {
      alert('Ödeme alınmadan sipariş oluşturulamaz!')
      return
    }
    if (!form.productId) {
      alert('Lütfen bir ürün seçin!')
      return
    }
    setLoading(true)
    try {
      await api.post('/orders', {
        customerName: form.customerName,
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        isPaid: form.isPaid
      })
      await fetchOrders()
      closeModal()
    } catch (err) {
      alert(err.response?.data?.message || 'Sipariş oluşturulamadı!')
    } finally {
      setLoading(false)
    }
  }

  const handleAdvanceStatus = async (order) => {
    if (order.status === 'TESLIM_EDILDI') return
    const next = order.status === 'HAZIRLANIYOR' ? 'YOLDA' : 'TESLIM_EDILDI'
    try {
      await api.put(`/orders/${order.id}/status`, { status: next })
      await fetchOrders()
    } catch {
      console.error('Statü güncellenemedi')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/orders/${id}`)
      await fetchOrders()
    } catch {
      alert('Sadece HAZIRLANIYOR statüsündeki siparişler silinebilir!')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      HAZIRLANIYOR: 'bg-blue-100 text-blue-700',
      YOLDA: 'bg-amber-100 text-amber-700',
      TESLIM_EDILDI: 'bg-emerald-100 text-emerald-700'
    }
    const labels = {
      HAZIRLANIYOR: 'HAZIRLANIYOR',
      YOLDA: 'YOLDA',
      TESLIM_EDILDI: 'TESLİM EDİLDİ'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Siparişler</h2>
          <p className="text-slate-500 text-sm mt-1">Tüm B2B sevkiyatlarını ve sipariş durumlarını buradan yönetin.</p>
        </div>
        <button
          onClick={openModal}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Sipariş Oluştur
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Sipariş ID veya müşteri ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Müşteri Adı</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ürün</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Adet</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Toplam Tutar</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tarih</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Durum</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ödeme</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 text-sm">Sipariş bulunamadı</td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-primary">#{order.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.productName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.quantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.orderDate}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        Ödendi
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAdvanceStatus(order)}
                          disabled={order.status === 'TESLIM_EDILDI'}
                          className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Statüyü İlerlet"
                        >
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-500">Toplam {filtered.length} sipariş gösteriliyor</p>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Yeni Sipariş Oluştur</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Müşteri Adı</label>
                <input
                  type="text"
                  placeholder="Müşteri ismini giriniz"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ürün Seç</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">Ürün listesinden seçin</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.stockQuantity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Adet</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={form.isPaid}
                  onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                  className="rounded border-slate-300 text-primary h-5 w-5 cursor-pointer"
                />
                <label htmlFor="isPaid" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Ödeme Alındı
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}