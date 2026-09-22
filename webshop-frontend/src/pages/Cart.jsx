import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [customer, setCustomer] = useState({ customerName: '', customerEmail: '', shippingAddress: '', city: '', postalCode: '' });

    const handleCheckout = async () => {
        if (!token) {
            setErrorMessage('Morate biti prijavljeni kako biste završili narudžbu.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const orderPayload = {
                ...customer,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            await API.post('/orders', orderPayload);
            setSuccessMessage('Narudžba je uspješno zaprimljena!');
            clearCart();
        } catch (err) {
            console.error('Greška pri slanju narudžbe:', err);
            setErrorMessage(
                err.response?.data?.message || 'Slani zahtjev nije uspio. Provjerite vezu s backendom.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !successMessage) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="display-font mb-4 text-2xl text-stone-800">Vaša košarica je prazna</h2>
                <Link to="/" className="inline-block rounded-lg bg-burgundy px-6 py-2 text-white hover:bg-burgundy-dark">
                    Pregledaj ponudu
                </Link>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
            <p className="eyebrow mb-3">Vaš odabir</p>
            <h1 className="display-font mb-8 text-4xl font-bold text-ink">Košarica</h1>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded border border-green-200 text-center">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded border border-red-200 text-center">
                    {errorMessage}
                </div>
            )}

            {cart.length > 0 && (
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="divide-y divide-amber-900/10 rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                        {cart.map((item) => (
                            <div key={item.id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-ink">{item.name}</h3>
                                        <p className="text-sm text-stone-500">{Number(item.price).toFixed(2)} €</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex items-center rounded border border-amber-900/15">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-cream"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-cream"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="w-24 text-right font-semibold text-ink">
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </p>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Ukloni
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-amber-900/10 bg-cream p-6">
                        <p className="eyebrow mb-2">Podaci za dostavu</p>
                        <div className="grid gap-3">
                            {[
                                ['customerName', 'Ime i prezime', 'text'],
                                ['customerEmail', 'E-mail adresa', 'email'],
                                ['shippingAddress', 'Adresa dostave', 'text'],
                                ['city', 'Grad', 'text'],
                                ['postalCode', 'Poštanski broj', 'text'],
                            ].map(([name, label, type]) => <input key={name} required type={type} placeholder={label} value={customer[name]} onChange={(e) => setCustomer({ ...customer, [name]: e.target.value })} className="input-field" />)}
                        </div>
                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-300/70 pt-5">
                        <div>
                            <span className="text-stone-600">Ukupno: </span>
                            <span className="text-2xl font-bold text-ink">{totalPrice.toFixed(2)} €</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full rounded-lg bg-burgundy px-8 py-3 text-white transition hover:bg-burgundy-dark disabled:opacity-50 sm:w-auto"
                        >
                            {loading ? 'Slanje...' : 'Završi narudžbu'}
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}