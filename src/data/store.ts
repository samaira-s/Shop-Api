import { Product, CartItem, Order } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Noise cancelling, 30hr battery",
    price: 49.99,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
  },
  {
    id: "2",
    name: "Running Shoes",
    description: "Lightweight, breathable design",
    price: 79.99,
    category: "Fashion",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "RGB backlit, tactile switches",
    price: 99.99,
    category: "Electronics",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
  },
  {
    id: "4",
    name: "Portable Charger",
    description: "20000mAh, dual USB ports",
    price: 29.99,
    category: "Electronics",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200",
  },
  {
    id: "5",
    name: "Smart Watch",
    description: "Heart rate monitor, GPS, waterproof",
    price: 149.99,
    category: "Electronics",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
  },
];

export const cart: CartItem[] = [];

export const orders: Order[] = [];