import React,{useContext} from 'react'
import "../App.css"
import SmallCard from './SmallCard';
import { FaWhatsapp } from "react-icons/fa";
import { PiFacebookLogoBold } from "react-icons/pi";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AppContext } from '../App';

const Home = () => {

  const { allproducts } = useContext(AppContext);

  const offerProducts=allproducts.filter((item)=>item.discountedPrice > 0);

   const bestProducts=allproducts.filter((item)=>item.discountedPrice === 0);

   const latestproducts=allproducts.filter((item)=>item.originalPrice>200 && item.originalPrice<400 && item.discountedPrice===0);

  return (
    <>
      <div className="p-5 md:p-10">
        <section className='image py-5'>
          <div className=" ">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="text-center m-auto">
                <div className="brand text-4xl md:text-5xl">Shop the Collection</div>
                <p className="texts text-lg">Step into a world of style and elegance. <br /> Our collection features dresses for every mood and moment</p>
              </div>
              <img src="mbg.png" className='mx-auto opacity-60' alt="" />
            </div>
          </div>
        </section>
        <section className='offer images my-10'>
          <div className="brand text-4xl md:text-5xl text-center text-3xl">Exclusive Offers on Top Brands</div>
          <div className="texts text-center text-lg mb-2">Shop Now and Save Big!</div>
          <div className="flex justify-center">
            <SmallCard products={offerProducts} classname={"overflow-x-auto flex scrollbar-hide"} />
          </div>
        </section>

        <section className='latest colllection my-10'>
          <div className="">
            <div className="brand text-4xl md:text-5xl text-center">The Latest Collection</div>
            <div className="texts text-center text-lg mb-2">Be the first to explore our newest arrivals!</div>
          </div>
          <div className="">
            <SmallCard products={latestproducts} classname={"overflow-y-auto flex flex-wrap scrollbar-hide justify-center   h-[400px] md:h-[550px]"} />
          </div>
        </section>

        <section className='best sellers my-10'>
          <div className="">
            <div className="brand text-4xl md:text-5xl text-center">Our Best Sellers</div>
            <div className="texts text-center text-lg mb-2">Discover the dresses that our customers can't get enough of!</div>
          </div>
          <div className="flex justify-center">
            <SmallCard products={bestProducts} classname={"overflow-x-auto flex scrollbar-hide "} />
          </div>
        </section>

        <section className="footer">
          <div className="text-center bg-gray-300 py-8 rounded-md">
            <div className="flex flex-wrap justify-center text-gray-800 space-x-6 gap-y-3 font-medium">
              <div>About</div>
              <div>Blog</div>
              <div>License</div>
              <div>Partners</div>
              <div>Terms of service</div>
              <div>Privacy policy</div>
            </div>
            <div className="flex flex-wrap justify-center space-x-6 text-gray-700 font-medium text-2xl py-5">
              <FaWhatsapp />
              <PiFacebookLogoBold />
              <FaInstagram />
              <FaXTwitter />
            </div>
            <p className="text-gray-500 text-center pb-2">© 2025 Your Company, Inc. All rights reserved.</p>
          </div>
        </section>

      </div>
    </>
  )
}

export default Home
