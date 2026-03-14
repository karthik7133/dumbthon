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

      <footer style={{
        textAlign: 'center',
        padding: '60px 0',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '60px'
      }}>
        <div className="container" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>SERVICE TERMS</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>PRIVACY VAULT</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>SUPPORT</span>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontWeight: '800', letterSpacing: '2px' }}>
          &copy; 2024-2026 SHOPKART MAIN_NET. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}

export default App;
