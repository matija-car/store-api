import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const res = await register(formData);
        if (res.success) {
            setMessage('Registracija uspješna! Možete se prijaviti.');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(res.message);
        }
    };

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_20px_60px_rgba(63,45,31,0.08)] sm:p-10">
        <p className="eyebrow mb-3 text-center">Postanite dio priče</p>
        <h2 className="display-font mb-8 text-center text-4xl font-bold text-stone-900">Registracija</h2>

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
                    <label className="block text-sm font-medium text-stone-700 mb-1">Ime</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">E-mail adresa</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Lozinka</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-full bg-stone-900 py-3.5 font-semibold text-white transition hover:bg-[#9a704b]"
                >
                    Registriraj se
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-stone-600">
                Već imate račun?{' '}
                <Link to="/login" className="text-stone-900 font-semibold hover:underline">
                    Prijavite se
                </Link>
            </p>
        </div>
        </main>
    );
}