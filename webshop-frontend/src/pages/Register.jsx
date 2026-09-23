import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!privacyAccepted) {
            setError('Morate prihvatiti Izjavu o privatnosti.');
            return;
        }

        const name = `${formData.firstName} ${formData.lastName}`.trim();
        if (!/^[\p{L}][\p{L} .'-]*$/u.test(name) || name.length < 2 || name.length > 100) {
            setError('Ime i prezime nisu ispravni.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
            setError('Unesite ispravnu e-mail adresu.');
            return;
        }
        if (formData.password.length < 8 || formData.password.length > 72) {
            setError('Lozinka mora imati između 8 i 72 znaka.');
            return;
        }

        const res = await register({
            name,
            email: formData.email.trim(),
            password: formData.password,
        });
        if (res.success) {
            setMessage('Registracija uspješna! Možete se prijaviti.');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(res.message);
        }
    };

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
        <div className="rounded-2xl border border-amber-900/10 bg-white p-7 shadow-lg sm:p-10">
        <p className="eyebrow mb-3 text-center">Budite dio zajednice</p>
        <h2 className="display-font mb-8 text-center text-4xl font-bold text-ink">Registracija</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center border border-red-200">
                    {error}
                </div>
            )}

            {message && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm text-center border border-green-200">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Ime</label>
                    <input
                        type="text"
                        name="firstName"
                        required
                        maxLength={50}
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Prezime</label>
                    <input
                        type="text"
                        name="lastName"
                        required
                        maxLength={50}
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">E-mail adresa</label>
                    <input
                        type="email"
                        name="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Lozinka</label>
                    <input
                        type="password"
                        name="password"
                        required
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <label className="flex items-start gap-3 text-sm text-stone-600">
                    <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-1" />
                    <span>Suglasan/a sam s obradom svojih podataka za izradu korisničkog računa. Pročitajte našu <Link to="/privatnost" className="font-semibold text-burgundy underline">Izjavu o privatnosti</Link>. (Obvezno)</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-stone-600">
                    <input type="checkbox" className="mt-1" />
                    <span>Želim primati obavijesti o novim djelima i izložbama.</span>
                </label>
                <p className="text-xs leading-5 text-stone-500">Vaši su podaci sigurni. Privola za marketinške obavijesti nije uvjet za registraciju.</p>

                <button
                    type="submit"
                    disabled={!privacyAccepted}
                    className="w-full rounded-lg bg-burgundy py-3.5 font-semibold text-white transition hover:bg-burgundy-dark"
                >
                    Registriraj se
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-stone-600">
                Već imate račun?{' '}
                <Link to="/login" className="font-semibold text-burgundy hover:underline">
                    Prijavite se
                </Link>
            </p>
        </div>
        </main>
    );
}