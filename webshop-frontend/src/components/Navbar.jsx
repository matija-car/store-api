import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-stone-900 text-stone-100 px-6 py-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-2xl font-serif tracking-wide font-bold hover:text-stone-300 transition">
                Art Gallery
            </Link>
            <div className="flex gap-6 items-center">
                <Link to="/" className="hover:text-stone-300 transition">Galerija</Link>
                <Link to="/cart" className="hover:text-stone-300 transition">Košarica</Link>
                <Link to="/login" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition">
                    Prijava
                </Link>
            </div>
        </nav>
    );
}