import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({ name: '', stockQuantity: '', unitCost: '', unitSalePrice: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch {
      console.error('Ürünler yüklenemedi')
    }
  }

  const openAddModal = () => {
    setEditProduct(null)
    setForm({ name: '', stockQuantity: '', unitCost: '', unitSalePrice: '' })
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      stockQuantity: product.stockQuantity,
      unitCost: product.unitCost,
      unitSalePrice: product.unitSalePrice
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditProduct(null)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, form)
      } else {
        await api.post('/products', form)
      }
      await fetchProducts()
      closeModal()
    } catch {
      console.error('Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch {
      console.error('Silme başarısız')
    }
  }

  const getStockBadge = (quantity) => {
    if (quantity > 20) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">{quantity} - Yüksek</span>
    if (quantity > 0) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">{quantity} - Düşük</span>
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">{quantity} - Tükendi</span>
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Ürünler</h2>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Ürün Ekle
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
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Miktarı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Birim Maliyet</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Satış Fiyatı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">Ürün bulunamadı</td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{product.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4">{getStockBadge(product.stockQuantity)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">${product.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">${product.unitSalePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
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
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">Toplam {filtered.length} ürün gösteriliyor</p>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">
                {editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Ürün Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Fıstıklı Künefe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Stok Miktarı</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Birim Maliyet (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.unitCost}
                      onChange={(e) => setForm({ ...form, unitCost: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Satış Fiyatı (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.unitSalePrice}
                      onChange={(e) => setForm({ ...form, unitSalePrice: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}