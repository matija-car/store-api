import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_20px_60px_rgba(63,45,31,0.08)] sm:p-10">
            <p className="eyebrow mb-3 text-center">Dobro došli natrag</p>
            <h2 className="display-font mb-8 text-center text-4xl font-bold text-stone-900">Prijava</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">E-mail adresa</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Lozinka</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-full bg-stone-900 py-3.5 font-semibold text-white transition hover:bg-[#9a704b]"
                >
                    Prijavi se
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-stone-600">
                Nemate račun?{' '}
                <Link to="/register" className="text-stone-900 font-semibold hover:underline">
                    Registrirajte se
                </Link>
            </p>
        </div>
        </main>
    );
}