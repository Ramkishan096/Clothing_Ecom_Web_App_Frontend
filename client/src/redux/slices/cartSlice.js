import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
  console.log("Loading cart from localStorage");
  const savedCart = localStorage.getItem("cart");
  console.log("Loaded cart:", savedCart);
  return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
};

const saveCartToStorage = (state) => {
  console.log("Saving cart to localStorage");
  localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      state.totalDiscountAmount = state.items.reduce(
        (total, item) =>
          total + ((item.price * item.discount_rate) / 100) * item.quantity,
        0,
      );
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      state.totalDiscountAmount = state.items.reduce(
        (total, item) =>
          total + ((item.price * item.discount_rate) / 100) * item.quantity,
        0,
      );
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      state.totalDiscountAmount = state.items.reduce(
        (total, item) =>
          total + ((item.price * item.discount_rate) / 100) * item.quantity,
        0,
      );
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalDiscountAmount=0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
