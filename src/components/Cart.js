
import React, { useEffect, useState } from "react";
import axios from "axios";
import Csmallcard from "./Csmallcard"; 

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const email = localStorage.getItem("useremail");
        const user = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
        const userid = user.data;

        const response = await axios.get(`http://localhost:8080/cart/getproducts/${userid}`);
        setCartProducts(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);



  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading cart...</p>
        ) : cartProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8 md:pb-0">
            {cartProducts.map((product) => (
              <Csmallcard
                key={product.id}
                product={product}
                classname="bg-white shadow-lg rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
