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
                <h2 className="text-2xl font-serif text-stone-800 mb-4">Vaša košarica je prazna</h2>
                <Link to="/" className="inline-block px-6 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800">
                    Pregledaj ponudu
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Košarica</h1>

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
                <div className="space-y-6">
                    <div className="divide-y divide-stone-200 bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
                        {cart.map((item) => (
                            <div key={item.id} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-stone-900">{item.name}</h3>
                                        <p className="text-sm text-stone-500">{Number(item.price).toFixed(2)} €</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="flex items-center border border-stone-300 rounded">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-stone-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-stone-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="font-semibold text-stone-900 w-24 text-right">
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

                    <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <span className="text-stone-600">Ukupno: </span>
                            <span className="text-2xl font-bold text-stone-900">{totalPrice.toFixed(2)} €</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition disabled:opacity-50"
                        >
                            {loading ? 'Slanje...' : 'Završi narudžbu'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}