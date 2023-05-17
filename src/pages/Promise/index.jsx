import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { RxDot } from "react-icons/rx";
import { RxDotFilled } from "react-icons/rx";
import { db,auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comment";
function Promise() {
    const [user] = useAuthState(auth);
    const [data, setPromiseData] = useState('empty');
    const [isLiked, setIsLiked] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [likeCount,setLikeCount] = useState(0);
    const navigate = useNavigate();
    // const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    // const yearDiff = d2.getFullYear() - d1.getFullYear();
    // const monthDiff = d2.getMonth() - d1.getMonth();
    // const totalMonthDiff = yearDiff * 12 + monthDiff;'
    const params = useParams();
    useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "posts", params.promiseID);
            const comRef = collection(db, "comment");
            const docSnap = await getDoc(docRef);
            const commentsSnap = await getDocs(comRef);
            setPromiseData({
                id: docSnap.id,
                ...docSnap.data(),
                comments:[commentsSnap.docs.map(doc =>({
                    id : doc.id,
                    ...doc.data()}))
                    .filter((e)=>{
                    return e.postId.includes(params.promiseID); 
                }).length]
            });
            if (user) {
                setIsLiked(docSnap.data().upvotes.includes(user.uid) ? true : false);
            }
            else {
                setIsActive(false);
            }
            setLikeCount(()=>{
                const temp = docSnap.data();
                const vote = { upvotes: temp.upvotes };
                return vote.upvotes ? vote.upvotes.length : 0;
            })
        }
        fetchData();
    }, [params.promiseID,data.comments,user]);
    function updatePostLike(liked){
        if(liked){
        const postRef = doc(db, "posts", params.promiseID);
        const update = async () => await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
        update();
        }else{
            const postRef = doc(db, "posts", params.promiseID);
            const update = async () => await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
            update();
        }
    }
    function handleLike(){
        if(user){
            updatePostLike(!isLiked);
            setIsLiked(!isLiked);
        }else{
            navigate("/login");
        }
        
    }
    return data === 'empty' ? (
        <>
            <div className="py-16 md:pb-0">Loading...</div>
        </>
    )
        :
        (
            <>
                <main className="py-16 md:pb-0">
                    <div className="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4 mt-5">
                        <div className="flex md:hidden flex-row items-center">
                            <a target="_blank" rel="noopener" className="flex items-center">
                                <span className="text-white text-1xs md:text-sm font-bold">{data.poster.name}</span>
                                <button
                                    onClick={() => handleLike()}
                                    className=""
                                >
                                    {isActive ? <RxDotFilled /> : <RxDot />}
                                </button>
                            </a>
                            <span className="text-white text-1xs md:text-sm">
                                {/* {diffDays <= 31 ? diffDays + " Day/s ago"
                      : yearDiff > 0 ? yearDiff + " Year/s ago"
                      : totalMonthDiff <= 12 && totalMonthDiff != 0 ? totalMonthDiff + " Month/s ago"
                      : diffDays + " Day/s ago"
                    } */}
                                0</span>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-28 h-28 box-border">
                                <img src={data.image} className="w-28 h-28 object-cover rounded-lg" />
                            </div>
                            <div className="w-5/6 h-28 box-content   box-border">
                                <div className="flex flex-col p-2 h-max min-w-0 max-w-max">
                                    <div className="md:text-2xl font-bold w-full max-w-full h-16 overflow-hidden overflow-ellipsis">
                                        lorak kasdj fsdof joweifjklasd oisadlfj lasdkjf oas f f f df fd dafs df fds aisdfj asjf lkajsdlkfj alksdjflk jasldk jfdkf oa sofj lkasdf ia oisjdf
                                        {/* {data.title} */}
                                    </div>
                                    <div className="flex flex-row h-12 max-h-10 items-center space-x-2">
                                        <div className="">
                                            {data.verifiedUpvotes.map((verifiedBy) => {
                                                return <div className="bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2  transform hover:scale-110" key={verifiedBy}>
                                                    {verifiedBy}
                                                </div>
                                            })}
                                        </div>
                                        <div className="">
                                            {data.tags.map((tag) => {
                                                return <li className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 transform hover:scale-110" key={tag}>
                                                    <span className="text-white">{tag}</span>
                                                </li>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Description Div */}
                        <div className="mt-5 text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis augue lobortis, condimentum enim a, feugiat lorem. Donec sapien lacus, egestas at enim et, semper malesuada sapien. Suspendisse dignissim, nisl at dapibus auctor, lorem felis mattis augue, sed tincidunt justo dolor vitae odio. Maecenas varius mi turpis, sit amet ornare odio consequat nec. Proin sagittis ligula at aliquet posuere. Quisque ut metus in mi tincidunt eleifend. Duis vitae leo at orci interdum feugiat tincidunt ut orci.

                            Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent facilisis ante sit amet diam fringilla, tempus commodo ligula posuere. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer suscipit interdum consectetur. Donec quis velit vulputate, vehicula neque a, venenatis nunc. Suspendisse nisi sem, tempor et scelerisque sed, ullamcorper et diam. Nullam dapibus lorem ut diam tempus porta. Suspendisse at est nec arcu fermentum iaculis sed eu massa. Proin blandit in diam eget pulvinar. Nulla sed metus posuere, tristique neque ac, tincidunt nisi. Duis rhoncus efficitur urna pellentesque volutpat.
                        </div>

                        <div className="flex flex-wrap flex-row justify-evenly items-center pt-3 gap-12">
                            <span className="text-white text-xs md:text-sm">{data.views} Views</span>
                            <span className="text-white text-xs md:text-sm">{likeCount} Likes</span>
                            <span className="text-white text-xs md:text-sm">{data.comments} Comments</span>
                            <span className="text-white text-xs md:text-sm underline cursor-pointer">View Sources</span>
                            <button
                                onClick={() => handleLike()}
                                // setIsLiked(!isLiked)
                                className="text-orange-red text-2xl transform hover:scale-110"
                            >
                                {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                            </button>
                        </div>
                    </div>
                </main>
                <Comment id={params.promiseID}/>
            </>
        )
    //     [["1st Comment", 
    //     [
    //      ["1st Comment N1", 
    //         ["1st Comment N11",[]]],
    //      ["2nd Comment N1",
    //         ["2nd Comment N11",[]]]
    //     ]
    //  ], 
    //  ["2nd Comment",
    //     [
    //      ["2nd Comment N1",
    //         ["2nd Comment N11",[]]]
    //     ],
    //  ["3rd Comment",[]]]
    // ]
    // {"1st Comment Reply.1": [
    //     {"1st Comment Reply.1.1": []},
    //     {"1st Comment Reply.1.2": []},
    //     {"1st Comment Reply.1.3": []}
    // ]},
    // {"1st Comment Reply.2": [
    //     {"1st Comment Reply.2.1": [
    //         {"1st Comment Reply.2.1.1" :[]},
    //         {"1st Comment Reply.2.1.2" :[]}
    //     ]},
    //     {"1st Comment Reply.2.2": []},
    //     {"1st Comment Reply.2.3": []}
    // ]
    // }    




    // [
    //     {
    //         "details": "1st Comment",
    //         "commentId": "123",
    //         "commentorId": "1234",
    //         "createdAt": new Date(),
    //         "upvotes": [],
    //         "postId": "1",
    //         "replies": [
    //             {
    //                 "details": "1st Comment Reply.1",
    //                 "commentId": "123",
    //                 "commentorId": "1234",
    //                 "createdAt": new Date(),
    //                 "upvotes": [],
    //                 "postId": "1",
    //                 "replies": [
    //                     {
    //                         "details": "1st Comment Reply.1.1",
    //                         "commentId": "123",
    //                         "commentorId": "1234",
    //                         "createdAt": new Date(),
    //                         "upvotes": [],
    //                         "postId": "1",
    //                         "replies": []
    //                     },
    //                     {
    //                         "details": "1st Comment Reply.1.2",
    //                         "commentId": "123",
    //                         "commentorId": "1234",
    //                         "createdAt": new Date(),
    //                         "upvotes": [],
    //                         "postId": "1",
    //                         "replies": []
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ]

}
export default Promise;