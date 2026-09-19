'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; sku: string };
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: 'PENDING' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  stock: number;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/external/sync', {
          headers: { 'x-api-key': 'bd_ext_development_key_9868814702' },
        }),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(Array.isArray(productsData) ? productsData : []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const totalRevenue = safeOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrders = safeOrders.length;
  const pendingOrders = safeOrders.filter((o) => o.status === 'PENDING').length;
  const outOfStockItems = safeProducts.filter((p) => p.stock === 0).length;

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    fetchData();
  };

  const exportToCSV = () => {
    if (safeOrders.length === 0) return;

    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Total (NPR)', 'Status', 'Date'];
    const rows = safeOrders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.totalAmount,
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `black_dragon_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button
          onClick={exportToCSV}
          disabled={safeOrders.length === 0}
          className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">NPR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Orders Placed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending Deliveries</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingOrders}</p>
        </div>
        <div className="p-4 border rounded-xl bg-white shadow-sm">
          <p className="text-sm font-medium text-gray-500">Out-of-Stock Items</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockItems}</p>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Phone / Address</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading orders...</td></tr>
            ) : safeOrders.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders found.</td></tr>
            ) : (
              safeOrders.map((order) => (
                <tr key={order.id}>
                  <td className="p-4 font-medium">{order.customerName}</td>
                  <td className="p-4 text-gray-600">{order.phone}<br />{order.address}</td>
                  <td className="p-4 font-bold">NPR {order.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm bg-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
