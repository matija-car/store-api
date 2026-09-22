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
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md border border-stone-200">
            <h2 className="text-2xl font-serif font-bold text-center text-stone-900 mb-6">Registracija</h2>

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
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Prezime</label>
                    <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
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
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
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
                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition"
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
    );
}