import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div>
                {/* Spremnik za sliku */}
                <div className="w-full h-56 bg-stone-100 overflow-hidden relative">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                            Nema dostupne slike
                        </div>
                    )}
                </div>

                {/* Informacije o proizvodu */}
                <div className="p-4">
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2 mb-4">
                        {product.description || 'Originalni umjetnički rad.'}
                    </p>
                </div>
            </div>

            {/* Cijena i Akcije */}
            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-auto">
        <span className="text-lg font-semibold text-stone-900">
          {Number(product.price).toFixed(2)} €
        </span>

                <div className="flex gap-2">
                    <Link
                        to={`/products/${product.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 rounded hover:bg-stone-200 transition"
                    >
                        Pogledaj
                    </Link>
                    <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 rounded hover:bg-stone-800 transition"
                    >
                        Dodaj
                    </button>
                </div>
            </div>
        </div>
    );
}