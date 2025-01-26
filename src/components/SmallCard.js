import LikeIcon from '@mui/icons-material/Favorite';
import "../App.css";
import { AppContext } from '../App';  
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

const SmallCard = ({ products, classname }) => { 
  const navigate = useNavigate(); 
  const { toggleLike } = useContext(AppContext);  
  const [items, setItems] = useState(products || []);

  useEffect(() => {
    setItems(products || []);
  }, [products]);

  const handleProductSelect = (product) => {
    navigate(`/displaycard/${product.id}`);
  };

  const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
    if (originalPrice && discountedPrice) {
      const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
      return Math.round(discount); 
    }
    return 0;
  };

  return (
    <div className={`gap-6 p-4 ${classname}`}>
      {Array.isArray(items) && items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-52 h-fit bg-white shadow-lg border border-slate-300 rounded-md overflow-hidden relative"
          >
            {/* Image with overlay */}
            <div 
              className="relative cursor-pointer"
              onClick={(e) => {
                // Prevent navigation when clicking on LikeIcon
                if (!e.target.closest('.like-icon')) {
                  handleProductSelect(item);
                }
              }}
            >
              <img
                className="h-56 w-full object-cover rounded-md"
                src={item.imageUrl}
                alt={item.title}
              />
              {/* Discount Badge */}
              {item.discountedPrice > 0 && item.originalPrice && (
                <span className="absolute top-2 left-2 bg-[#8A2BE2] text-white font-medium px-2 rounded flex items-center">
                  <span className="text-md atext1 pb-1">
                    {calculateDiscountPercentage(item.originalPrice, item.discountedPrice)}
                  </span>
                  <span className="text-xs texts"> % OFF</span>
                </span>
              )}
              {/* Overlay for Product Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
              <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end p-2 rounded-md">
                <p className="text-white text-lg font-bold truncate">{item.title}</p>
                <p className="text-white text-sm opacity-90 font-medium truncate">{item.brand}</p>
                <p className="text-white font-medium">
                  {item.discountedPrice ? (
                    <>
                      <span className="mr-2 text-slate-300 line-through">₹{item.originalPrice}</span>
                      ₹{item.discountedPrice}
                    </>
                  ) : (
                    <>₹{item.originalPrice}</>
                  )}
                </p>
              </div>
            </div>
            {/* Like Icon */}
            <LikeIcon
              className={`absolute top-2 right-2 bg-white rounded-full p-1 like-icon ${item.isLiked ? 'text-red-500' : 'text-slate-300'}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent click
                toggleLike(item.id);
              }}
              style={{ fontSize: '30px', cursor: 'pointer' }}
            />
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default SmallCard;

