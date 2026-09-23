import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useStoreMode } from '../context/StoreModeContext';

const statuses = ['PENDING', 'INQUIRY', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const statusLabels = { PENDING: 'Na čekanju', INQUIRY: 'Upit', PAID: 'Plaćeno', SHIPPED: 'Poslano', DELIVERED: 'Dostavljeno', CANCELLED: 'Otkazano' };

export default function AdminOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [settingsSaving, setSettingsSaving] = useState(false);
    const { mode, setMode } = useStoreMode();

    const loadOrders = async () => {
        try {
            const response = await API.get('/orders', { params: { size: 100, sort: 'createdAt,desc', ...(statusFilter ? { status: statusFilter } : {}) } });
            setOrders(response.data.content || []);
        } catch {
            setError('Narudžbe nije moguće učitati.');
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') loadOrders();
    }, [user, statusFilter]);

    const updateStoreMode = async (nextMode) => {
        setSettingsSaving(true);
        setError('');
        try {
            await API.patch('/admin/store-settings', { mode: nextMode });
            setMode(nextMode);
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Način rada nije moguće promijeniti.');
        } finally {
            setSettingsSaving(false);
        }
    };

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

    const availableStatuses = (status) => status === 'INQUIRY'
        ? ['INQUIRY', 'PAID', 'CANCELLED']
        : statuses;

    const deleteOrder = async (order) => {
        if (!window.confirm(`Trajno obrisati narudžbu #${order.id}?`)) return;
        setError('');
        try {
            await API.delete(`/orders/${order.id}`);
            setOrders((current) => current.filter((item) => item.id !== order.id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Narudžbu nije moguće obrisati.');
        }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;

    return (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <p className="eyebrow mb-2">Administracija</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink">Upravljanje narudžbama</h1>
            {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-900/10 bg-cream p-5">
                <div>
                    <p className="font-semibold text-ink">Način rada trgovine</p>
                    <p className="mt-1 text-sm text-stone-600">{mode === 'CATALOG' ? 'Kupci šalju upite, bez rezervacije zalihe.' : 'Kupci šalju narudžbe uz rezervaciju zalihe.'}</p>
                </div>
                <select className="input-field w-auto min-w-44" value={mode} disabled={settingsSaving} onChange={(event) => updateStoreMode(event.target.value)}>
                    <option value="STORE">STORE — narudžbe</option>
                    <option value="CATALOG">CATALOG — upiti</option>
                </select>
            </div>
            <div className="mb-5 flex items-center gap-3">
                <label htmlFor="order-status-filter" className="text-sm font-semibold text-stone-700">Filter statusa</label>
                <select id="order-status-filter" className="input-field w-auto min-w-44" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="">Svi statusi</option>
                    {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-amber-900/10 bg-white">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-stone-100 bg-cream"><tr><th className="p-4">Narudžba</th><th className="p-4">Kupac</th><th className="p-4">Datum</th><th className="p-4">Ukupno</th><th className="p-4">Status</th><th className="p-4">Akcija</th></tr></thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-stone-100 last:border-0 align-top">
                                <td className="p-4 font-semibold text-ink">#{order.id}</td>
                                <td className="p-4">{order.customerName}<br /><span className="text-stone-500">{order.customerEmail}</span>{order.prayerRequest && <><br /><span className="mt-2 block rounded-md bg-amber-50 p-2 text-xs text-stone-700">Molitvena nakana: {order.prayerRequest}</span></>}</td>
                                <td className="p-4 text-stone-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                <td className="p-4 font-semibold">{Number(order.totalAmount).toFixed(2)} €</td>
                                <td className="p-4"><select className="input-field min-w-36" value={order.status} onChange={(event) => updateStatus(order, event.target.value)}>{availableStatuses(order.status).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
                                <td className="p-4"><button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50" onClick={() => deleteOrder(order)}>Obriši</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
