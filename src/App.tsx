import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

import RSVP from './pages/RSVP';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePresents from './pages/admin/ManagePresents';
import ManageRSVP from './pages/admin/ManageRSVP';
import ManageDonations from './pages/admin/ManageDonations';
import AdminLogin from './pages/admin/AdminLogin';

function ScrollManager() {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      (window as any).lenis = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      // Smooth scroll to top on route change
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
        <Router>
          <ScrollManager />
          <Navbar />
          <main style={{ flexGrow: 1, paddingTop: '72px' }}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/rsvp" element={<RSVP />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/presents" element={<ProtectedRoute><ManagePresents /></ProtectedRoute>} />
              <Route path="/admin/rsvp" element={<ProtectedRoute><ManageRSVP /></ProtectedRoute>} />
              <Route path="/admin/donations" element={<ProtectedRoute><ManageDonations /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </Router>
    </AuthProvider>
  );
}

export default App;
