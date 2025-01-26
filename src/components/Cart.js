import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { AppContext } from '../App';
import Spinner from "../inputfields/Spinner";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {BASE_URL} = useContext(AppContext);

  const calculateOfferPercent = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  const fetchProductQuantity = async (userId, productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart/quantity/${userId}/${productId}`);
      setQuantities((prev) => ({ ...prev, [productId]: response.data }));
    } catch (error) {
      console.error(`Error fetching quantity for product ${productId}:`, error);
    }
  };

  const remove = async (product) => {
    try {
      const email = localStorage.getItem("useremail");
      if (!email) {
        console.error("User email not found in localStorage.");
        return;
      }

      const userResponse = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
      const userId = userResponse.data;

      await axios.delete(`${BASE_URL}/cart/delcart/${userId}/${product.id}`);
      setCartProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductSelect = (product) => {
    navigate(`/displaycard/${product.id}`);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const email = localStorage.getItem("useremail");
        if (!email) {
          console.error("User email not found in localStorage.");
          return;
        }
  
        const userResponse = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
        const userId = userResponse.data;
  
        const response = await axios.get(`${BASE_URL}/cart/getproducts/${userId}`);
        setCartProducts(response.data || []);
        setLoading(false);
  
        response.data.forEach((product) => {
          fetchProductQuantity(userId, product.id);
        });
      } catch (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    };  
    fetchCart();
  }, []);



  const totalDiscounted = cartProducts.reduce((sum, product) => {
    const quantity = quantities[product.id] || 1;
    return sum + (product.discountedPrice || product.originalPrice) * quantity;
  }, 0);

  const tax = Math.round(totalDiscounted * 0.1);
  const shipping = 99; // Fixed shipping cost
  const total = totalDiscounted + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner/>
        <div className="animate-pulse text-gray-500">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-scree bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-5">
          <ShoppingBag className="w-8 h-8 text-[#8A2BE2] mr-2" />
          <h1 className="text-3xl font-bold text-[#8A2BE2]">Your Shopping Cart</h1>
        </div>

        {cartProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#8A2BE2] hover:bg-[#c92e69] transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 overflow-y-auto h-[570px]">
              {cartProducts.map((product) => {
                const quantity = quantities[product.id] || 1;
                const totalOriginalPrice = product.originalPrice * quantity;
                const totalDiscountedPrice = product.discountedPrice
                  ? product.discountedPrice * quantity
                  : null;
                const discountPercent = product.discountedPrice
                  ? calculateOfferPercent(product.originalPrice, product.discountedPrice)
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6 flex flex-col sm:flex-row items-center space-x-6">
                      <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          className="h-full w-full object-cover"
                          src={product.imageUrl}
                          alt={product.title}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleProductSelect(product)}
                        >
                          <h3 className="text-lg font-semibold text-gray-900 capitalize hover:text-[#8A2BE2] transition-colors duration-200">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 capitalize">{product.brand}</p>
                        </div>

                        <div className="mt-4 flex items-center space-x-4">
                          <div className="flex items-center border rounded-md px-4 py-2 bg-gray-100">
                            <span className="text-gray-900 font-medium">{quantity}</span>
                          </div>
                          <button
                            onClick={() => remove(product)}
                            className="flex items-center px-3 py-3 border rounded-md bg-gray-100 text-sm text-[#8A2BE2] hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4   " />
                            
                          </button>
                        </div>
                      </div>

                      <div className="sm:text-right pr-8 mt-4 sm:pr-0 sm:mt-0">
                        <div className="text-lg font-medium text-gray-900 sm:block flex items-center gap-3">
                          {totalDiscountedPrice ? (
                            <>
                              <div className="text-sm text-gray-500 line-through">
                                ₹{totalOriginalPrice}
                              </div>
                              <div className="text-black">
                                ₹{totalDiscountedPrice}
                              </div>
                              <div className="text-sm text-[#8A2BE2]">
                                {discountPercent}% off
                              </div>
                            </>
                          ) : (
                            <div>₹{totalOriginalPrice}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{totalDiscounted}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="text-gray-900">₹{tax}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">₹{shipping}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-semibold text-[#8A2BE2]">₹{total}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-[#8A2BE2] text-white py-3 px-4 rounded-md font-medium hover:bg-[#c92e69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A2BE2] transition-colors duration-200">
                  Proceed to Checkout
                </button>

                <p className="mt-4 text-xs text-center text-gray-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
