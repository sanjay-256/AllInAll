import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { IoIosSend } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import '../App.css'
import { AppContext } from '../App';

const Comment = ({ id }) => {

    const { BASE_URL } = useContext(AppContext);
    const [reviews, setReviews] = useState("");
    const [comment, setComment] = useState([]);
    useEffect(() => {
        const review = async () => {
            const response = await axios.get(`${BASE_URL}/review/getreview/${id}`);
            setComment(response.data);
        }
        review();
    }, [id,])

    const sendReview = async () => {
        const email = localStorage.getItem("useremail");
        const user = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
        const userid = user.data;
        const payload = {
            comment: reviews,
            date: new Date().toISOString()
        }
        await axios.post(`${BASE_URL}/review/addreview/${userid}/${id}`, payload);
        const response = await axios.get(`${BASE_URL}/review/getreview/${id}`);
        setComment(response.data);
        setReviews("");
    }

    const deleteReview = async (rid) => {
        try {
            await axios.delete(`${BASE_URL}/review/delreview/${rid}`);
            setComment((prev) => prev.filter((comment) => comment.id !== rid));
        } catch (error) {
            console.error("Error while deleting:", error);
        }
    };
    


    return (
        <div>
            <div className="flex items-center"><BiSolidCommentDetail className='text-[#8A2BE2] text-xl' /><h3 className='font-medium texts pl-2 text-xl'>comments</h3></div>
            <div className="p-2 relative">
                <textarea type="text" name="comment" value={reviews} onChange={(e) => { setReviews(e.target.value) }} className='p-2 texts w-full bg-blue-50 border-blue-300 focus:outline-none border border-0 border-b-2' placeholder='comment...' ></textarea>
                <IoIosSend className='absolute right-5 top-11 cursor-pointer text-2xl' onClick={() => { sendReview() }} />
            </div>
            <div className={`p-1 m-2 rounded overflow-y-auto h-[340px] ${comment.length > 0 ? "bg-white" : "h-fit"}`}>
                {comment.length > 0 ?
                    (comment.map((item, index) => (
                        <div className="p-2 border-b-2 hover:bg-gray-400 rounded hover:text-white" key={index}>
                            <div className="flex justify-between gap-2">
                                <div className="content">
                                    <div className="flex items-center gap-1 pb-1"> <p className="name text-sm font-medium">~ {item.username}</p> <span className="font-normal texts text-xs">{item.date}</span> </div>
                                    <div className="text-sm pl-4">{item.comment}</div>
                                </div>
                                <div className="options flex flex-col justify-between">
                                <MdOutlineEdit className='text-xl text-[#8A2BE2] cursor-pointer'  />
                                <MdDeleteOutline className='text-xl text-red-300 cursor-pointer' onClick={()=>{deleteReview(item.id)}} />
                                </div>
                            </div>
                        </div>
                    ))) : (
                        <>
                            <p className="font-medium text-center texts">no comments!</p>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Comment
