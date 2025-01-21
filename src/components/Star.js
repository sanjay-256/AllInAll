import React from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';

const Star = ({ rating }) => {
  // Create an array of 5 stars based on the rating
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(rating)) return 'filled'; // For whole stars
    if (index === Math.floor(rating) && rating % 1 !== 0) return 'half'; // For half-star
    return null; // No star for the remaining positions
  });

  return (
    <div className="flex items-center gap-1">
      {stars.map((star, index) => {
        if (star === 'filled') {
          return <FaStar key={index} style={{ color: 'gold', fontSize: '24px' }} />;
        }
        if (star === 'half') {
          return <FaStarHalf key={index} style={{ color: 'gold', fontSize: '24px' }} />;
        }
        return null; // Do not render empty stars
      })}
    </div>
  );
};

export default Star;
