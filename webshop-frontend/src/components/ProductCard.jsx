import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <article className="art-card group flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg">
            <div>
                {/* Spremnik za sliku */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eee8df]">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="art-image h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                            Nema dostupne slike
                        </div>
                    )}
                </div>

                {/* Informacije o proizvodu */}
                <div className="p-5">
                    <h3 className="mb-1 truncate text-base font-semibold text-stone-900">
                        {product.name}
                    </h3>
                    <p className="mb-1 line-clamp-1 text-sm text-stone-500">
                        {product.description || 'Originalni umjetnički rad.'}
                    </p>
                </div>
            </div>

            {/* Cijena i Akcije */}
            <div className="mt-auto flex items-center justify-between border-t border-stone-100 px-4 py-3">
        <span className="text-lg font-bold text-stone-900">
          {Number(product.price).toFixed(2)} €
        </span>

                <div className="flex gap-2">
                    <Link
                        to={`/products/${product.id}`}
                        className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-900"
                    >
                        Pogledaj
                    </Link>
                    <button
                        onClick={() => addToCart(product)}
                        className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9a704b]"
                    >
                        Dodaj
                    </button>
                </div>
            </div>
        </article>
    );
}