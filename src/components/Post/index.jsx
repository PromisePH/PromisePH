import React, { useState } from "react";
import draftToHtml from "draftjs-to-html";
import SampleIcon from "../../assets/img/Sample_Icon.png";
import SampleAvatar from "../../assets/img/Sample_Avtr.png";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { RxDot } from "react-icons/rx";
import { RxDotFilled } from "react-icons/rx";

function Post(post) {
  const createMarkup = (raw) => {
    return { __html: draftToHtml(raw) };
  };
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4">
      <div className="flex md:hidden flex-row items-center">
        <a href={window.location.href} target="_blank" rel="noopener" className="flex items-center">
          <span className="text-white text-1xs md:text-sm font-bold">Pavel Gvay</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className=""
          >
            {isActive ? <RxDotFilled /> : <RxDot />}
          </button>
        </a>
        <span className="text-white text-1xs md:text-sm">1 day ago</span>
      </div>
      <div className="flex flex-row">
        {/* <!-- Image div--> */}
        <div className="flex flex-col justify-between w-1/5">
          <a href={window.location.href} target="_blank" rel="noopener" className="w-full">
            <img src={SampleIcon} alt="sample" />
          </a>
        </div>
        {/* <!-- Content div--> */}
        <div className="w-4/5 ml-1">

          {/* <!-- Header div--> */}
          <div className="">
            <div className="flex flex-row items-center justify-between">
              <a href="#" target="_blank" rel="noopener" className="text-lg md:text-2xl font-bold flex-grow">
                Duterte vows to end criminality in 3 months
              </a>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="text-orange-red text-2xl transform hover:scale-110"
              >
                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>

            <div className="flex flex-row mt-1 items-center">
              <div className="bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2 mr-1 md:p-3 md:mr-4 transform hover:scale-110">
                ABS-CBN
              </div>
              <ul className="list-unstyled text-sm text-gray-500 flex flex-wrap">
                <li className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 mb-2 mr-1 md:mr-2 transform hover:scale-110">
                  <span className="text-white">finance</span>
                </li>
                <li className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 mb-2 mr-1 md:mr-2 transform hover:scale-110">
                  <span className="text-white">crime</span>
                </li>
                <li className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 mb-2 mr-1 md:mr-2 transform hover:scale-110">
                  <span className="text-white">duterte</span>
                </li>
              </ul>
            </div>
          </div>

          {/* <!-- Footer div--> */}
          <div className="hidden md:flex flex-row items-center mt-6">
            <a href={window.location.href} target="_blank" rel="noopener" className="hidden md:flex flex-row items-center mr-6">

              <img src={SampleAvatar} alt="sample" className="w-8 h-8 rounded-full mr-2" />


              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-white text-sm font-bold">Pavel Gvay</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className=""
                  >
                    {isActive ? <RxDotFilled /> : <RxDot />}
                  </button>
                </div>
                <span className="text-white text-sm">1 day ago</span>
              </div>
            </a>
            <div className="flex flex-row items-center gap-12">
              <span className="text-white text-xs md:text-sm">651,324 Views</span>
              <span className="text-white text-xs md:text-sm">36,6545 Likes</span>
              <span className="text-white text-xs md:text-sm">56 Comments</span>
            </div>
          </div>

        </div>
      </div>
      <div className="flex md:hidden flex-row items-center pt-3 gap-12">
        <span className="text-white text-xs md:text-sm">651,324 Views</span>
        <span className="text-white text-xs md:text-sm">36,6545 Likes</span>
        <span className="text-white text-xs md:text-sm">56 Comments</span>
      </div>
    </section>
  );
}

export default Post;