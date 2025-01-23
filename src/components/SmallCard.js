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
            className="flex-shrink-0 w-56 bg-white shadow-lg p-2 border border-slate-300 rounded-md"
          >
            <div className="bg-gray-100 rounded-md text-center relative">
              <LikeIcon
                className={`absolute right-2 ${item.isLiked ? 'text-red-500' : 'text-slate-300'}`}
                onClick={() => toggleLike(item.id)}  
                style={{ fontSize: '30px', cursor: 'pointer' }}
              />
              <img
               onClick={() => handleProductSelect(item)}
                className="h-56 w-full rounded"
                src={item.imageUrl}
                alt={item.title}
              />
              {item.discountedPrice>0 && item.originalPrice && (
                <span className="absolute top-2 left-2 bg-[#8A2BE2] text-white font-medium px-2 rounded flex items-center">
                  <span className='text-md atext1 pb-1'>{calculateDiscountPercentage(item.originalPrice, item.discountedPrice)}</span> <span className="text-xs texts"> % OFF</span>
                </span>
              )}
            </div>
            <div className="body capitalize bg-neutral-50 mt-1 px-1 rounded-md">
              <p className="text-lg">{item.title}</p>
              <div className="flex justify-between">
                <p className="font-semibold">{item.brand}</p>
                <p className="font-medium">
                  {item.discountedPrice ? (
                    <>
                      <span className="mr-2 text-slate-400 line-through">₹{item.originalPrice}</span>
                      ₹{item.discountedPrice}
                    </>
                  ) : (
                    <>₹{item.originalPrice}</>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default SmallCard;
