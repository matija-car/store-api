import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
    PENDING: 'Na čekanju',
    INQUIRY: 'Upit zaprimljen',
    PAID: 'Plaćeno',
    SHIPPED: 'Poslano',
    DELIVERED: 'Dostavljeno',
    CANCELLED: 'Otkazano',
};

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        API.get('/orders/me')
            .then((response) => setOrders(response.data.content || []))
            .catch(() => setError('Narudžbe nije moguće učitati.'));
    }, [user]);

    if (!user) return <Navigate to="/login" replace />;

    return (
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
            <p className="eyebrow mb-2">Moj račun</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink">Moje narudžbe</h1>
            {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
            {!error && orders.length === 0 && <p className="rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-500">Još nemate narudžbi.</p>}
            <div className="grid gap-4">
                {orders.map((order) => (
                    <Link key={order.id} to={`/orders/${order.id}`} className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm transition hover:border-gold">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="font-semibold text-ink">Upit #{order.id}</h2>
                                <p className="text-sm text-stone-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Datum nije dostupan'}</p>
                            </div>
                            <span className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-burgundy">{statusLabels[order.status] || order.status}</span>
                            <strong className="text-lg text-ink">{Number(order.totalAmount).toFixed(2)} €</strong>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
