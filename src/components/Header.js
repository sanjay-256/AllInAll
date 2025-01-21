import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi2';
import { IoIosLogOut } from "react-icons/io";
import { RiHome9Fill } from "react-icons/ri";
import { BsCollectionFill } from "react-icons/bs";
import { BsBagHeartFill } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { MdPerson } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { RiSmartphoneFill } from "react-icons/ri";
import axios from 'axios';
import { AppContext } from '../App';

const Header = () => {
  
  const { cartCount } = useContext(AppContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const email = localStorage.getItem('useremail');
        if (email) {
          const response = await axios.get(`http://localhost:8080/user/profile/${email}`);
          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  },[])


  const navItems = [
    { name: 'Home', path: '/home', icon: <RiHome9Fill /> },
    { name: 'Collections', path: '/collection', icon: <BsCollectionFill /> },
    { name: 'About', path: '/about', icon: <FaCircleInfo /> },
    { name: 'Wishlist', path: '/wishlist', icon: <BsBagHeartFill /> },
  ];
  const navItem = [
    { name: 'Home', path: '/home', icon: <RiHome9Fill /> },
    { name: 'Collections', path: '/collection', icon: <BsCollectionFill /> },
    { name: 'Wishlist', path: '/wishlist', icon: <BsBagHeartFill /> },
    { name: 'Cart', path: '/cart', icon: <HiShoppingCart /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('allinall');
    localStorage.removeItem('useremail');
    
    navigate('/landing');
    window.location.reload(); 
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between p-3 px-5 font-medium shadow-md">
      {/* Brand Logo */}
      <Link to="/home" className="brand text-4xl font-semibold md:tracking-normal hover:md:tracking-widest transition-all duration-300">
        <span className="block md:hidden">All in All</span>
        <span className="hidden md:block w-10">AllinAll</span>
      </Link>

      {/* Navigation for larger screens */}
      <ul className="hidden sm:flex gap-5 text-md text-gray-700">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-black' : 'text-gray-700'}`
            }
          >
            {({ isActive }) => (
              <>
                <p>{item.name}</p>
                <hr
                  className={`w-2/4 border-none h-[1.5px] bg-gray-700 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      {/* Icons Section */}
      <div className="flex items-center gap-4 md:gap-6 cursor-pointer">
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <BsPersonCircle className="w-6 h-6 text-gray-700 hover:text-black transition duration-300 text-4xl" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="absolute right-0 top-10 mt-2 py-3 px-5 w-68 z-50 bg-white shadow-md rounded text-gray-500">
              <div className="flex flex-col gap-2">
                <div className="">
               { user &&
                <>
                <p className="flex items-center gap-3"><MdPerson />{user.username}</p>
                <p className="flex items-center gap-3"><MdEmail />{user.useremail}</p>
                <p className="flex items-center gap-3"><RiSmartphoneFill />{user.usernumber}</p>
                </>
               }
                </div>
                <p className="cursor-pointer flex gap-2 items-center hover:text-red-400" onClick={handleLogout}>
                  <IoIosLogOut /> Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <HiShoppingCart className="w-7 h-6 min-w-5" />
          {cartCount >= 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black font-semibold text-white aspect-square rounded-full text-[8px]">
              {cartCount}
            </p>
          )}
        </Link>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md sm:hidden">
        <div className="flex justify-around items-center py-2">
          {navItem.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center text-md transition-all duration-300 ${isActive ? 'text-black' : 'text-gray-700'}`}>
              {item.icon}
              <p>{item.name}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
