import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existing = prevCart.find((item) => item.id === product.id);
            if (existing) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);