import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const outOfStock = (product.stockQuantity ?? 0) <= 0;

    const handleAddToCart = () => {
        if (outOfStock) return;
        addToCart(product);
        setAdded(true);
    };

    useEffect(() => {
        if (!added) return undefined;
        const timeout = setTimeout(() => setAdded(false), 2000);
        return () => clearTimeout(timeout);
    }, [added]);

    return (
        <article className="art-card group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-amber-900/10 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lg">
            <div>
                {/* Spremnik za sliku */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
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
                    <p className="eyebrow mb-2">Umjetničko djelo</p>
                    <h3 className="display-font mb-1 truncate text-lg font-bold text-ink">
                        {product.name}
                    </h3>
                    {product.pieceType === 'ORIGINAL' && (
                        <span className="mb-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-amber-900">Jedinstveni original</span>
                    )}
                    {product.causeEnabled && product.causeDescription && (
                        <p className="mb-2 rounded-md bg-rose-50 px-2 py-1 text-[0.7rem] font-medium text-burgundy">{product.causeDescription}</p>
                    )}
                    <p className="mb-1 line-clamp-1 text-sm text-stone-500">
                        {product.description || 'Originalni umjetnički rad.'}
                    </p>
                </div>
            </div>

            {/* Cijena i Akcije */}
            <div className="mt-auto flex items-center justify-between border-t border-amber-900/10 px-4 py-3">
        <span className="text-lg font-bold text-ink">
          {Number(product.price).toFixed(2)} €
        </span>

                <div className="flex gap-2">
                    <Link
                        to={`/djela/${product.id}`}
                        className="rounded-lg border border-amber-900/15 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-burgundy"
                    >
                        Pogledaj djelo
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${outOfStock ? 'cursor-not-allowed bg-stone-400' : 'bg-burgundy hover:bg-burgundy-dark'} ${added ? 'scale-95 animate-pulse' : ''}`}
                    >
                        {outOfStock ? 'Nedostupno' : added ? 'Odabrano' : 'Zatraži ponudu'}
                    </button>
                </div>
            </div>
            {added && <div className="absolute bottom-3 left-3 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white shadow-lg">Dodano u odabrana djela</div>}
        </article>
    );
}