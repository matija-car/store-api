export default function Footer() {
    return (
        <footer className="border-t border-burgundy-dark bg-burgundy px-5 py-12 text-cream sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div><p className="display-font text-2xl font-bold text-white">Dom Svjetla</p><p className="mt-3 max-w-xs text-sm leading-6 text-cream/70">Duhovni darovi za domove ispunjene vjerom, mirom i nadom.</p></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Kupnja</p><a href="/#collection" className="block text-sm text-cream/70 hover:text-white">Svi proizvodi</a><a href="/cart" className="mt-2 block text-sm text-cream/70 hover:text-white">Košarica</a></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Informacije</p><p className="text-sm text-cream/70">Sigurna kupnja</p><p className="mt-2 text-sm text-cream/70">Dostava i preuzimanje</p></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Kontakt</p><p className="text-sm text-cream/70">Za pitanja o proizvodima</p><p className="mt-2 text-sm text-cream/70">hello@domsvjetla.com</p></div>
            </div>
            <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-5 text-xs text-cream/50">&copy; {new Date().getFullYear()} Dom Svjetla. Sva prava pridržana.</div>
        </footer>
    );
}