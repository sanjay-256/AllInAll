import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { IoIosSend } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import '../App.css'
import { AppContext } from '../App';

const Comment = ({ id }) => {
    
  const {BASE_URL} = useContext(AppContext);
        const [reviews,setReviews]=useState("");
        const [comment,setComment]=useState([]);
    useEffect(() => {
        const review = async () => {
            const response = await axios.get(`${BASE_URL}/review/getreview/${id}`);
            setComment(response.data);
        }
        review();
    }, [id])

    const sendReview=async()=>{
        const email = localStorage.getItem("useremail");
        const user = await axios.get(`${BASE_URL}/user/getuserid/${email}`);
        const userid = user.data;
        const payload={
            comment:reviews,
            date: new Date().toISOString()
        }
        await axios.post(`${BASE_URL}/review/addreview/${userid}/${id}`,payload);
        const response = await axios.get(`${BASE_URL}/review/getreview/${id}`);
        setComment(response.data);
        setReviews("");
    }


    return (
        <div>
            <div className="flex items-center"><BiSolidCommentDetail className='text-blue-300 text-xl'/><h3 className='font-medium texts pl-2 text-xl'>comments</h3></div>
            <div className="p-2 relative">
                <textarea type="text" name="comment" value={reviews}  onChange={(e)=>{setReviews(e.target.value)}} className='p-2 texts w-full bg-blue-50 border-blue-300 focus:outline-none border border-0 border-b-2' placeholder='comment...' ></textarea>
                <IoIosSend className='absolute right-5 top-11 cursor-pointer text-2xl' onClick={()=>{sendReview()}}/>
            </div>
            <div className={`p-1 m-2 rounded overflow-y-auto h-[340px] scrollbar-hide ${comment.length>0?"bg-white":"h-fit"}`}>
                {comment.length>0?
                (comment.map((item,index)=>(
                    <div className="p-2 border-b-2 hover:bg-gray-400 rounded hover:text-white" key={index}>
                   <div className="flex items-center gap-1 pb-1"> <p className="name text-sm font-medium">~ {item.username}</p> <span className="font-normal texts text-xs">{item.date}</span> </div>
                    <div className="text-sm pl-4">{item.comment}</div>
                </div>
                ))):(
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
