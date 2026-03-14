import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { cart, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '20px', paddingBottom: '40px' }}>
            <div className="card" style={{ flex: 3, minHeight: '400px' }}>
                <h1 style={{ fontSize: '24px', borderBottom: '1px solid #ddd', paddingBottom: '15px', marginTop: '0', fontWeight: '600' }}>
                    Shopping Cart
                </h1>

                {cart.length === 0 ? (
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                        <div style={{ fontSize: '100px', marginBottom: '10px', opacity: 0.2 }}>🛒</div>
                        <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '10px' }}>Your Shopkart Cart is empty.</h2>
                        <Link to="/" style={{ color: '#007185', textDecoration: 'none', fontWeight: '600' }}>Shop today's deals</Link>
                    </div>
                ) : (
                    <div>
                        {cart.map((cartItem) => (
                            <div key={cartItem.item._id} style={{ display: 'flex', borderBottom: '1px solid #ddd', gap: '20px', padding: '20px 0' }}>
                                <div style={{ width: '180px', height: '180px', flexShrink: 0, backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', mixBlendMode: 'multiply' }}>
                                    <img src={cartItem.item.image} alt={cartItem.item.title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '500', lineHeight: '1.4' }}>{cartItem.item.title}</h3>
                                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>${cartItem.item.price.toFixed(2)}</div>
                                    </div>
                                    <div style={{ color: '#007600', fontSize: '13px', marginBottom: '8px' }}>In Stock</div>
                                    <div style={{ fontSize: '12px', color: '#565959', marginBottom: '15px' }}>Eligible for FREE Shipping</div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '13px' }}>
                                        <div style={{ backgroundColor: '#f0f2f2', border: '1px solid #d5d9d9', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(15,17,17,.15)' }}>
                                            <span>Qty: {cartItem.quantity}</span>
                                        </div>
                                        <div style={{ color: '#ddd' }}>|</div>
                                        <a href="#" onClick={(e) => { e.preventDefault(); removeFromCart(cartItem.item._id); }} style={{ color: '#007185', textDecoration: 'none' }}>
                                            Delete
                                        </a>
                                        <div style={{ color: '#ddd' }}>|</div>
                                        <a href="#" style={{ color: '#007185', textDecoration: 'none' }}>Save for later</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '18px' }}>
                            Subtotal ({cartCount} item{cartCount > 1 ? 's' : ''}): <span style={{ fontWeight: 'bold', fontSize: '22px' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ flex: 1, position: 'sticky', top: '80px' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', color: '#007600' }}>
                    <span style={{ border: '2px solid #007600', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    <span style={{ fontSize: '13px' }}>Your order is eligible for FREE Delivery. Select this option at checkout.</span>
                </div>
                <div style={{ fontSize: '20px', marginBottom: '20px' }}>
                    Subtotal ({cartCount} item{cartCount > 1 ? 's' : ''}): <span style={{ fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                    disabled={cart.length === 0}
                    onClick={() => navigate('/address')}
                    className="btn-primary btn-checkout"
                    style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
                >
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
