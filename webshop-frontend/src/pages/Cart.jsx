import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { token } = useAuth();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [guestOrderEmail, setGuestOrderEmail] = useState('');
    const [customer, setCustomer] = useState({ customerName: '', customerEmail: '', shippingAddress: '', city: '', postalCode: '', prayerRequest: '' });

    const handleCheckout = async () => {
        const trimmedCustomer = Object.fromEntries(
            Object.entries(customer).map(([key, value]) => [key, value.trim()]),
        );
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const namePattern = /^[\p{L}][\p{L} .'-]*$/u;
        const postalPattern = /^[0-9]{4,10}$/;

        if (!namePattern.test(trimmedCustomer.customerName) || trimmedCustomer.customerName.length > 100) {
            setErrorMessage('Unesite ispravno ime i prezime.');
            return;
        }
        if (!emailPattern.test(trimmedCustomer.customerEmail) || trimmedCustomer.customerEmail.length > 254) {
            setErrorMessage('Unesite ispravnu e-mail adresu.');
            return;
        }
        if (trimmedCustomer.shippingAddress.length < 3 || trimmedCustomer.shippingAddress.length > 255) {
            setErrorMessage('Unesite ispravnu adresu dostave.');
            return;
        }
        if (!namePattern.test(trimmedCustomer.city) || trimmedCustomer.city.length > 100) {
            setErrorMessage('Unesite ispravan grad.');
            return;
        }
        if (!postalPattern.test(trimmedCustomer.postalCode)) {
            setErrorMessage('Poštanski broj mora imati 4 do 10 znamenki.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const orderPayload = {
                ...trimmedCustomer,
                prayerRequest: trimmedCustomer.prayerRequest || null,
                items: cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            await API.post('/orders', orderPayload);
            setSuccessMessage('Narudžba je uspješno zaprimljena!');
            if (!token) setGuestOrderEmail(trimmedCustomer.customerEmail);
            clearCart();
        } catch (err) {
            console.error('Greška pri slanju narudžbe:', err);
            const validationErrors = err.response?.data?.validationErrors;
            setErrorMessage(
                validationErrors
                    ? Object.values(validationErrors).join(' ')
                    : err.response?.data?.message || 'Slanje zahtjeva nije uspjelo.',
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
                    {guestOrderEmail && (
                        <p className="mt-2 text-sm">
                            Ako se registrirate ili prijavite s adresom <strong>{guestOrderEmail}</strong>,
                            ova će se narudžba povezati s vašim računom i moći ćete je pratiti u{' '}
                            <Link
                                to={`/login?email=${encodeURIComponent(guestOrderEmail)}`}
                                className="font-semibold underline"
                            >
                                Mojim narudžbama
                            </Link>.
                        </p>
                    )}
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
                            ].map(([name, label, type]) => <input key={name} required type={type} minLength={name === 'postalCode' ? 4 : undefined} maxLength={name === 'postalCode' ? 10 : name === 'customerEmail' ? 254 : name === 'shippingAddress' ? 255 : 100} pattern={name === 'customerEmail' ? '[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}' : name === 'postalCode' ? '[0-9]{4,10}' : undefined} inputMode={name === 'postalCode' ? 'numeric' : undefined} placeholder={label} value={customer[name]} onChange={(e) => setCustomer({ ...customer, [name]: e.target.value })} className="input-field" />)}
                        </div>
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold text-stone-700">Postoji li posebna molitvena nakana ili životno razdoblje za koje možemo moliti dok pakiramo vašu narudžbu?</label>
                            <textarea
                                value={customer.prayerRequest}
                                maxLength={1000}
                                onChange={(e) => setCustomer({ ...customer, prayerRequest: e.target.value })}
                                placeholder="Neobavezno — kratka molitvena poruka za naš tim"
                                className="input-field min-h-24"
                            />
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