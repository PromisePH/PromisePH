import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { RxDot } from "react-icons/rx";
import { RxDotFilled } from "react-icons/rx";
import { db, auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, increment } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../../components/Comment";
import NavBar from "../../components/NavBar";
import { Skeleton } from '@chakra-ui/react'
function Promise() {
    const [user] = useAuthState(auth);
    const [data, setPromiseData] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const navigate = useNavigate();

    function updateView() {
        const postRef = doc(db, "posts", params.promiseID);
        const update = async () => await updateDoc(postRef, { views: increment(1) });
        update();
    }
    // const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    // const yearDiff = d2.getFullYear() - d1.getFullYear();
    // const monthDiff = d2.getMonth() - d1.getMonth();
    // const totalMonthDiff = yearDiff * 12 + monthDiff;'
    const params = useParams();
    useEffect(() => {
        setIsLoading(true);
        updateView();
        const postRef = doc(db, "posts", params.promiseID);
        const comRef = collection(db, "comment");
        onSnapshot(postRef, (doc) => {
            const temp = doc.data();
            setPromiseData({ id: doc.id, ...temp });
            setIsActive(user ? temp.upvotes.includes(user.uid) ? true : false : false);
            setViewCount(temp.views);
            setLikeCount(temp.upvotes ? temp.upvotes.length : 0);
        });
        onSnapshot(comRef, (doc) => {
            setCommentCount(
                doc.docs.map(doc => { return doc.data() })
                    .filter((q) => q.postId.includes(params.promiseID))
                    .length
            )
            setIsLoading(false);
        })
        //     const comRef = collection(db, "comment");
        //     const docSnap = await getDoc(docRef);
        //     const commentsSnap = await getDocs(comRef);
        //     setPromiseData({
        //         id: docSnap.id,
        //         ...docSnap.data(),
        //         comments: [commentsSnap.docs.map(doc => ({
        //             id: doc.id,
        //             ...doc.data()
        //         }
        //         )
        //         )
        //             .filter((e) => {
        //                 return e.postId.includes(params.promiseID);
        //             }).length]
        //     });
        //     if (user) {
        //         setIsLiked(docSnap.data().upvotes.includes(user.uid) ? true : false);
        //     }
        //     else {
        //         setIsActive(false);
        //     }
        //     setLikeCount(() => {
        //         const temp = docSnap.data();
        //         const vote = { upvotes: temp.upvotes };
        //         return vote.upvotes ? vote.upvotes.length : 0;
        //     })
        // }
        // fetchData();
    }, [user, params.promiseID]);
    function updatePostLike(liked) {
        setIsActive(!isActive);
        if (liked) {
            const postRef = doc(db, "posts", params.promiseID);
            const update = async () => await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
            update();
        } else {
            const postRef = doc(db, "posts", params.promiseID);
            const update = async () => await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
            update();
        }
    }
    function handleLike() {
        if (user) {
            updatePostLike(!isActive);
        } else {
            navigate("/login");
        }

    }
    return <><NavBar /> {isLoading ?
        <>
            <div className="flex pt-20 justify-center md:w-full">
                <div className="p-4 flex flex-col bg-bunker items-center w-full md:w-4/12">
                    <div className="flex flex-row w-full mb-10">
                        <Skeleton height='130px' width='160px' className="rounded-md" />
                        <div className="flex flex-col w-full px-4">
                            <Skeleton height='30px' width='100%' className="rounded-md my-5" />
                            <Skeleton height='30px' width='100%' className="rounded-md" />
                        </div>
                    </div>
                    <div className="w-full flex justify-end"><Skeleton height='17px' width='85%' className="rounded-md my-5" /></div>
                    <Skeleton height='17px' width='100%' className="rounded-md" />
                    <Skeleton height='17px' width='100%' className="rounded-md my-5" />
                    <Skeleton height='17px' width='100%' className="rounded-md" />
                    <div className="w-full flex justify-start"><Skeleton height='17px' width='70%' className="rounded-md my-5" /></div>
                    <div className="w-full flex flex-row justify-evenly mt-10 mb-5">
                        <Skeleton height='17px' width='10%' className="rounded-md" />
                        <Skeleton height='17px' width='10%' className="rounded-md" />
                        <Skeleton height='17px' width='10%' className="rounded-md" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-full mt-10">
                <div className="p-4 flex flex-col bg-bunker items-center w-full md:w-4/12">
                    <div className="w-full flex flex-col items-center my-5">
                        <Skeleton height='20px' width='95%' className="rounded-md" />
                        <Skeleton height='20px' width='95%' className="rounded-md my-10" />
                        <Skeleton height='20px' width='95%' className="rounded-md" />
                    </div>
                </div>
            </div>
        </>

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
                        </div>
                        <div className="flex flex-row">
                            <div className="w-28 h-28 box-border">
                                <img src={data.image} className="w-28 h-28 object-cover rounded-lg" />
                            </div>
                            <div className="w-5/6 h-28 box-content   box-border">
                                <div className="flex flex-col p-2 h-max min-w-0 max-w-max">
                                    <div className="md:text-2xl font-bold w-full max-w-full h-16 overflow-hidden overflow-ellipsis">
                                        {data.title}
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
                            <span className="text-white text-xs md:text-sm">{viewCount} Views</span>
                            <span className="text-white text-xs md:text-sm">{likeCount} Likes</span>
                            <span className="text-white text-xs md:text-sm">{commentCount} Comments</span>
                            <span className="text-white text-xs md:text-sm underline cursor-pointer">View Sources</span>
                            <button
                                onClick={() => handleLike()}
                                // setIsLiked(!isLiked)
                                className="text-orange-red text-2xl transform hover:scale-110"
                            >
                                {isActive ? <AiFillHeart /> : <AiOutlineHeart />}
                            </button>
                        </div>
                    </div>
                </main>
                <Comment id={params.promiseID} />
            </>
        )
    }
    </>

}
export default Promise;