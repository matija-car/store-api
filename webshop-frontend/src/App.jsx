import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import AdminProducts from './pages/AdminProducts';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminOrders from './pages/AdminOrders';
import About from './pages/About';
import CommissionRequest from './pages/CommissionRequest';
import AdminCommissions from './pages/AdminCommissions';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import StoreInfo from './pages/StoreInfo';
import LegalInfo from './pages/LegalInfo';

export default function App() {
    return (
        <Router>
            <div className="flex min-h-screen flex-col justify-between bg-ivory text-ink">
                <div>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/sigurna-kupnja" element={<StoreInfo path="/sigurna-kupnja" />} />
                        <Route path="/dostava-i-preuzimanje" element={<StoreInfo path="/dostava-i-preuzimanje" />} />
                        <Route path="/uvjeti-poslovanja" element={<LegalInfo path="/uvjeti-poslovanja" />} />
                        <Route path="/privatnost" element={<LegalInfo path="/privatnost" />} />
                        <Route path="/autorsko-djelo" element={<LegalInfo path="/autorsko-djelo" />} />
                        <Route path="/commission-request" element={<CommissionRequest />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/commissions" element={<AdminCommissions />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

function NotFound() {
    return (
        <main className="mx-auto max-w-2xl px-5 py-20 text-center sm:py-28">
            <p className="eyebrow mb-3">404</p>
            <h1 className="display-font text-4xl font-bold text-ink">Stranica nije pronađena</h1>
            <p className="mt-4 text-stone-500">Ova frontend ruta ne postoji.</p>
            <a href="/" className="mt-8 inline-block rounded-lg bg-burgundy px-5 py-3 font-semibold text-white hover:bg-burgundy-dark">
                Povratak na početnu
            </a>
        </main>
    );
}