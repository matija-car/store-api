import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    return (
        <>
        <div className="bg-burgundy px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
            Besplatna dostava za narudžbe iznad 100 € <span className="mx-2 text-gold">•</span> Sigurna kupnja
        </div>
        <nav className="sticky top-0 z-40 border-b border-amber-900/10 bg-ivory/95 px-4 backdrop-blur sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 py-4">
                <Link to="/" className="flex shrink-0 items-center gap-3 text-ink" onClick={() => setOpen(false)}>
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-burgundy text-sm font-bold text-cream">✦</span>
                    <span>
                        <span className="display-font block text-xl font-bold tracking-tight text-ink sm:text-2xl">Dom Svjetla</span>
                        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold">Duhovni darovi</span>
                    </span>
                </Link>
                <div className="hidden items-center gap-7 text-sm font-semibold text-stone-600 md:flex">
                    <Link to="/" className={`${isActive('/') ? 'text-burgundy' : ''} hover:text-burgundy`}>Početna</Link>
                    <a href="/#collection" className="hover:text-burgundy">Proizvodi</a>
                    <Link to="/about" className={`${isActive('/about') ? 'text-burgundy' : ''} hover:text-burgundy`}>O nama</Link>
                    <Link to="/commission-request" className={`${isActive('/commission-request') ? 'text-burgundy' : ''} hover:text-burgundy`}>Naručite sliku</Link>
                    {user && <Link to="/orders" className="hover:text-burgundy">Moje narudžbe</Link>}
                    {user?.role === 'ADMIN' && <Link to="/admin/products" className="hover:text-burgundy">Admin katalog</Link>}
                    {user?.role === 'ADMIN' && <Link to="/admin/orders" className="hover:text-burgundy">Upravljanje narudžbama</Link>}
                    {user?.role === 'ADMIN' && <Link to="/admin/commissions" className="hover:text-burgundy">Commission Requests</Link>}
                </div>
                <button className="rounded-lg p-2 text-ink md:hidden" onClick={() => setOpen(!open)} aria-label="Otvori izbornik">
                    <span className="text-2xl">{open ? '×' : '☰'}</span>
                </button>
                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden max-w-32 truncate text-sm font-semibold text-ink lg:block" title={user.name || user.email}>{user.name || user.email}</span>
                            <button onClick={logout} className="rounded-lg border border-burgundy/30 px-3 py-2 text-xs font-semibold text-burgundy hover:border-burgundy">Odjava</button>
                        </div>
                    ) : (
                        <Link to="/login" className="p-2 text-sm font-semibold text-stone-600 hover:text-burgundy" aria-label="Prijava">Prijava</Link>
                    )}
                    <Link to="/cart" className="flex items-center gap-2 rounded-lg border border-amber-900/15 px-3 py-2 text-sm font-semibold text-stone-700 hover:border-gold">
                        <span>Košarica</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.65rem] text-white">{cart.length}</span>
                    </Link>
                </div>
            </div>
            <div className={`${open ? 'flex' : 'hidden'} flex-col gap-2 border-t border-amber-900/10 py-4 md:hidden`}>
                <Link to="/" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Početna</Link>
                <a href="/#collection" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Proizvodi</a>
                <Link to="/about" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">O nama</Link>
                <Link to="/commission-request" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Naručite sliku</Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Košarica ({cart.length})</Link>
                {user ? <><span className="px-2 py-2 text-sm font-semibold text-burgundy">{user.name || user.email}</span><Link to="/orders" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Moje narudžbe</Link>{user.role === 'ADMIN' && <><Link to="/admin/products" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Admin katalog</Link><Link to="/admin/orders" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Upravljanje narudžbama</Link><Link to="/admin/commissions" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Commission Requests</Link></>}<button onClick={logout} className="px-2 py-2 text-left text-sm font-semibold">Odjava</button></> : <Link to="/login" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Prijava</Link>}
            </div>
        </nav>
        </>
    );
}