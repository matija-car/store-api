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
        <div className="bg-stone-900 px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
            Besplatna dostava za narudžbe iznad 100 € <span className="mx-2 text-stone-400">•</span> Sigurna kupnja
        </div>
        <nav className="sticky top-0 z-40 border-b border-stone-200 bg-white px-4 sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 py-4">
                <Link to="/" className="flex shrink-0 items-center gap-3 text-stone-900" onClick={() => setOpen(false)}>
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#a77952] text-sm font-bold text-white">AG</span>
                    <span className="display-font text-xl font-bold tracking-tight sm:text-2xl">Atelier Gallery</span>
                </Link>
                <div className="hidden items-center gap-7 text-sm font-semibold text-stone-600 md:flex">
                    <Link to="/" className={`${isActive('/') ? 'text-[#9a704b]' : ''} hover:text-[#9a704b]`}>Početna</Link>
                    <a href="/#collection" className="hover:text-[#9a704b]">Svi proizvodi</a>
                    <a href="/#about" className="hover:text-[#9a704b]">O nama</a>
                </div>
                <button className="rounded-lg p-2 text-stone-800 md:hidden" onClick={() => setOpen(!open)} aria-label="Otvori izbornik">
                    <span className="text-2xl">{open ? '×' : '☰'}</span>
                </button>
                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <button onClick={logout} className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-900">Odjava</button>
                    ) : (
                        <Link to="/login" className="p-2 text-sm font-semibold text-stone-600 hover:text-[#9a704b]" aria-label="Prijava">Prijava</Link>
                    )}
                    <Link to="/cart" className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:border-[#a77952]">
                        <span>Košarica</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#a77952] px-1 text-[0.65rem] text-white">{cart.length}</span>
                    </Link>
                </div>
            </div>
            <div className={`${open ? 'flex' : 'hidden'} flex-col gap-2 border-t border-stone-100 py-4 md:hidden`}>
                <Link to="/" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Početna</Link>
                <a href="/#collection" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Svi proizvodi</a>
                <Link to="/cart" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Košarica ({cart.length})</Link>
                {user ? <button onClick={logout} className="px-2 py-2 text-left text-sm font-semibold">Odjava</button> : <Link to="/login" onClick={() => setOpen(false)} className="px-2 py-2 text-sm font-semibold">Prijava</Link>}
            </div>
        </nav>
        </>
    );
}