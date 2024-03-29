import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHeartCircleBolt, faThumbsUp, faHeart, faComment, faList, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { get } from '../store/postReducer';
import { formatDistanceToNow } from 'date-fns';
import { like, unlike } from '../store/postReducer';
import { endPoint } from '../store/api';

export default function Post() {
    const dispatch = useDispatch();
    const { post } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.user);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${endPoint}/posts`);
            dispatch(get(res.data));
        };
        fetchData();
    }, []);

    // Move the useState hook outside of the map function
    console.log(likedPosts)
    const likeButton = async (e, id) => {
        e.preventDefault();
        const isLiked = likedPosts.includes(id);
        if (!isLiked) {
            // Like the post
            const res = await axios.put(`${endPoint}/posts/${id}/like`);
            dispatch(like(res.data));
            setLikedPosts([...likedPosts, id]); // Add the liked post to the list
        } else {
            // Unlike the post
            const res = await axios.put(`${endPoint}/posts/${id}/unlike`);
            dispatch(unlike(res.data));
            setLikedPosts(likedPosts.filter((postId) => postId !== id)); // Remove the unliked post from the list
        }
    };

    return (
        <>
            {post &&
                post.map((item) => {
                    const { likes, comments } = item;
                    const isLiked = likedPosts.includes(item._id);
                    const likeCount = Object.keys(likes).length;
                    const commentCount = Object.keys(comments).length;

                    return (
                        <div className="shadow-md rounded-md bg-white flex gap-2 p-6 flex-col relative" key={item._id}>
                            <FontAwesomeIcon icon={faEllipsis} className='absolute top-7 right-8 text-xl text-zinc-700' />
                            <div className="flex gap-4">
                                <img src={item.postedBy?.picturePath?.url} alt="" className="w-12 h-12 object-cover rounded-o shadow-md" />

                                <div className="flex flex-col">
                                    <h1 className="text-xl text-zinc-900">
                                        {item.postedBy.firstName} {item.postedBy.lastName}
                                    </h1>
                                    <p className="text-sm text-zinc-700">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</p>
                                </div>
                            </div>
                            <p className="text-md text-zinc-700">{item.title}</p>
                            {item.picturePath && <img src={item.picturePath?.url} className="w-full object-fill rounded-md" />}
                            <div className='border'></div>
                            <div className="text-lg flex flex-row gap-5">
                                <div className="flex flex-row items-center text-zinc-400 gap-2">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className={isLiked ? 'text-pink-500 cursor-pointer' : 'cursor-pointer'}
                                        onClick={(e) => {
                                            likeButton(e, item._id);
                                        }}
                                    />
                                    <p>{likeCount}</p>
                                </div>
                                {/* <div className="flex flex-row items-center text-zinc-400 gap-2">
                                    <FontAwesomeIcon
                                        icon={faComment}
                                        className='cursor-pointer'
                                    />
                                    <p>{commentCount}</p>
                                </div> */}
                            </div>
                        </div>
                    );
                })}
        </>
    );
}
