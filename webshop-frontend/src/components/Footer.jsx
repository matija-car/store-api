export default function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-stone-900 px-5 py-12 text-stone-300 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div><p className="display-font text-2xl font-bold text-white">Atelier Gallery</p><p className="mt-3 max-w-xs text-sm leading-6 text-stone-400">Originalna umjetnost za domove koji imaju svoju priču.</p></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Kupnja</p><a href="/#collection" className="block text-sm text-stone-400 hover:text-white">Svi proizvodi</a><a href="/cart" className="mt-2 block text-sm text-stone-400 hover:text-white">Košarica</a></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Informacije</p><p className="text-sm text-stone-400">Sigurna kupnja</p><p className="mt-2 text-sm text-stone-400">Dostava i preuzimanje</p></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Kontakt</p><p className="text-sm text-stone-400">Za pitanja o proizvodima</p><p className="mt-2 text-sm text-stone-400">hello@ateliergallery.com</p></div>
            </div>
            <div className="mx-auto mt-10 max-w-7xl border-t border-stone-700 pt-5 text-xs text-stone-500">&copy; {new Date().getFullYear()} Atelier Gallery. Sva prava pridržana.</div>
        </footer>
    );
}