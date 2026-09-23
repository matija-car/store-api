import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
            setError('Unesite ispravnu e-mail adresu.');
            return;
        }
        if (!password || password.length > 72) {
            setError('Lozinka nije ispravna.');
            return;
        }

        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
        <div className="rounded-2xl border border-amber-900/10 bg-white p-7 shadow-lg sm:p-10">
            <p className="eyebrow mb-3 text-center">Dobro došli</p>
            <h2 className="display-font mb-8 text-center text-4xl font-bold text-ink">Prijava</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">E-mail adresa</label>
                    <input
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">Lozinka</label>
                    <input
                        type="password"
                        required
                        maxLength={72}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-burgundy py-3.5 font-semibold text-white transition hover:bg-burgundy-dark"
                >
                    Prijavi se
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-stone-600">
                Nemate račun?{' '}
                <Link to="/register" className="font-semibold text-burgundy hover:underline">
                    Registrirajte se
                </Link>
            </p>
        </div>
        </main>
    );
}