import React, { useState } from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";
import store from "./store";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import SingleProduct from "./pages/SingleProduct";
import Navbar from "./components/Navbar";
import SidebarCart from "./components/SidebarCart";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Provider store={store}>
      <div className="App">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<SingleProduct />} />
        </Routes>

        <Footer />
      </div>
    </Provider>
  );
};

export default App;
