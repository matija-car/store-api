import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const PAGE_SIZE = 12;
const categoryNames = {
    Electronics: 'Elektronika',
    Books: 'Knjige',
    Clothing: 'Odjeća',
    Furniture: 'Namještaj',
    Sports: 'Sport',
};

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [totalPages, setTotalPages] = useState(0);

    const updateParams = useCallback((updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') next.delete(key);
            else next.set(key, String(value));
        });
        setSearchParams(next);
    }, [searchParams, setSearchParams]);

    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'featured';
    const page = Number(searchParams.get('page') || 0);

    useEffect(() => {
        API.get('/categories')
            .then((response) => setCategories(response.data || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const submitSearch = (event) => {
        event.preventDefault();
        updateParams({ search: searchInput.trim() || null, page: 0 });
    };

    useEffect(() => {
        setLoading(true);
        const params = { page, size: PAGE_SIZE };
        if (search) params.search = search;
        if (categoryId) params.categoryId = categoryId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort !== 'featured') params.sort = sort === 'price-low' ? 'price,asc' : 'price,desc';

        API.get('/products', { params })
            .then((response) => {
                setProducts(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setLoading(false);
            })
            .catch(() => {
                setError('Nije moguće povezati se s poslužiteljem. Provjerite radi li backend na http://localhost:8080.');
                setLoading(false);
            });
    }, [search, categoryId, minPrice, maxPrice, sort, page]);

    if (loading) return <div className="py-20 text-center font-medium text-stone-500">Učitavanje umjetnina...</div>;
    if (error) return <div className="py-20 text-center font-medium text-red-600">{error}</div>;

    return (
        <main>
            <section className="border-b border-amber-900/10 bg-cream px-4 py-10 sm:px-8">
                <div className="mx-auto max-w-7xl"><p className="eyebrow mb-3">Dom Svjetla</p><h1 className="display-font text-4xl font-bold text-ink sm:text-5xl">Umjetnička djela koja nose vjeru, mir i nadu.</h1><p className="mt-3 max-w-xl text-stone-500">Pregledajte kolekciju autorskih radova i pošaljite upit. O konačnoj cijeni, preuzimanju i isporuci dogovaramo se osobno putem e-pošte.</p></div>
            </section>
            <section id="collection" className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-12">
                <div className="mb-8 grid gap-3 border-b border-stone-200 pb-6 md:grid-cols-5">
                    <form onSubmit={submitSearch} className="flex gap-2 md:col-span-2">
                        <label className="flex-1"><span className="sr-only">Pretraži galeriju</span><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Pretraži galeriju..." className="input-field" /></label>
                        <button type="submit" className="rounded-lg bg-burgundy px-4 py-2 font-semibold text-white hover:bg-burgundy-dark">Pretraži</button>
                    </form>
                    <select value={categoryId} onChange={(event) => updateParams({ categoryId: event.target.value, page: 0 })} className="input-field"><option value="">Sve kategorije</option>{categories.map((category) => <option key={category.id} value={category.id}>{categoryNames[category.name] || category.name}</option>)}</select>
                    <input value={minPrice} onChange={(event) => updateParams({ minPrice: event.target.value, page: 0 })} type="number" min="0" step="0.01" placeholder="Min. cijena" className="input-field" />
                    <input value={maxPrice} onChange={(event) => updateParams({ maxPrice: event.target.value, page: 0 })} type="number" min="0" step="0.01" placeholder="Max. cijena" className="input-field" />
                    <select value={sort} onChange={(event) => updateParams({ sort: event.target.value === 'featured' ? null : event.target.value, page: 0 })} className="input-field"><option value="featured">Preporučeno</option><option value="price-low">Cijena: niža → viša</option><option value="price-high">Cijena: viša → niža</option></select>
                </div>
                {products.length === 0 ? <div className="rounded-xl border border-dashed border-stone-300 py-20 text-center text-stone-500">Nema umjetničkih djela koja odgovaraju odabranim filtrima.</div> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button disabled={page === 0} onClick={() => updateParams({ page: page - 1 })} className="rounded-lg border border-stone-300 px-4 py-2 font-semibold disabled:opacity-40">Prethodna</button>
                    <span className="text-sm text-stone-500">Stranica {page + 1}{totalPages ? ` od ${totalPages}` : ''}</span>
                    <button disabled={totalPages > 0 ? page >= totalPages - 1 : products.length < PAGE_SIZE} onClick={() => updateParams({ page: page + 1 })} className="rounded-lg border border-stone-300 px-4 py-2 font-semibold disabled:opacity-40">Sljedeća</button>
                </div>
            </section>
            <section id="about" className="border-t border-amber-900/10 bg-white px-4 py-10 sm:px-8"><div className="mx-auto grid max-w-7xl gap-4 text-sm text-stone-500 sm:grid-cols-3"><p><strong className="text-ink">Pažljivo pakiranje</strong><br />Svaki artikl stiže sigurno zapakiran.</p><p><strong className="text-ink">Darovi s porukom</strong><br />Predmeti koji njeguju vjeru i nadu.</p><p><strong className="text-ink">Podrška kupcima</strong><br />Tu smo za sva pitanja prije kupnje.</p></div></section>
        </main>
    );
}
