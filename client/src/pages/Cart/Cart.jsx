import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/slices/cartSlice";
import styles from "./Cart.module.css";
import { UPLOADS_URL } from "../../config";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalDiscountAmount } = useAppSelector(
    (state) => state.cart,
  );
  console.log("Cart items:", items);
  console.log("Total amount:", totalAmount);
  console.log("total Discount amount:", totalDiscountAmount);
  const subtotal = totalAmount;
  const discount = totalDiscountAmount;
  const finalTotal = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button
          onClick={() => navigate("/")}
          className={styles.shopBtn}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        <div className={styles.cartContainer}>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}onClick={()=>{navigate("/product/"+item.slug)}}>
                  <img 
                  // src={item.image}
                  src={`${UPLOADS_URL}${item.image}`}                  
                  alt={item.name}
                 />
                </div>

                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <div className={styles.priceSection}>
                    <span className={styles.sellingPrice}>
                      ₹{item.selling_price.toFixed(2)}
                    </span>

                    <span className={styles.mrpPrice}>
                      ₹{item.price.toFixed(2)}
                    </span>

                    <span className={styles.discountRate}>
                      {item.discount_rate}% OFF
                    </span>
                  </div>
                  <p>
                    You saved{" "}
                    <span className={styles.discountAmount}>
                      ₹{Number(((item.price*item.discount_rate)/100*item.quantity) || 0).toLocaleString("en-IN")}
                    </span>{" "}
                    on this order.
                  </p>
                  <div className={styles.itemActions}>
                    <div className={styles.quantity}>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      className={styles.removeBtn}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className={styles.itemTotal}>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <button
              className={styles.clearCartBtn}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>

          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount Amount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ₹{styles.total}`}>
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              Proceed To Checkout
            </button>
            <button
              className={styles.continueBtn}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
