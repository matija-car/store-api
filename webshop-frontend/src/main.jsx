import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

class AppErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <main className="mx-auto max-w-2xl px-5 py-20 text-center">
                    <h1 className="display-font text-3xl font-bold text-ink">Aplikacija se nije mogla učitati</h1>
                    <p className="mt-4 text-stone-500">Osvježite stranicu ili obrišite podatke web-mjesta pa pokušajte ponovno.</p>
                </main>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppErrorBoundary>
            <AuthProvider>
        <CartProvider>
            <App />
        </CartProvider>
            </AuthProvider>
        </AppErrorBoundary>
    </React.StrictMode>
);