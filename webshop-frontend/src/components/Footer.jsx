import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t border-burgundy-dark bg-burgundy px-5 py-12 text-cream sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <div><p className="display-font text-2xl font-bold text-white">Dom Svjetla</p><p className="mt-3 max-w-xs text-sm leading-6 text-cream/70">Duhovni darovi za domove ispunjene vjerom, mirom i nadom.</p></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Galerija</p><a href="/galerija#collection" className="block text-sm text-cream/70 hover:text-white">Umjetnička djela</a><a href="/odabrano" className="mt-2 block text-sm text-cream/70 hover:text-white">Odabrana djela</a></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Pravne informacije</p><Link to="/uvjeti-poslovanja" className="block text-sm text-cream/70 hover:text-white">Opći uvjeti poslovanja</Link><Link to="/privatnost" className="mt-2 block text-sm text-cream/70 hover:text-white">Izjava o privatnosti</Link><Link to="/impresum" className="mt-2 block text-sm text-cream/70 hover:text-white">Impresum / O nama</Link><Link to="/kolacici" className="mt-2 block text-sm text-cream/70 hover:text-white">Politika kolačića</Link><Link to="/autorsko-djelo" className="mt-2 block text-sm text-cream/70 hover:text-white">Autorsko djelo</Link></div>
                <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Kontakt</p><p className="text-sm text-cream/70">Za pitanja o umjetničkim djelima</p><p className="mt-2 text-sm text-cream/70">hello@domsvjetla.com</p></div>
            </div>
            <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-5 text-xs text-cream/50">&copy; {new Date().getFullYear()} Dom Svjetla. Sva prava pridržana.</div>
        </footer>
    );
}