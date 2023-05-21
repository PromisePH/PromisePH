import React, { useState } from "react";
import SampleAvatar from "../../assets/img/Sample_Avtr.png";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { RxDot } from "react-icons/rx";
import { RxDotFilled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
function IndivPost(data) {
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const d1 = data.info.createdAt.toDate();
  const d2 = new Date();
  const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const yearDiff = d2.getFullYear() - d1.getFullYear();
  const monthDiff = d2.getMonth() - d1.getMonth();
  const totalMonthDiff = yearDiff * 12 + monthDiff;
  const navigate = useNavigate();
  return (
    <section className="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4 mt-5">
      <div className="flex md:hidden flex-row items-center">
        <a href={window.location.href} target="_blank" rel="noreferrer" className="flex items-center">
          <span className="text-white text-1xs md:text-sm font-bold">{data.info.poster.name}</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className=""
          >
            {isActive ? <RxDotFilled /> : <RxDot />}
          </button>
        </a>
        <span className="text-white text-1xs md:text-sm">
          {diffDays <= 31 ? diffDays + " Day/s ago"
            : yearDiff > 0 ? yearDiff + " Year/s ago"
              : totalMonthDiff <= 12 && totalMonthDiff != 0 ? totalMonthDiff + " Month/s ago"
                : diffDays + " Day/s ago"
          }</span>
      </div>
      <div className="flex flex-row">
        {/* <!-- Image div--> */}
        <div className="flex flex-col justify-between w-1/5">
          <a href={data.info.image} target="_blank" rel="noreferrer" className="w-full">
            <div className="rounded-md">
              <img src={data.info.image} className="w-36 min-w-36 max-w-36 h-36 min-h-36 max-h-36 rounded-xl object-cover" alt="sample" />
            </div>
          </a>
        </div>
        {/* <!-- Content div--> */}
        <div className="w-4/5 ml-1">

          {/* <!-- Header div--> */}
          <div className="">
            <div className="flex flex-row items-center justify-between cursor-pointer"
              onMouseDown={() => navigate(`/promise/${data.info.id}`)}>
              <div className="text-lg md:text-2xl font-bold flex-grow">
                {data.info.title}
              </div>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="text-orange-red text-2xl transform hover:scale-110"
              >
                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>

            <div className="flex flex-row mt-1 items-center">
              {data.info.verifiedUpvotes.map((verifiedBy) => {
                return <div key={verifiedBy} className="bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2 mr-1 md:p-3 md:mr-4 transform hover:scale-110">
                  {verifiedBy}
                </div>
              })}

              <ul className="list-unstyled text-sm text-gray-500 flex flex-wrap">
                {data.info.tags.map((tag) => {
                  return <li key={tag} className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 mb-2 mr-1 md:mr-2 transform hover:scale-110">
                    <span className="text-white">{tag}</span>
                  </li>
                })}
              </ul>
            </div>
          </div>

          {/* <!-- Footer div--> */}
          <div className="hidden md:flex flex-row items-center mt-6">
            <a href={window.location.href} target="_blank" rel="noreferrer" className="hidden md:flex flex-row items-center mr-6">

              <img src={SampleAvatar} alt="sample" className="w-8 h-8 rounded-full mr-2" />


              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-white text-sm font-bold">{data.info.poster.name}</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className=""
                  >
                    {isActive ? <RxDotFilled /> : <RxDot />}
                  </button>
                </div>
                <span className="text-white text-sm">
                  {diffDays <= 31 ? diffDays + " Day/s ago"
                    : yearDiff > 0 ? yearDiff + " Year/s ago"
                      : totalMonthDiff <= 12 && totalMonthDiff != 0 ? totalMonthDiff + " Month/s ago"
                        : diffDays + "Day/s ago"
                  }</span>
              </div>
            </a>
            <div className="flex flex-row items-center gap-12">
              <span className="text-white text-xs md:text-sm">{data.info.views} Views</span>
              <span className="text-white text-xs md:text-sm">{data.info.verifiedUpvotes.length} Like/s</span>
              <span className="text-white text-xs md:text-sm">{data.info.comments.length} Comments</span>
            </div>
          </div>

        </div>
      </div>
      <div className="flex md:hidden flex-row items-center pt-3 gap-12">
        <span className="text-white text-xs md:text-sm">{data.info.views} Views</span>
        <span className="text-white text-xs md:text-sm">{data.info.verifiedUpvotes.length} Likes</span>
        <span className="text-white text-xs md:text-sm">{data.info.comments.length} Comments</span>
      </div>
    </section>
  );
}
export default IndivPost;