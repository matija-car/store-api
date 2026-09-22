import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        API.get(`/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greška pri dohvaćanju detalja o proizvodu:', err);
                setError('Proizvod nije pronađen.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center py-12 text-stone-500">Učitavanje detalja...</div>;
    if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
    if (!product) return null;

    return (
        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
                ← Natrag
            </button>

            <div className="grid overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_20px_60px_rgba(63,45,31,0.08)] md:grid-cols-2">
                <div className="aspect-square w-full overflow-hidden bg-[#eee8df]">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-700 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                            Nema slike
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <div>
                        <p className="eyebrow mb-4">Originalni umjetnički rad</p>
                        <h1 className="display-font mb-5 text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">{product.name}</h1>
                        <p className="mb-8 text-3xl font-bold text-[#9a704b]">
                            {Number(product.price).toFixed(2)} €
                        </p>
                        <p className="mb-8 max-w-lg leading-8 text-stone-500">
                            {product.description || 'Nema opisa za ovaj artikl.'}
                        </p>
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-3 border-y border-stone-200 py-5 text-sm">
                        <div><p className="text-stone-400">Dostupnost</p><p className="mt-1 font-semibold text-stone-800">{product.stockQuantity === 1 ? 'Jedinstven primjerak' : 'Dostupno za narudžbu'}</p></div>
                        <div><p className="text-stone-400">Kategorija</p><p className="mt-1 font-semibold text-stone-800">{product.categoryName || 'Umjetnost'}</p></div>
                    </div>
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full rounded-full bg-stone-900 py-4 font-semibold text-white transition hover:bg-[#9a704b]"
                    >
                        Dodaj u košaricu
                    </button>
                </div>
            </div>
            </main>
    );
}