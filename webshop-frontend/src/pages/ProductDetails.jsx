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
        <div className="container mx-auto px-4 py-12">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
                ← Natrag
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg border border-stone-200 shadow-sm">
                <div className="aspect-square w-full bg-stone-100 rounded-lg overflow-hidden">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                            Nema slike
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
                        <p className="text-2xl font-semibold text-stone-800 mb-6">
                            {Number(product.price).toFixed(2)} €
                        </p>
                        <p className="text-stone-600 mb-6 leading-relaxed">
                            {product.description || 'Nema opisa za ovaj artikl.'}
                        </p>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="w-full py-3 bg-stone-900 text-white font-medium rounded-md hover:bg-stone-800 transition"
                    >
                        Dodaj u košaricu
                    </button>
                </div>
            </div>
        </div>
    );
}