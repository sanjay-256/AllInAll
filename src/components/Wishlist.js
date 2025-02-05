import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Csmallcard from "./Csmallcard"; 
import { AppContext } from '../App';
import Spinner from "../inputfields/Spinner";

const Wishlist = () => {
  
  const { BASE_URL } = useContext(AppContext);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const email = localStorage.getItem("useremail");
        const user = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
        const userid = user.data;

        const response = await axios.get(`${BASE_URL}/wishlist/getproducts/${userid}`);
        setWishlistProducts(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [BASE_URL]); 

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#8A2BE2]">Your Wishlist</h1>
        {loading ? (
          <>
          <div className="flex items-center flex-col mt-10">
            <Spinner/>
          <p className="text-gray-500">Loading wishlist...</p>
          </div>
          </>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <Csmallcard
                key={product.id}
                product={product}
                classname="bg-white shadow-lg rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
