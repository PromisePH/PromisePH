import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from '../../firebase/firebase';
import { doc, arrayUnion, arrayRemove, updateDoc } from "firebase/firestore";
import CollectionsEnum from '../../constants/collections';

import FallbackImage from '../../assets/img/default.jpg'
import { Image } from '@chakra-ui/react'
import Avatar from '../../components/Avatar';
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { RxDot } from "react-icons/rx";
import { RxDotFilled } from "react-icons/rx";
import { GoKebabHorizontal } from "react-icons/go";

function Post({ post, user }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPoster, setIsPoster] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null || post == null) {
      setIsLiked(false)
      return
    }

    if (user.uid === post.poster.id) {
      setIsPoster(true)
    }

    if (post.upvotes && post.upvotes.includes(user.uid)) {
      setIsLiked(true)
    }
  }, [post]);

  const likePost = async () => {
    if (user == null) {
      navigate('/login');
      return
    }
    const postRef = doc(db, CollectionsEnum.POSTS, post.id)
    if (isLiked) {
      setIsLiked(false);
      await updateDoc(postRef, {
        upvotes: arrayRemove(user.uid)
      });
    } else {
      setIsLiked(true);
      await updateDoc(postRef, {
        upvotes: arrayUnion(user.uid)
      });
    }
  }
  return (
    <section className="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4">
      <div className="flex md:hidden flex-row items-center">
        <a href={window.location.href} target="_blank" rel="noreferrer" className="flex items-center">
          <span className="text-white text-1xs md:text-sm font-bold">{post.poster.name}</span>
          <button
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <RxDotFilled /> : <RxDot />}
          </button>
        </a>
        <span className="text-white text-1xs md:text-sm">1 day ago</span>
      </div>
      <div className="flex flex-row gap-3">
        {/* <!-- Image div--> */}
        <a href={window.location.href} target="_blank" rel="noreferrer" >
          <Image src={post.image} alt={post.title} className='sm:w-36 sm:h-36 w-28 h-28 object-cover rounded-md' fallbackSrc={FallbackImage} />
        </a>
        {/* <!-- Content div--> */}
        <div className="w-4/5">
          {/* <!-- Header div--> */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between">
              <a href="#" target="_blank" rel="noopener" className="text-lg md:text-xl font-bold flex-grow">
                {post.title}
              </a>
              <div className="text-2xl flex flex-col items-center gap-1">
              <button className="hover:bg-gray-700 p-1 rounded-full">
                {
                  isPoster ?
                    <GoKebabHorizontal />
                    : null
                }
              </button>
              <button
                onClick={likePost}
                className="text-orange-red text-2xl transform hover:scale-110"
              >
                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              </div>
            </div>
            <div className="flex flex-row items-center">
              {
                post.verifiedUpvotes ?
                  post.verifiedUpvotes.map((upvote) =>
                    <button key={upvote} className="bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2 mr-1 md:p-3 md:mr-4 transform hover:scale-110">
                      {upvote}
                    </button>
                  )
                  : null
              }
              <div className="list-unstyled text-sm text-gray-500 flex flex-wrap">
                {
                  post.tags ?
                    post.tags.map((tag) =>
                      <button key={tag} className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 mb-2 mr-1 md:mr-2 transform hover:scale-110">
                        <span className="text-white">{tag}</span>
                      </button>
                    )
                    : null
                }
              </div>
              
            </div>
          </div>
          {/* <!-- Footer div--> */}
          <div className="hidden sm:flex flex-row items-center mt-6">
            <a href={window.location.href} target="_blank" rel="noreferrer" className="hidden md:flex flex-row items-center mr-6">
              <div className="min-w-8 h-8 rounded-full mr-2">
                <Avatar name={post.poster.name}  styles='rounded-lg min-w-fit' alt={post.poster.name} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-white text-sm font-bold">{post.poster.name}</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                  >
                    {isActive ? <RxDotFilled /> : <RxDot />}
                  </button>
                </div>
                <span className="text-white text-sm">1 day ago</span>
              </div>
            </a>
            <div className="flex flex-row items-center gap-12">
              <span className="text-white text-xs md:text-sm">{post.views} Views</span>
              <span className="text-white text-xs md:text-sm">{post.upvotes.length} Likes</span>
              <span className="text-white text-xs md:text-sm">{post.comments.length} Comments</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex sm:hidden flex-row items-center pt-3 gap-12">
        <span className="text-white text-xs md:text-sm">{post.views} Views</span>
        <span className="text-white text-xs md:text-sm">{post.upvotes.length} Likes</span>
        <span className="text-white text-xs md:text-sm">{post.comments.length} Comment</span>
      </div>
    </section>
  );
}
export default Post;