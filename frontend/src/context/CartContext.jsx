import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/data/shop";

const CART_KEY = "soc_cart_v1";
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const EMPTY_ADDRESS = {
  firstName: "", lastName: "", address: "", landmark: "",
  city: "", state: "", pincode: "",
};

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => setToast(msg), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        { id: product.id, slug: product.slug, name: product.name, price: product.price, unit: product.unit, image: product.image, quantity: qty },
      ];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, qty) } : i)).filter((i) => i.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const delivery = subtotal >= 799 || subtotal === 0 ? 0 : 79;
  const total = subtotal + delivery;

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Simulate placing the order (front-end only). Real Razorpay call plugs in here later.
  const placeOrder = useCallback((paymentMethod) => {
    const order = {
      order_number: "SOC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      firstName: address.firstName,
      city: address.city,
      subtotal, delivery, total,
      paymentMethod,
      items: cart,
    };
    setLastOrder(order);
    clearCart();
    return order;
  }, [address, subtotal, delivery, total, cart, clearCart]);

  const value = {
    cart, count, subtotal, delivery, total,
    addToCart, setQty, removeFromCart, clearCart,
    cartOpen, openCart, closeCart,
    toast, showToast,
    address, setAddress,
    lastOrder, placeOrder,
    PRODUCTS,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
