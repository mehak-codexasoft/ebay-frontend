import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Landmarks from './pages/Landmarks';
import Products from './pages/Products';
import Cities from './pages/Cities';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Trips from './pages/Trips';
import Login from './pages/Login';
import authService from './services/authService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = authService.isAuthenticated();
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AdminLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/landmarks" element={<Landmarks />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
