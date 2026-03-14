import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Address from './pages/Address';
import Payment from './pages/Payment';
import Success from './pages/Success';

function App() {
  const { user } = useAuth();

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={user ? <Marketplace user={user} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/address" element={user ? <Address /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <Payment /> : <Navigate to="/login" />} />
          <Route path="/success" element={user ? <Success /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 0', backgroundColor: 'var(--nav-bg)', color: 'white', borderTop: '1px solid #333' }}>
        <div className="container" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '14px' }}>
          <span style={{ cursor: 'pointer', color: '#ccc' }}>Conditions of Use</span>
          <span style={{ cursor: 'pointer', color: '#ccc' }}>Privacy Notice</span>
          <span style={{ cursor: 'pointer', color: '#ccc' }}>Help</span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>&copy; 2024-2026 Shopkart.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}

export default App;
