import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const loadOrders = async () => {
        try {
            const response = await API.get('/orders', { params: { size: 100, sort: 'createdAt,desc' } });
            setOrders(response.data.content || []);
        } catch {
            setError('Narudžbe nije moguće učitati.');
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') loadOrders();
    }, [user]);

    const updateStatus = async (order, status) => {
        setError('');
        setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
        try {
            await API.patch(`/orders/${order.id}/status`, { status });
        } catch (requestError) {
            setOrders((current) => current.map((item) => item.id === order.id ? order : item));
            setError(requestError.response?.data?.message || 'Status narudžbe nije moguće promijeniti.');
        }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;

    return (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <p className="eyebrow mb-2">Administracija</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink">Upravljanje narudžbama</h1>
            {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
            <div className="overflow-x-auto rounded-2xl border border-amber-900/10 bg-white">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-stone-100 bg-cream"><tr><th className="p-4">Narudžba</th><th className="p-4">Kupac</th><th className="p-4">Datum</th><th className="p-4">Ukupno</th><th className="p-4">Status</th></tr></thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-stone-100 last:border-0">
                                <td className="p-4 font-semibold text-ink">#{order.id}</td>
                                <td className="p-4">{order.customerName}<br /><span className="text-stone-500">{order.customerEmail}</span></td>
                                <td className="p-4 text-stone-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                <td className="p-4 font-semibold">{Number(order.totalAmount).toFixed(2)} €</td>
                                <td className="p-4"><select className="input-field min-w-36" value={order.status} onChange={(event) => updateStatus(order, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
