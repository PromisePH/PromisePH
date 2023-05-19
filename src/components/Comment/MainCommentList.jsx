import React, { useEffect, useState } from "react";
import { doc, addDoc, updateDoc, arrayUnion, collection, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { IconContext } from "react-icons";

function MainCommentList(com) {
    const [user] = useAuthState(auth);
    const [commentData, setCommentData] = useState([]);
    const [replyValue, setReplyValue] = useState([]);
    const [activeReply, setActiveReply] = useState(false);
    const [replyError, setReplyError] = useState(false);
    const [activeReplyContents, setActiveReplyContents] = useState(true);
    const [replyLine, setReplyLine] = useState(false);
    const [upHover, setUpHover] = useState(false);
    const [downHover, setDownHover] = useState(false);
    const [activeDownvote, setActiveDownvote] = useState(false);
    const [activeUpvote, setActiveUpvote] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const commentsRef = doc(db, "comment", com.id);
        onSnapshot(commentsRef, (doc) => {
            const temp = doc.data();
            setCommentData(
                {
                    id: doc.id,
                    ...temp
                }
            );
            if (user) {
                if (temp.upvotes)
                    if (temp.upvotes.includes(user.uid)) {
                        setActiveUpvote(true)
                        setActiveDownvote(false)
                    }
                if (temp.downvotes)
                    if (temp.downvotes.includes(user.uid)) {
                        setActiveUpvote(false)
                        setActiveDownvote(true)
                    }
            } else {
                setActiveUpvote(false)
                setActiveDownvote(false)
            }
            setVoteCount(() => {
                return temp.upvotes
                    ? temp.downvotes
                        ? temp.upvotes.length - temp.downvotes.length
                        : temp.upvotes.length
                    : 0
            })
        })
    }, [user, params.promiseID]);

    //Update Root Comment
    function updateRootComment(replyID) {
        const comRef = doc(db, "comment", com.id);
        const update = async () => await updateDoc(comRef, { replies: arrayUnion(replyID) })
        update();
    }

    //Reply Submission
    function handleReplySubmit(reply) {
        // If a User is Logged In
        if (user) {
            const replyRef = async () => {
                const comRef = await addDoc(collection(db, "comment"),
                    {
                        "commentorName": user.displayName,
                        "commentorID": user.uid,
                        "createdAt": new Date(),
                        "upvotes": [],
                        "downvotes": [],
                        "postId": params.promiseID,
                        "rootComment": "false",
                        "details": reply,
                        "replies": []
                    }
                );
                updateRootComment(comRef.id);
                setActiveReply(false);
            };
            replyRef();        
        } 
        // If no User Logged In
        else {
            navigate("/login");
        }
    }

    function updateCommentUpvote(event) {
        // For voting
        if (event == "voted") {
            setActiveUpvote(true);
            setVoteCount(activeDownvote ? voteCount + 2 : voteCount + 1);
            setActiveDownvote(false);
            const comRef = doc(db, "comment", com.id);
            const update = async () => await updateDoc(comRef, { upvotes: arrayUnion(user.uid) })
            const update2 = async () => await updateDoc(comRef, { downvotes: arrayRemove(user.uid) })
            update();
            update2();
        } 
        // For vote cancelling
        else if (event == "unvoted") {
            setActiveUpvote(false);
            setVoteCount(voteCount - 1);
            const comRef = doc(db, "comment", com.id);
            const update = async () => await updateDoc(comRef, { upvotes: arrayRemove(user.uid) })
            update();
        }
    }

    function updateCommentDownvote(event) {
        // For voting
        if (event == "voted") {
            setActiveDownvote(true);
            setVoteCount(activeUpvote ? voteCount - 2 : voteCount - 1);
            setActiveUpvote(false);
            const comRef = doc(db, "comment", com.id);
            const update = async () => await updateDoc(comRef, { downvotes: arrayUnion(user.uid) })
            const update2 = async () => await updateDoc(comRef, { upvotes: arrayRemove(user.uid) })
            update();
            update2();
        }
        // For vote cancelling
        else if (event == "unvoted") {
            setActiveDownvote(false);
            setVoteCount(voteCount + 1);
            const comRef = doc(db, "comment", com.id);
            const update = async () => await updateDoc(comRef, { downvotes: arrayRemove(user.uid) })
            update();
        }
    }

    // Up/Down Vote Clicking
    function handleVote(vote) {
        //If a User is Logged In
        if (user) {
            //for Upvote
            if (vote == "up")
                activeUpvote ? updateCommentUpvote("unvoted") : updateCommentUpvote("voted");
            //for Downvote    
            if (vote == "down")
                activeDownvote ? updateCommentDownvote("unvoted") : updateCommentDownvote("voted");
        }
        //If no User Logged In 
        else {
            navigate("/login");
        }
    }

    return (
        commentData
            ? <>
                <div className="flex flex-row">
                    <div className="flex flex-col justify-center relative">
                        {/* Upvote Icon */}
                        <IconContext.Provider value={{ color: activeUpvote ? "#FF4401" : upHover ? "#FF4401" : "FFFFFF" }}>
                            <div className="relative" onMouseDown={() => handleVote("up")} onMouseEnter={() => setUpHover(true)} onMouseLeave={() => setUpHover(false)}>
                                <div className={`absolute ${activeUpvote ? "bg-white bg-opacity-10" : upHover ? "bg-white bg-opacity-10" : ""} w-full h-1/2 max-h-3.5 mt-2 rounded-md cursor-pointer`}></div>
                                <FiChevronUp className="text-3xl cursor-pointer" />
                            </div>
                        </IconContext.Provider>

                        {/* Vote Count Div */}
                        <div className="w-full flex justify-center absolute">{voteCount}</div>

                        {/* Downvote Icon */}
                        <IconContext.Provider value={{ color: activeDownvote ? "#7193ff" : downHover ? "#7193ff" : "FFFFFF" }}>
                            <div className="relative" onMouseDown={() => handleVote("down")} onMouseEnter={() => setDownHover(true)} onMouseLeave={() => setDownHover(false)}>
                                <div className={`absolute ${activeDownvote ? "bg-white bg-opacity-10" : downHover ? "bg-white bg-opacity-10" : ""} w-full h-1/2 max-h-3.5 mt-2 rounded-md cursor-pointer`}></div>
                                <FiChevronDown className="text-3xl p-0" />
                            </div>
                        </IconContext.Provider>
                    </div>

                    <div className="flex flex-col">
                        {/* Comment Details Div*/}
                        <div className="h-2/3 text-justify flex items-end"> {commentData.details} </div>
                        <div>
                            <div className="flex flex-row">
                                {/* Commentor Name */}
                                <div className="text-xs font-bold mr-4"> {commentData.commentorName} </div>

                                {/* Comment Reply Button */} 
                                <div className={`text-xs cursor-pointer mr-4 ${activeReply ? "hidden" : ""}`} onMouseDown={() => setActiveReply(true)}>
                                    Reply
                                </div>

                                {/* Show/Hide Replies */}
                                {commentData.replies
                                    ? <div className={`${activeReplyContents ? "hidden" : ""} text-xs cursor-pointer  `} onMouseDown={() => setActiveReplyContents(true)}>
                                        Show Replies
                                    </div>
                                    : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reply Submission Contents Div */}
                <div className={`bg-gray-800 p-2 rounded-lg ${activeReply ? "" : "hidden"}`}>
                    {/* Reply Textarea for Reply */}
                    <textarea className={`w-full h-32 rounded-lg p-2`} placeholder="Post a reply..." value={replyValue} onChange={(e) => setReplyValue(e.target.value)}></textarea>

                    {/* Reply Submission Buttons & Error Message*/}
                    <div className="flex flex-row-reverse">
                        {/* Reply Button */}
                        <div className="m-2 px-2 bg-gray-600 rounded-lg cursor-pointer" onMouseDown={() => { replyValue.length > 0 ? handleReplySubmit(replyValue) : setReplyError(true) }}>
                            Reply
                        </div>

                        {/* Cancel Reply Button */}
                        <div className="m-2 px-2 bg-gray-600 rounded-lg cursor-pointer"
                            onMouseDown={() => setActiveReply(false)}>
                            Cancel
                        </div>

                        {/* Error Reply Message */}
                        <div className={`${replyError ? "" : "hidden"}`}>
                            Reply cannot be empty...
                        </div>
                    </div>
                </div>

                {/* List of Replies Section */}
                <div className="flex flex-row pl-3.5">
                    {/* White Line for Hide Replies */}
                    <div className={`${replyLine ? "shadow-sm shadow-white" : ""} w-0.5  bg-white rounded-full cursor-pointer`}
                        onMouseDown={() => setActiveReplyContents(false)}
                        onMouseEnter={() => setReplyLine(true)}
                        onMouseLeave={() => setReplyLine(false)}>
                    </div>

                    {/* Recursion Replies */}
                    <div className={`${activeReplyContents ? "" : "hidden"} w-full`}>
                        {
                            commentData.replies
                                ? commentData.replies.map((replyID) => {
                                    return <div className="pl-4" key={replyID}>
                                        <MainCommentList id={replyID} />
                                    </div>
                                }
                                )
                                : <></>
                        }
                    </div>
                </div>
            </>
            : <Spinner />
    )
}
export default MainCommentList;