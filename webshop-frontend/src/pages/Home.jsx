import React, { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('featured');

    useEffect(() => {
        API.get('/products')
            .then((response) => {
                const products = Array.isArray(response.data)
                    ? response.data
                    : response.data.content;

                if (!Array.isArray(products)) {
                    throw new Error('Unexpected products response format');
                }

                setProducts(products);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greška pri dohvaćanju proizvoda:', err);
                setError('Neuspjelo spajanje s backendom.');
                setLoading(false);
            });
    }, []);

    const visibleProducts = useMemo(() => {
        const filtered = products.filter((product) => `${product.name} ${product.description || ''}`.toLowerCase().includes(search.toLowerCase()));
        return [...filtered].sort((a, b) => sort === 'price-low' ? Number(a.price) - Number(b.price) : sort === 'price-high' ? Number(b.price) - Number(a.price) : 0);
    }, [products, search, sort]);

    if (loading) {
        return (
            <div className="text-center py-20 text-stone-500 font-medium">
                Učitavanje umjetnina...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600 font-medium">
                {error}
            </div>
        );
    }

    return (
        <main>
            <section className="border-b border-amber-900/10 bg-cream px-4 py-10 sm:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="eyebrow mb-3">Dom Svjetla</p>
                    <h1 className="display-font text-4xl font-bold text-ink sm:text-5xl">Darovi vjere za svaki dom.</h1>
                    <p className="mt-3 max-w-xl text-stone-500">Ikone, krunice, svijeće i pobožni predmeti odabrani s pažnjom i poštovanjem.</p>
                </div>
            </section>
            <section id="collection" className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-12">
                <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div><h2 className="text-xl font-bold text-ink">Svi proizvodi</h2><p className="mt-1 text-sm text-stone-500">{visibleProducts.length} artikala</p></div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <label className="relative"><span className="sr-only">Pretraži proizvode</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pretraži proizvode..." className="input-field w-full sm:w-64" /></label>
                        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-full sm:w-48"><option value="featured">Preporučeno</option><option value="price-low">Cijena: niža → viša</option><option value="price-high">Cijena: viša → niža</option></select>
                    </div>
                </div>
                {visibleProducts.length === 0 ? <div className="rounded-xl border border-dashed border-stone-300 py-20 text-center text-stone-500">Nema proizvoda koji odgovaraju pretrazi.</div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
            </section>
            <section id="about" className="border-t border-amber-900/10 bg-white px-4 py-10 sm:px-8">
                <div className="mx-auto grid max-w-7xl gap-4 text-sm text-stone-500 sm:grid-cols-3"><p><strong className="text-ink">Pažljivo pakiranje</strong><br />Svaki artikl stiže sigurno zapakiran.</p><p><strong className="text-ink">Darovi s porukom</strong><br />Predmeti koji njeguju vjeru i nadu.</p><p><strong className="text-ink">Podrška kupcima</strong><br />Tu smo za sva pitanja prije kupnje.</p></div>
            </section>
        </main>
    );
}