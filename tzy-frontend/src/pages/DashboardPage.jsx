import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ])
      setOrders(ordersRes.data)
      setProducts(productsRes.data)
    } catch {
      console.error('Veriler yüklenemedi')
    }
  }
  fetchData()
}, [])

  const totalOrders = orders.length
  const activeShipments = orders.filter(o => o.status === 'YOLDA').length
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const recentOrders = [...orders].reverse().slice(0, 5)

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusBadge = (status) => {
    const styles = {
      HAZIRLANIYOR: 'bg-amber-50 text-amber-700 border-amber-100',
      YOLDA: 'bg-blue-50 text-blue-700 border-blue-100',
      TESLIM_EDILDI: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }
    const labels = {
      HAZIRLANIYOR: 'Hazırlanıyor',
      YOLDA: 'Yolda',
      TESLIM_EDILDI: 'Teslim Edildi'
    }
    return (
      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Genel Bakış</h1>
          <p className="text-slate-500 mt-1">Tedarik zinciri operasyonlarınızın anlık özeti.</p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Yeni Sipariş
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Toplam Sipariş */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Toplam Sipariş</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalOrders}</p>
          </div>
        </div>

        {/* Aktif Sevkiyat */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <span className="material-symbols-outlined text-[28px]">local_shipping</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aktif Sevkiyat</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{activeShipments}</p>
          </div>
        </div>

        {/* Toplam Gelir */}
        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Toplam Gelir</p>
            <p className="text-3xl font-extrabold text-white mt-1">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Stok Ürün */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-[28px]">package_2</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ürün Çeşidi</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Son Siparişler</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm font-bold text-primary hover:underline"
          >
            Tümünü Gör
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Sipariş ID</th>
                <th className="px-6 py-4">Müşteri Adı</th>
                <th className="px-6 py-4">Ürün</th>
                <th className="px-6 py-4 text-center">Durum</th>
                <th className="px-6 py-4 text-right">Tutar</th>
                <th className="px-6 py-4 text-right">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Henüz sipariş bulunmuyor
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {getInitials(order.customerName)}
                        </div>
                        <span className="text-sm text-slate-700">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.productName}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-500">{order.orderDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Son {recentOrders.length} sipariş gösteriliyor.</p>
        </div>
      </div>
    </div>
  )
}