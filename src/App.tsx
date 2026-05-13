import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetails from './components/ProductDetails';
import Carrello from './components/Carrello/Carrello';
import Pagamento from './components/Pagamento/Pagamento';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import UserLayout from './components/user/UserLayout';
import Orders from './components/user/Orders';
import Overview from './components/user/Overview';
import Address from './components/user/Address';
import EditProfile from './components/user/EditProfile';

// 1. IMPORTA L'ADMIN E LE SOTTOCATEGORIE
import Admin from './components/Admin/Admin';
import CategoryProducts from './components/CategoryProducts';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/user" element={<UserLayout />}>
              <Route path="overview" element={<Overview />} /> 
              <Route path="orders" element={<Orders />} />
              <Route path="address" element={<Address />} />
              <Route path="profile" element={<EditProfile />} />
            </Route>
            
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/carrello" element={<Carrello />} />
            <Route path="/pagamento" element={<Pagamento />} />
            
            {/* ROTTA ADMIN */}
            <Route path="/admin" element={<Admin />} />

            {/* ROTTA SOTTOCATEGORIE (Questa è quella che fa funzionare il menu!) */}
            <Route path="/category/:categoryName/:subcategoryName" element={<CategoryProducts />} />

          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;