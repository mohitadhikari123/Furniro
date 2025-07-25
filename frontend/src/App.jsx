import React, { useState } from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";
import store from "./store";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import SingleProduct from "./pages/SingleProduct";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import SidebarCart from "./components/SidebarCart";
import SidebarFavorites from "./components/SidebarFavorites";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import "./App.css";

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);


  // Sync data only once when app loads if user is already authenticated
  

  return (
    <div className="App">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        onFavoritesClick={() => setIsFavoritesOpen(true)}
      />
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SidebarFavorites isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
      <Notification />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
