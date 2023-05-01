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
    <main>
      {/* {
                user ? <PostForm /> : null
            }
            {
                posts.map(post =>
                    <Post key={post.id} {...post} />
                )
            }
      {
                user ? <button onClick={handleLogout}>Logout</button> : null
                } */}
      <div class="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4 flex flex-col md:flex-row">
        {/* <!-- Image div--> */}
        <a href={window.location.href} target="_blank" class="w-1/5">
          <div>
            <img src={SampleIcon} alt="sample" />
          </div>
        </a>

        {/* <!-- Content div--> */}
        <div class="w-4/5 pl-4 ml-2 md:pl-0">

          {/* <!-- Header div--> */}
          <div class="mb-2">
            <div class="flex flex-row items-center justify-between mb-2">
              <a href="#" class="text-2xl font-bold flex-grow mr-2">
                Duterte vows to end criminality in 3 months
              </a>
              <button
                onClick={() => setIsLiked(!isLiked)}
                class="text-orange-red text-2xl transform hover:scale-110"
              >
                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>

            <div class="flex flex-row">
              <div class="bg-Caribbean-green border-radius-full rounded-full text-black text-xs text-center font-bold inline-block py-2 px-2 mr-4 transform hover:scale-110">
                Verified by ABS-CBN
              </div>
              <ul class="list-unstyled text-sm text-gray-500 flex flex-wrap">
                <li class="bg-midnight border-radius-full rounded-full text-black font-bold text-xs inline-block text-center px-2 py-1 mb-2 mr-2  transform hover:scale-110">
                  <span class="text-white">finance</span>
                </li>
                <li class="bg-midnight border-radius-full rounded-full text-black font-bold text-xs inline-block text-center px-2 py-1 mb-2 mr-2  transform hover:scale-110">
                  <span class="text-white">crime</span>
                </li>
                <li class="bg-midnight border-radius-full rounded-full text-black font-bold text-xs inline-block text-center px-2 py-1 mb-2 mr-2  transform hover:scale-110">
                  <span class="text-white">duterte</span>
                </li>
              </ul>
            </div>
          </div>

          {/* <!-- Footer div--> */}
          <div class="flex flex-row items-center mt-5">
            <div class="flex flex-row items-center mr-6">
              <a href={window.location.href} target="_blank">
                <img src={SampleAvatar} alt="sample" class="w-8 h-8 rounded-full mr-2" />
              </a>

              <div class="flex flex-col">
                <div class="flex items-center">
                  <span class="text-white text-sm font-bold">Pavel Gvay</span>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    class=""
                  >
                    {isActive ? <RxDotFilled /> : <RxDot />}
                  </button>
                </div>
                <span class="text-white text-sm">1 day ago</span>
              </div>
            </div>
            <div class="flex flex-row items-center gap-12">
              <span class="text-white text-sm">651,324 Views</span>
              <span class="text-white text-sm">36,6545 Likes</span>
              <span class="text-white text-sm">56 Comments</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

export default Post;