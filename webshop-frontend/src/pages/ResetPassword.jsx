import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [state, setState] = useState({ submitting: false, success: false, error: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = searchParams.get('token');
        if (!token) {
            setState({ submitting: false, success: false, error: 'Nedostaje token za resetiranje lozinke.' });
            return;
        }

        setState({ submitting: true, success: false, error: '' });
        try {
            await API.post('/auth/reset-password', { token, newPassword });
            setState({ submitting: false, success: true, error: '' });
        } catch (error) {
            setState({
                submitting: false,
                success: false,
                error: error.response?.data?.message || 'Resetiranje lozinke nije uspjelo.',
            });
        }
    };

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-7 shadow-lg sm:p-10">
                <p className="eyebrow mb-3 text-center">Sigurnost računa</p>
                <h1 className="display-font mb-8 text-center text-4xl font-bold text-ink">Nova lozinka</h1>
                {state.success ? (
                    <div className="text-center">
                        <p className="rounded-lg bg-green-50 p-4 text-green-700">Lozinka je uspješno promijenjena.</p>
                        <Link to="/login" className="mt-6 inline-block font-semibold text-burgundy hover:underline">Prijava</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {state.error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{state.error}</p>}
                        <input
                            className="input-field"
                            type="password"
                            minLength="8"
                            required
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            placeholder="Nova lozinka"
                        />
                        <button type="submit" disabled={state.submitting} className="w-full rounded-lg bg-burgundy py-3.5 font-semibold text-white hover:bg-burgundy-dark disabled:opacity-60">
                            {state.submitting ? 'Spremanje...' : 'Promijeni lozinku'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
