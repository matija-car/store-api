import { useState } from 'react';
import API from '../api/axios';

const emptyForm = {
    customerName: '',
    email: '',
    description: '',
    sizePreference: '',
    budgetNote: '',
};

export default function CommissionRequest() {
    const [form, setForm] = useState(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const updateField = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            await API.post('/commission-requests', form);
            setSuccessMessage('Hvala vam — uskoro ćemo vam se javiti.');
            setForm(emptyForm);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Vaš zahtjev nije moguće poslati. Pokušajte ponovno.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:py-16">
            <p className="eyebrow mb-3">Narudžba slike</p>
            <h1 className="display-font mb-6 text-4xl font-bold text-ink">Zatražite izradu slike po narudžbi</h1>

            {successMessage && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <input className="input-field" name="customerName" value={form.customerName} onChange={updateField} placeholder="Vaše ime" required />
                    <input className="input-field" name="email" type="email" value={form.email} onChange={updateField} placeholder="E-mail adresa" required />
                </div>

                <div className="mt-4">
                    <textarea className="input-field min-h-32" name="description" value={form.description} onChange={updateField} placeholder="Opišite sliku koju želite naručiti" required />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <input className="input-field" name="sizePreference" value={form.sizePreference} onChange={updateField} placeholder="Željena veličina (neobavezno)" />
                    <input className="input-field" name="budgetNote" value={form.budgetNote} onChange={updateField} placeholder="Napomena o budžetu ili uzoru (neobavezno)" />
                </div>

                <button type="submit" disabled={isSubmitting} className="mt-6 rounded-lg bg-burgundy px-5 py-3 font-semibold text-white hover:bg-burgundy-dark disabled:opacity-60">
                    {isSubmitting ? 'Slanje...' : 'Pošalji zahtjev'}
                </button>
            </form>
        </main>
    );
}
