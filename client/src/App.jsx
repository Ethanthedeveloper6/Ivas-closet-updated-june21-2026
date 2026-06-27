import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import About from './pages/About';
import Loyalty from './pages/Loyalty';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

function App() {
    const location = useLocation();
    const isAdminPage = location.pathname === '/admin';

    return (
        <>
            {!isAdminPage && <Navbar />}
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/loyalty" element={<Loyalty />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
            {!isAdminPage && <Footer />}
        </>
    );
}

export default App;
