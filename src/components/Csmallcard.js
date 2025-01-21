import LikeIcon from '@mui/icons-material/Favorite';
import { AppContext } from '../App';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

const Csmallcard = ({ product, classname, onClick }) => {
  const { allproducts, toggleLike } = useContext(AppContext);  
  const [item, setItem] = useState(product);  
  const navigate = useNavigate(); 

  // Update the local `item` state whenever the global `allproducts` changes
  useEffect(() => {
    const updatedProduct = allproducts.find((p) => p.id === product.id);
    if (updatedProduct) {
      setItem(updatedProduct);
    }
  }, [allproducts, product.id]);

  const handleProductSelect = (product) => {
    navigate(`/displaycard/${product.id}`);
  };

  return (
    <div className={`mx-auto p-2 ${classname}`} onClick={onClick}>
      {item ? (
        <div key={item.id} className="flex-shrink-0 w-56 bg-white shadow-lg p-2 border border-slate-300 rounded-md">
          <div className="bg-gray-100 rounded-md text-center relative">
            <LikeIcon
              className={`absolute right-2 ${item.isLiked ? 'text-red-500' : 'text-slate-300'}`}
              onClick={(e) => {
                e.stopPropagation(); 
                toggleLike(item.id);
              }}
              style={{ fontSize: '30px', cursor: 'pointer' }}
            />
            <img
              className="h-56 w-full rounded"
            onClick={() => handleProductSelect(item)}
              src={item.imageUrl}
              alt={item.title}
            />
          </div>
          <div
            className="body capitalize bg-neutral-50 mt-1 border-t-2 px-1"
          >
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
      ) : (
        <p>No product data available.</p>
      )}
    </div>
  );
};

export default Csmallcard;
