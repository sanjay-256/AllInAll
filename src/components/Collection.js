import React, { useState, useMemo, useContext } from 'react';
import { IoIosArrowDropdown } from 'react-icons/io';
import Csmallcard from './Csmallcard';

import { AppContext } from '../App';

function Collection() {
  const { allproducts } = useContext(AppContext);
  const [products] = useState(allproducts); 
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    type: [],
  });
  const [sortOption, setSortOption] = useState('relevant'); 
  const [showFilter, setShowFilter] = useState(false); 


  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevState) => {
      const isChecked = prevState[filterType].includes(value);
      return {
        ...prevState,
        [filterType]: isChecked
          ? prevState[filterType].filter((item) => item !== value) 
          : [...prevState[filterType], value], 
      };
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
  
    // Apply category filter
    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.category.some((selected) => selected === product.category)
      );
    }
  
    // Apply type filter
    if (selectedFilters.type.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.type.some((selected) => selected === product.type)
      );
    }
  
// Apply sorting
if (sortOption === 'low-high') {
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.discountedPrice > 0 ? a.discountedPrice : a.originalPrice;
    const priceB = b.discountedPrice > 0 ? b.discountedPrice : b.originalPrice;
    return priceA - priceB;
  });
} else if (sortOption === 'high-low') {
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.discountedPrice > 0 ? a.discountedPrice : a.originalPrice;
    const priceB = b.discountedPrice > 0 ? b.discountedPrice : b.originalPrice;
    return priceB - priceA;
  });
}

  
    return filtered;
  }, [products, selectedFilters, sortOption]);

  // Sort option change handler
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Filter data configuration
  const filterData = [
    {
      title: 'Category',
      options: ['Men', 'Women', 'Kids'],
      filterKey: 'category',
    },
    {
      title: 'Type',
      options: ['Topwear', 'Bottomwear', 'Shoes'],
      filterKey: 'type',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-5 pt-10 border-t px-3 mb-3 bg-gray-100">
      {/* Filter Section */}
      <div className="min-w-44">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filters
          <IoIosArrowDropdown
            className={`h-5 mt-1 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          />
        </p>

        {/* Filter Options */}
        {filterData.map((filter, index) => (
          <div
            key={index}
            className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}
          >
            <p className="mb-3 text-sm font-medium">{filter.title}</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {filter.options.map((option, idx) => (
                <p className="flex gap-2" key={idx}>
                  <input
                    className="w-4"
                    type="checkbox"
                    value={option}
                    onChange={() => handleFilterChange(filter.filterKey, option)}
                    checked={selectedFilters[filter.filterKey].includes(option)}
                  />
                  {option}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Product Section */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <h2 className="texts text-lg">All Collections</h2>
        </div>

        {/* Sorting Dropdown */}
        <select
          className="border-2 border-gray-300 p-1 texts text-md"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-2 pb-8 md:pb-0">
          {filteredAndSortedProducts.map((product) => (
            <Csmallcard
              key={product.id}
              product={product}
              classname="bg-white shadow-lg rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collection;
