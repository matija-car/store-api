import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statuses = ['NEW', 'IN_REVIEW', 'ACCEPTED', 'DECLINED', 'COMPLETED'];
const statusLabels = {
    NEW: 'Novi',
    IN_REVIEW: 'U pregledu',
    ACCEPTED: 'Prihvaćen',
    DECLINED: 'Odbijen',
    COMPLETED: 'Završen',
};

export default function AdminCommissions() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    const loadRequests = async () => {
        try {
            const response = await API.get('/commission-requests', { params: { size: 100, sort: 'createdAt,desc' } });
            setRequests(response.data.content || []);
        } catch {
            setError('Zahtjeve nije moguće učitati.');
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') loadRequests();
    }, [user]);

    const updateStatus = async (request, status) => {
        setError('');
        setRequests((current) => current.map((item) => (item.id === request.id ? { ...item, status } : item)));
        try {
            await API.patch(`/commission-requests/${request.id}/status`, { status });
        } catch (requestError) {
            setRequests((current) => current.map((item) => (item.id === request.id ? request : item)));
            setError(requestError.response?.data?.message || 'Status nije moguće ažurirati.');
        }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;

    return (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <p className="eyebrow mb-2">Administracija</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink">Zahtjevi za izradu slika</h1>
            {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
            <div className="overflow-x-auto rounded-2xl border border-amber-900/10 bg-white">
                <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead className="border-b border-stone-100 bg-cream">
                        <tr>
                            <th className="p-4">Kupac</th>
                            <th className="p-4">Projekt</th>
                            <th className="p-4">Veličina</th>
                            <th className="p-4">Napomena o budžetu</th>
                            <th className="p-4">Datum</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id} className="border-b border-stone-100 last:border-0 align-top">
                                <td className="p-4">
                                    <p className="font-semibold text-ink">{request.customerName}</p>
                                    <p className="text-stone-500">{request.email}</p>
                                </td>
                                <td className="p-4">
                                    <p className="max-w-xs text-stone-700">{request.description}</p>
                                </td>
                                <td className="p-4 text-stone-600">{request.sizePreference || '—'}</td>
                                <td className="p-4 text-stone-600">{request.budgetNote || '—'}</td>
                                <td className="p-4 text-stone-500">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}</td>
                                <td className="p-4">
                                    <select className="input-field min-w-40" value={request.status} onChange={(event) => updateStatus(request, event.target.value)}>
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{statusLabels[status]}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
