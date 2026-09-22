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
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md border border-stone-200">
            <h2 className="text-2xl font-serif font-bold text-center text-stone-900 mb-6">Prijava</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">E-mail adresa</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Lozinka</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition"
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
    );
}