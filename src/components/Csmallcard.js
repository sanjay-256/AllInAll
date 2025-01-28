import LikeIcon from '@mui/icons-material/Favorite';
import { AppContext } from '../App';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

const Csmallcard = ({ product, classname, onClick }) => {
  const { allproducts, toggleLike } = useContext(AppContext);  
  const [item, setItem] = useState(product);  
  const navigate = useNavigate(); 

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
        <div
          key={item.id}
          className="group flex-shrink-0 w-80 bg-white shadow-lg border border-slate-300 rounded-md overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
        >
          <div className="bg-gray-100 rounded-md text-center relative">
            <LikeIcon
              className={`absolute top-2 right-2 bg-white rounded-full p-1 ${
                item.isLiked ? 'text-red-500' : 'text-slate-300'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              style={{ fontSize: '30px', cursor: 'pointer', zIndex: '10' }}
            />
            <img
              className="h-96 w-full rounded transition-transform duration-300 transform group-hover:scale-105" 
              onClick={() => handleProductSelect(item)}
              src={item.imageUrl}
              alt={item.title}
            />
          </div>
          <div className="body capitalize p-4">
            <p className="text-md font-semibold group-hover:text-[#8A2BE2]">{item.title}</p>
            <p className="text-gray-700 text-sm">{item.brand}</p>
            <p className="text-gray-600 text-sm truncate mt-4">{item.description}</p>
            <div className="flex justify-between py-2">
              <p className="font-medium text-lg">
                {item.discountedPrice ? (
                  <>
                    ₹{item.discountedPrice}
                    <span className="ml-2 text-slate-400 line-through">₹{item.originalPrice}</span>
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
