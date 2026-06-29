import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import RSVP from './pages/RSVP';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePresents from './pages/admin/ManagePresents';
import ManageRSVP from './pages/admin/ManageRSVP';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <main style={{ flexGrow: 1, paddingTop: '72px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/rsvp" element={<RSVP />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/presents" element={<ProtectedRoute><ManagePresents /></ProtectedRoute>} />
              <Route path="/admin/rsvp" element={<ProtectedRoute><ManageRSVP /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
