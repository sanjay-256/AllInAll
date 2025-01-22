import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App';
import Star from './Star';
import axios from 'axios';
import Comment from './Comment';

const Displaycard = () => {
    const { allproducts, toggleLike, setCartCount} = useContext(AppContext);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState(null);
    const [incart, setIncart] = useState(false);
    const [sizes, setSizes] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [quans, setQuans] = useState(1);

    useEffect(() => {
        const foundProduct = allproducts.find((product) => product.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setImage(foundProduct.imageUrl);
        }
    }, [id, allproducts]);

    const fetchCartCount = async () => {
        try {
            const email = localStorage.getItem("useremail");
            if (!email) {
                console.error("User email not found in localStorage.");
                return;
            }

            const userResponse = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
            const userId = userResponse.data;

            const response = await axios.get(`http://localhost:8080/cart/count/${userId}`);
            setCartCount(response.data);
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    };

    useEffect(() => {
        const fetchCartStatus = async () => {
            try {
                const email = localStorage.getItem("useremail");
                if (!email) {
                    console.error("User email not found in localStorage.");
                    return;
                }

                const userResponse = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
                const userId = userResponse.data;

                const response = await axios.get(`http://localhost:8080/cart/incart/${userId}/${id}`);
                setIncart(response.data);
            } catch (error) {
                console.error("Error fetching cart status:", error);
            }
        };

        fetchCartStatus();

        const fetchSize = async () => {
            try {
                const email = localStorage.getItem("useremail");
                if (!email) {
                    console.error("User email not found in localStorage.");
                    return;
                }

                const userResponse = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
                const userId = userResponse.data;

                const response = await axios.get(`http://localhost:8080/cart/size/${userId}/${id}`);
                const quan = await axios.get(`http://localhost:8080/cart/quantity/${userId}/${id}`);
                setSizes(response.data);
                setQuans(quan.data);
            } catch (error) {
                console.error("Error fetching cart status:", error);
            }
        }
        fetchSize();

    }, [id, quans]);


    const addToCart = async (product) => {
        if (!size) {
            alert('Please select a size.');
            return;
        }
        try {
            const email = localStorage.getItem('useremail');
            if (!email) {
                console.error("User email not found in localStorage.");
                return;
            }

            const userResponse = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
            const userId = userResponse.data;

            await axios.post(`http://localhost:8080/cart/addcart/${userId}/${product.id}/${size}/${quantity}`);
            setIncart(true);
            setSizes(size);
            setQuans(quantity);
            fetchCartCount();
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async (product) => {
        try {
            const email = localStorage.getItem('useremail');
            if (!email) {
                console.error("User email not found in localStorage.");
                return;
            }

            const userResponse = await axios.get(`http://localhost:8080/user/getuserid/${email}`);
            const userId = userResponse.data;

            await axios.delete(`http://localhost:8080/cart/delcart/${userId}/${product.id}`);
            setIncart(false);
            setSizes(null);
            setQuans(1);
            fetchCartCount();
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
        if (originalPrice && discountedPrice) {
            const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    return (
        <div className="bg-gray-50 py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row gap-7">
                    {/* Product Images */}
                    <div className="flex-1 flex flex-col-reverse sm:flex-row gap-4">
                        <div className="flex h-[80%] sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-evenly sm:w-[25%] w-full md:pr-3">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-20 sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg border shadow-sm hover:opacity-80 transition-all"
                                onClick={() => setImage(product.imageUrl)}
                            />
                        </div>
                        <div className="w-full sm:w-[500px]">
                            <img
                                src={image}
                                alt={product.title}
                                className="w-full h-[500px] rounded-xl shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="">
                            <h1 className="font-bold text-3xl text-gray-800 mt-2">{product.title}</h1>
                        
                        <div className="flex items-center gap-1 mt-2">
                            <Star rating={product.rating || 0} />
                            <p className="pl-2 text-sm text-gray-500">
                                ({product.rating ? '122' : 'No reviews'})
                            </p>
                        </div>
                        <p className="font-medium mt-5 text-2xl inline-block">
                            {product.discountedPrice ? (
                                <>
                                    <span className="mr-2 text-slate-400 line-through">₹{product.originalPrice}</span>
                                    ₹{product.discountedPrice}
                                </>
                            ) : (
                                <>₹{product.originalPrice}</>
                            )}
                        </p>
                        <span className="ml-3 text-[#E23378] font-semibold text-lg texts">
                            {product.discountedPrice > 0 && product.originalPrice && (
                                <span className=''>( {calculateDiscountPercentage(product.originalPrice, product.discountedPrice)}% OFF )</span>
                            )}
                        </span>
                        <p className="mt-5 text-gray-600">{product.description}</p>

                        {/* Select Size */}
                        {incart ? (
                            <div className="mt-8">
                                <p className="font-semibold text-gray-800">Selected Size</p>
                                <div className="flex gap-4">
                                    <span className="border py-2 px-4 text-sm font-medium rounded-md border-black bg-gray-200">
                                        {sizes}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            product.sizes && JSON.parse(product.sizes).length > 0 && (
                                <div className="flex flex-col gap-4 mt-8">
                                    <p className="font-semibold text-gray-800">Select Size</p>
                                    <div className="flex gap-4">
                                        {JSON.parse(product.sizes).map((sizeOption, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSize(sizeOption)}
                                                className={`border py-2 px-4 text-sm font-medium rounded-md ${size === sizeOption
                                                    ? 'border-black bg-gray-200'
                                                    : 'border-gray-300 bg-white'
                                                    }`}
                                            >
                                                {sizeOption}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        <div className="">
                            {incart ?
                                <>
                                    <div className="text-xl my-3">
                                        <span className="text-lg">Quantity : </span>{quans}
                                    </div>
                                </> :
                                <>
                                    <p className="font-semibold text-gray-800 mt-3">Select Quantity</p>
                                    <div className="flex gap-4 items-center font-medium my-3">
                                        <div className="text-3xl border border-2 rounded border-gray-300 cursor-pointer pb-2 px-3" onClick={() => { setQuantity(quantity > 1 ? quantity - 1 : quantity) }}>-</div><div className="text-xl">{quantity}</div><div className="text-3xl border border-2 rounded border-gray-300 cursor-pointer pb-2 px-2" onClick={() => { setQuantity(quantity + 1) }}>+</div>
                                    </div>
                                </>
                            }
                        </div>

                        <div className="flex gap-4 mt-6">
                            {incart ? (
                                <button
                                    onClick={() => remove(product)}
                                    className="flex items-center justify-center gap-2 w-48 text-white px-8 py-3 rounded-md transition-all bg-red-500 hover:bg-red-600"
                                >
                                    Remove from cart
                                </button>
                            ) : (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="flex items-center justify-center gap-2 w-48 text-white px-8 py-3 rounded-md transition-all bg-green-500 hover:bg-green-600"
                                >
                                    Add to Cart
                                </button>
                            )}
                            <button
                                onClick={() => toggleLike(product.id)}
                                className={`flex items-center justify-center gap-2 w-48 text-black px-8 py-3 rounded-md transition-all ${product.isLiked
                                    ? 'bg-[#E23378] hover:bg-pink-500'
                                    : 'bg-[#64748b] hover:bg-gray-100 border-black'
                                    }`}
                            >
                                {product.isLiked ? 'In Wishlist' : 'Wishlist'}
                            </button>
                        </div>
                            </div>
                            <div className=" p-1 rounded">
                                <Comment  id={id} />
                            </div>
                        </div>

                        <hr className="mt-8 sm:w-4/5" />
                        <div className="text-sm text-gray-500 mt-5 flex flex-col gap-2 pb-8 md:pb-0">
                            <p>100% Original product.</p>
                            <p>Cash on delivery is available on this product.</p>
                            <p>Easy return and exchange policy within 7 days.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Displaycard;
