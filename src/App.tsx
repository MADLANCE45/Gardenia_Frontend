import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetails from './components/ProductDetails';
import Carrello from './components/Carrello/Carrello';
import Pagamento from './components/Pagamento/Pagamento'; // 1. Importa il nuovo componente
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import UserLayout from './components/user/UserLayout';
import Orders from './components/user/Orders';
import Overview from './components/user/Overview';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/user" element={<UserLayout />}>
  {/* Aggiungi questa riga per la pagina di benvenuto del profilo */}
  <Route path="overview" element={<Overview />} /> 
  <Route path="orders" element={<Orders />} />
  <Route path="address" element={<address />} />
  {/* Rimosso Wishlist */}
</Route>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/carrello" element={<Carrello />} />
            {/* 2. Aggiungi la rotta per il pagamento */}
            <Route path="/pagamento" element={<Pagamento />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;