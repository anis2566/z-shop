import { Product, Stock } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProductWithStock extends Product {
  stocks?: Stock[];
}

interface AddToCartState {
  product: ProductWithStock;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  cart: {
    product: ProductWithStock;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  addToCart: (values: AddToCartState) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  updateSize: (productId: string, size: string) => void;
  updateColor: (productId: string, color: string) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: ({
        product,
        price,
        quantity,
        size,
        color,
      }: AddToCartState) => {
        set((state) => {
          const cartIndex = state.cart.findIndex(
            (item) => item.product.id === product.id
          );

          if (cartIndex !== -1) {
            // Update existing product in cart
            const updatedCart = [...state.cart];
            updatedCart[cartIndex].quantity += quantity;
            return { cart: updatedCart };
          } else {
            // Add new product to cart
            return {
              cart: [...state.cart, { product, price, size, quantity, color }],
            };
          }
        });
      },
      removeFromCart: (productId: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },
      incrementQuantity: (productId: string) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          return { cart: updatedCart };
        });
      },
      decrementQuantity: (productId: string) => {
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0);
          return { cart: updatedCart };
        });
      },
      updateSize: (productId: string, size: string) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.product.id === productId ? { ...item, size } : item
          );
          return { cart: updatedCart };
        });
      },
      updateColor: (productId: string, color: string) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.product.id === productId ? { ...item, color } : item
          );
          return { cart: updatedCart };
        });
      },
    }),
    {
      name: "user-cart",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
