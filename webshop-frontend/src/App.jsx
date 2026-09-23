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
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}