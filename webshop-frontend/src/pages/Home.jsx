import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        API.get('/products')
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greška pri dohvaćanju proizvoda:', err);
                setError('Neuspjelo spajanje s backendom.');
                setLoading(false);
            });
    }, []);

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
        <main className="container mx-auto px-4 py-8">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
                    Umjetnička Galerija
                </h1>
                <p className="text-stone-600">
                    Originalne ručno rađene slike i skulpture
                </p>
            </header>

            {products.length === 0 ? (
                <p className="text-center text-stone-500">Trenutno nema dostupnih djela.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
}