import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState({ loading: true, error: '' });

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setState({ loading: false, error: 'Nedostaje verifikacijski token.' });
            return;
        }

        API.get('/auth/verify-email', { params: { token } })
            .then(() => setState({ loading: false, error: '' }))
            .catch((error) => setState({
                loading: false,
                error: error.response?.data?.message || 'Verifikacija e-maila nije uspjela.',
            }));
    }, [searchParams]);

    return (
        <main className="mx-auto my-12 max-w-md px-5 sm:my-20">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-7 text-center shadow-lg sm:p-10">
                <p className="eyebrow mb-3">Verifikacija računa</p>
                {state.loading ? (
                    <p className="text-stone-500">Provjera verifikacijskog linka...</p>
                ) : state.error ? (
                    <p className="rounded-lg bg-red-50 p-4 text-red-700">{state.error}</p>
                ) : (
                    <>
                        <h1 className="display-font text-3xl font-bold text-ink">E-mail je potvrđen</h1>
                        <p className="mt-4 text-stone-500">Vaš račun je uspješno aktiviran.</p>
                    </>
                )}
                <Link to="/login" className="mt-8 inline-block font-semibold text-burgundy hover:underline">
                    Prijava
                </Link>
            </div>
        </main>
    );
}
