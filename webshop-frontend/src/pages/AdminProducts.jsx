import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
    name: '',
    description: '',
    price: '',
    stockQuantity: 0,
    categoryId: '',
    imageUrl: '',
    pieceType: 'PRINT',
    causeEnabled: false,
    causeDescription: '',
};

export default function AdminProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadProducts = async () => {
        try {
            const response = await API.get('/products?includeInactive=true');
            setProducts(Array.isArray(response.data) ? response.data : response.data.content || []);
        } catch {
            setError('Proizvode nije moguće učitati.');
        }
    };

    useEffect(() => {
        if (user?.role !== 'ADMIN') return;
        loadProducts();
    }, [user]);

    const updateField = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        const payload = {
            ...form,
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
            categoryId: form.categoryId ? Number(form.categoryId) : null,
            pieceType: form.pieceType || 'PRINT',
            causeEnabled: Boolean(form.causeEnabled),
            causeDescription: form.causeEnabled ? form.causeDescription : '',
        };

        try {
            if (editingId) {
                await API.put(`/products/${editingId}`, payload);
                setMessage('Proizvod je ažuriran.');
            } else {
                await API.post('/products', payload);
                setMessage('Proizvod je dodan.');
            }
            resetForm();
            await loadProducts();
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Spremanje proizvoda nije uspjelo.');
        }
    };

    const editProduct = (product) => {
        setEditingId(product.id);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price ?? '',
            stockQuantity: product.stockQuantity ?? 0,
            categoryId: product.categoryId ?? '',
            imageUrl: product.imageUrl || '',
            pieceType: product.pieceType || 'PRINT',
            causeEnabled: Boolean(product.causeEnabled),
            causeDescription: product.causeDescription || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Maknuti ovaj proizvod iz javne ponude?')) return;
        try {
            await API.delete(`/products/${id}`);
            setProducts((current) => current.filter((product) => product.id !== id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Brisanje proizvoda nije uspjelo.');
        }
    };

    const restoreProduct = async (id) => {
        try {
            await API.post(`/products/${id}/restore`);
            setMessage('Proizvod je vraćen u ponudu.');
            await loadProducts();
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Vraćanje proizvoda nije uspjelo.');
        }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;

    return (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <div className="mb-8">
                <p className="eyebrow mb-2">Administracija</p>
                <h1 className="display-font text-4xl font-bold text-ink">Upravljanje katalogom</h1>
            </div>

            <form onSubmit={submit} className="mb-10 grid gap-4 rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm md:grid-cols-2">
                <input className="input-field" name="name" value={form.name} onChange={updateField} placeholder="Naziv proizvoda" required />
                <input className="input-field" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} placeholder="Cijena (€)" required />
                <input className="input-field" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={updateField} placeholder="Količina" required />
                <input className="input-field" name="categoryId" type="number" min="1" value={form.categoryId} onChange={updateField} placeholder="ID kategorije (opcionalno)" />
                <input className="input-field md:col-span-2" name="imageUrl" value={form.imageUrl} onChange={updateField} placeholder="URL slike" />
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-stone-700">Vrsta</label>
                    <select className="input-field" name="pieceType" value={form.pieceType} onChange={updateField}>
                        <option value="ORIGINAL">Original</option>
                        <option value="PRINT">Print</option>
                    </select>
                </div>
                <div className="md:col-span-2 rounded-xl border border-amber-900/10 bg-cream p-4">
                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                        <input type="checkbox" name="causeEnabled" checked={Boolean(form.causeEnabled)} onChange={updateField} />
                        Istakni kao humanitarni proizvod mjeseca
                    </label>
                    {form.causeEnabled && (
                        <textarea
                            className="input-field mt-3 min-h-20"
                            name="causeDescription"
                            value={form.causeDescription}
                            onChange={updateField}
                            placeholder="Opis svrhe, npr. 20 % prihoda podržava..."
                        />
                    )}
                </div>
                <textarea className="input-field min-h-28 md:col-span-2" name="description" value={form.description} onChange={updateField} placeholder="Opis proizvoda" required />
                <div className="flex gap-3 md:col-span-2">
                    <button className="rounded-lg bg-burgundy px-5 py-3 font-semibold text-white hover:bg-burgundy-dark" type="submit">{editingId ? 'Spremi promjene' : 'Dodaj proizvod'}</button>
                    {editingId && <button className="rounded-lg border border-stone-300 px-5 py-3 font-semibold text-stone-700" type="button" onClick={resetForm}>Odustani</button>}
                </div>
                {message && <p className="text-sm font-semibold text-green-700 md:col-span-2">{message}</p>}
                {error && <p className="text-sm font-semibold text-burgundy md:col-span-2">{error}</p>}
            </form>

            <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white">
                <div className="grid gap-4 p-5">
                    {products.map((product) => (
                        <div key={product.id} className={`flex flex-col justify-between gap-4 border-b border-stone-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center ${product.active === false ? 'opacity-60' : ''}`}>
                            <div>
                                <h2 className="font-semibold text-ink">{product.name}</h2>
                                <p className="text-sm text-stone-500">{Number(product.price).toFixed(2)} € · Zaliha: {product.stockQuantity ?? 0} · {product.active === false ? 'Maknuto iz ponude' : 'Aktivno'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="rounded-lg border border-burgundy/30 px-3 py-2 text-sm font-semibold text-burgundy" onClick={() => editProduct(product)}>Uredi</button>
                                {product.active === false ? (
                                    <button className="rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700" onClick={() => restoreProduct(product.id)}>Vrati u ponudu</button>
                                ) : (
                                    <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700" onClick={() => deleteProduct(product.id)}>Makni iz ponude</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
