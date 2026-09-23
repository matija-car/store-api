import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
    PENDING: 'Na čekanju',
    PAID: 'Plaćeno',
    SHIPPED: 'Poslano',
    DELIVERED: 'Dostavljeno',
    CANCELLED: 'Otkazano',
};

export default function OrderDetails() {
    const { user } = useAuth();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        API.get(`/orders/${id}`)
            .then((response) => setOrder(response.data))
            .catch((requestError) => setError(requestError.response?.data?.message || 'Narudžbu nije moguće učitati.'));
    }, [id, user]);

    if (!user) return <Navigate to="/login" replace />;
    if (error) return <main className="mx-auto max-w-4xl px-5 py-16"><p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p></main>;
    if (!order) return <main className="py-16 text-center text-stone-500">Učitavanje narudžbe...</main>;

    return (
        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
            <Link to="/orders" className="text-sm font-semibold text-burgundy">← Moje narudžbe</Link>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="eyebrow mb-2">Detalji narudžbe</p>
                    <h1 className="display-font text-4xl font-bold text-ink">Narudžba #{order.id}</h1>
                    <p className="mt-2 text-sm text-stone-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</p>
                </div>
                <span className="rounded-full bg-cream px-4 py-2 font-semibold text-burgundy">{statusLabels[order.status] || order.status}</span>
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                <div className="divide-y divide-stone-100 rounded-2xl border border-amber-900/10 bg-white p-6">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                            <div><h2 className="font-semibold text-ink">{item.productName}</h2><p className="text-sm text-stone-500">{item.quantity} × {Number(item.price).toFixed(2)} €</p></div>
                            <strong>{(Number(item.price) * item.quantity).toFixed(2)} €</strong>
                        </div>
                    ))}
                </div>
                <aside className="rounded-2xl border border-amber-900/10 bg-cream p-6">
                    <p className="eyebrow mb-3">Dostava</p>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="mt-2 text-sm text-stone-600">{order.shippingAddress}<br />{order.postalCode} {order.city}</p>
                    {order.prayerRequest && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-white p-3 text-sm text-stone-700">
                            <p className="mb-1 font-semibold text-ink">Molitvena nakana</p>
                            <p>{order.prayerRequest}</p>
                        </div>
                    )}
                    <p className="mt-4 border-t border-stone-300/70 pt-4 text-xl font-bold">{Number(order.totalAmount).toFixed(2)} €</p>
                </aside>
            </div>
        </main>
    );
}
