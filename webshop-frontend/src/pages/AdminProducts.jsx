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
            const response = await API.get('/products');
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
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
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
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Obrisati ovaj proizvod?')) return;
        try {
            await API.delete(`/products/${id}`);
            setProducts((current) => current.filter((product) => product.id !== id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Brisanje proizvoda nije uspjelo.');
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
                        <div key={product.id} className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-semibold text-ink">{product.name}</h2>
                                <p className="text-sm text-stone-500">{Number(product.price).toFixed(2)} € · Zaliha: {product.stockQuantity ?? 0}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="rounded-lg border border-burgundy/30 px-3 py-2 text-sm font-semibold text-burgundy" onClick={() => editProduct(product)}>Uredi</button>
                                <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700" onClick={() => deleteProduct(product.id)}>Obriši</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
