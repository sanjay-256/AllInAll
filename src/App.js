import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Landing2 from "./components/Landing2";  
import Home from "./components/Home";
import Collection from "./components/Collection";
import Displaycard from "./components/Displaycard";
import About from "./components/About";
import Wishlist from "./components/Wishlist";
import axios from "axios";
import Cart from "./components/Cart";

export const AppContext = createContext();

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [allproducts, setAllproducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  // const BASE_URL="http://192.168.1.11:8080";
  const BASE_URL="http://localhost:8080";
  

  useEffect(() => {
    const userStatus = localStorage.getItem('allinall');
    if (userStatus === 'true') {
      setIsRegistered(true);
    }

    const fetchProductsWithLikes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product/getall`);
        const products = response.data;

        const email = localStorage.getItem('useremail');
        if (email) {
          const userResponse = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
          const userId = userResponse.data;

          // Fetch isLiked for each product
          const enrichedProducts = await Promise.all(
            products.map(async (product) => {
              const isLikedResponse = await axios.get(`${BASE_URL}/wishlist/isLiked/${userId}/${product.id}`);
              return {
                ...product,
                isLiked: isLikedResponse.data, 
              };
            })
          );

          setAllproducts(enrichedProducts);
        } else {
          setAllproducts(products);
        }
      } catch (error) {
        console.error("Failed to fetch products with likes:", error);
      }
    };

    fetchProductsWithLikes();

    const fetchCartCount = async () => {
      try {
          const email = localStorage.getItem("useremail");
          if (!email) {
              console.error("User email not found in localStorage.");
              return;
          }

          const userResponse = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
          const userId = userResponse.data;

          const response = await axios.get(`${BASE_URL}/cart/count/${userId}`);
          setCartCount(response.data);
      } catch (error) {
          console.error("Error fetching cart count:", error);
      }
  };
  fetchCartCount();
  }, []);

  const toggleLike = async (productId) => {
    try {
      const email = localStorage.getItem('useremail');
      if (!email) {
        console.error("User email not found in localStorage.");
        return;
      }
  
      const userResponse = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
      const userId = userResponse.data;
  
      const productIndex = allproducts.findIndex((p) => p.id === productId);
      if (productIndex === -1) return;
  
      const isLiked = allproducts[productIndex].isLiked;
  
      // Optimistically update the UI to reflect the like/unlike action immediately
      const updatedProducts = [...allproducts];
      updatedProducts[productIndex].isLiked = !isLiked;
      setAllproducts(updatedProducts);
  
      // Now perform the backend operation
      if (isLiked) {
        // Unlike the product
        await axios.post(`${BASE_URL}/wishlist/unlike/${userId}/${productId}`);
        await axios.delete(`${BASE_URL}/wishlist/delwishlist/${userId}/${productId}`);
      } else {
        // Like the product
        await axios.post(`${BASE_URL}/wishlist/like/${userId}/${productId}`);
        await axios.post(`${BASE_URL}/wishlist/addwishlist/${userId}/${productId}`);
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <AppContext.Provider value={{ allproducts, cartCount,BASE_URL, setCartCount, toggleLike }}>
      <Router>
        <MainContent isRegistered={isRegistered} setIsRegistered={setIsRegistered} />
      </Router>
    </AppContext.Provider>
  );
}

function MainContent({ isRegistered, setIsRegistered }) {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [location]);

  return (
    <>
      {(location.pathname === "/home" || location.pathname === "/collection" || location.pathname === "/about" || location.pathname === "/cart" || location.pathname === "/wishlist" || location.pathname.startsWith("/displaycard")) && <Header />}
      <div>
        <Routes>
          <Route path="/" element={isRegistered ? <Navigate to="/home" /> : <Landing2 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/landing" element={<Landing2 />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/displaycard/:id" element={<Displaycard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
