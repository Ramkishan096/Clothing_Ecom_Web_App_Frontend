import React from 'react';
import styles from './OrderDetailsModal.module.css';
import { UPLOADS_URL } from '../../../../../config';

const OrderDetailsModal = ({ order, onClose, getStatusBadge, formatDate }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Order Details</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          {/* Order Info */}
          <div className={styles.orderInfoGrid}>
            <div className={styles.infoItem}>
              <label>Order ID</label>
              <span>{order.order_id}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Order Status</label>
              <span 
                className={styles.statusBadge}
                style={{ 
                  backgroundColor: getStatusBadge(order.order_status, 'order'),
                  color: '#fff'
                }}
              >
                {order.order_status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label>Payment Method</label>
              <span>{order.payment_method}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Payment Status</label>
              <span 
                className={styles.statusBadge}
                style={{ 
                  backgroundColor: getStatusBadge(order.payment_status, 'payment'),
                  color: '#fff'
                }}
              >
                {order.payment_status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label>Order Date</label>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Total Amount</label>
              <span className={styles.totalAmount}>₹{order.final_payable_amount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className={styles.section}>
            <h4>Customer Details</h4>
            <div className={styles.customerBox}>
              <div className={styles.customerRow}>
                <span className={styles.label}>Name:</span>
                <span>{order.shippingAddress?.first_name} {order.shippingAddress?.last_name}</span>
              </div>
              <div className={styles.customerRow}>
                <span className={styles.label}>Mobile:</span>
                <span>{order.shippingAddress?.phone || order.guest_mobile_no}</span>
              </div>
              <div className={styles.customerRow}>
                <span className={styles.label}>Email:</span>
                <span>{order.shippingAddress?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className={styles.section}>
            <h4>Shipping Address</h4>
            <div className={styles.addressBox}>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className={styles.section}>
            <h4>Order Items ({order.items?.length || 0})</h4>
            <div className={styles.itemsTableContainer}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>MRP</th>
                    <th>Discount</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className={styles.productInfo}>
                          <img 
                            // src={item.cover_image} 
                            src={`${UPLOADS_URL}${item.cover_image}`}               
                            alt={item.product_name}
                            className={styles.productImage}
                          />
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td>{item.size || 'N/A'}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.mrp_price?.toFixed(2)}</td>
                      <td className={styles.discountText}>{item.discount_rate}%</td>
                      <td>₹{item.selling_price?.toFixed(2)}</td>
                      <td>₹{(item.selling_price * item.quantity)?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6"></td>
                    <td><strong>Subtotal:</strong></td>
                    <td><strong>₹{order.sub_total?.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td><strong>Discount:</strong></td>
                    <td><strong className={styles.discountText}>-₹{order.total_discount?.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td colSpan="6"></td>
                    <td><strong>Shipping:</strong></td>
                    <td><strong>₹{order.shipping_charge?.toFixed(2)}</strong></td>
                  </tr>
                  {order.cod_charge > 0 && (
                    <tr>
                      <td colSpan="6"></td>
                      <td><strong>COD Charge:</strong></td>
                      <td><strong>₹{order.cod_charge?.toFixed(2)}</strong></td>
                    </tr>
                  )}
                  <tr className={styles.totalRow}>
                    <td colSpan="6"></td>
                    <td><strong>Total:</strong></td>
                    <td><strong className={styles.totalAmount}>₹{order.final_payable_amount?.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Tracking History */}
          <div className={styles.section}>
            <h4>Order Tracking</h4>
            <div className={styles.trackingList}>
              {order.tracking?.map((track, index) => (
                <div key={index} className={styles.trackingItem}>
                  <div className={styles.trackingDot}></div>
                  <div className={styles.trackingContent}>
                    <div className={styles.trackingStatus}>{track.status}</div>
                    <div className={styles.trackingMessage}>{track.message}</div>
                    <div className={styles.trackingTime}>{formatDate(track.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;