import React, { useEffect, useRef, useState } from "react";
import { doc, addDoc, updateDoc, arrayUnion, collection, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner, useDisclosure } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { HiOutlineTrash } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { IconContext } from "react-icons";
import {
    useToast,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'

import CollectionsEnum from '../../constants/collections';

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
    const [activeDetail, setActiveDetail] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const cancelRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const commentsRef = doc(db, CollectionsEnum.COMMENTS, com.id);
        onSnapshot(commentsRef, (doc) => {
            const temp = doc.data();
            setCommentData(
                {
                    id: doc.id,
                    ...temp
                }
            );
            if (user && temp && temp.upvotes.includes(user.uid)) {
                setActiveUpvote(true)
                setActiveDownvote(false)
            } else if (user && temp && temp.downvotes.includes(user.uid)) {
                setActiveUpvote(false)
                setActiveDownvote(true)
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
        const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
        const update = async () => await updateDoc(comRef, { replies: arrayUnion(replyID) })
        update();
    }

    //Delete Comment
    function deleteComment() {
        const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
        const update = async () => await updateDoc(comRef, { isDeleted: true })
        update();
    }

    //Reply Submission
    function handleReplySubmit(reply) {
        // If a User is Logged In
        if (user) {
            const replyRef = async () => {
                const comRef = await addDoc(collection(db, CollectionsEnum.COMMENTS),
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
            const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
            const update = async () => await updateDoc(comRef, { upvotes: arrayUnion(user.uid) })
            const update2 = async () => await updateDoc(comRef, { downvotes: arrayRemove(user.uid) })
            update();
            update2();
        }
        // For vote cancelling
        else if (event == "unvoted") {
            setActiveUpvote(false);
            setVoteCount(voteCount - 1);
            const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
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
            const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
            const update = async () => await updateDoc(comRef, { downvotes: arrayUnion(user.uid) })
            const update2 = async () => await updateDoc(comRef, { upvotes: arrayRemove(user.uid) })
            update();
            update2();
        }
        // For vote cancelling
        else if (event == "unvoted") {
            setActiveDownvote(false);
            setVoteCount(voteCount + 1);
            const comRef = doc(db, CollectionsEnum.COMMENTS, com.id);
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
            else if (vote == "down")
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
                <div className={`flex flex-row h-auto rounded-lg ${activeDetail ? "bg-white bg-opacity-5" : ""}`}>
                    <div className="flex flex-col justify-center relative h-16 mr-2">
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

                    <div className="flex flex-col w-11/12">
                        {/* Comment Details Div*/}
                        <div className={`text-justify flex items-start pt-3 w-full ${commentData.isDeleted ? "italic" : ""}`}> {commentData.isDeleted ? "This Comment was removed by the user" : commentData.details} </div>
                        <div>
                            <div className="flex flex-row">
                                {/* Commentor Name */}
                                <div className="text-xs font-bold mr-4"> {commentData.commentorName} </div>

                                {/* Comment Reply Button */}
                                <div className={`text-xs cursor-pointer mr-4 ${activeReply || commentData.isDeleted ? "hidden" : ""}`} onMouseDown={() => setActiveReply(true)}>
                                    Reply
                                </div>

                                {/* Show/Hide Replies */}
                                {commentData.replies
                                    ? <div className={`${activeReplyContents ? "hidden" : ""} text-xs cursor-pointer  `} onMouseDown={() => setActiveReplyContents(true)}>
                                        Show Replies
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                    {/* Comment details button */}
                    <div className="ml-1 -mr-1 pt-4 relative">
                        {
                            user && commentData && user.uid == commentData.commentorID
                                ? <>
                                    <Menu onOpen={() => { setActiveDetail(true) }} onClose={() => { setActiveDetail(false) }} strategy="fixed" >
                                        {/* Menu Button */}
                                        <MenuButton className={`flex p-1 flex-row items-start justify-end w-full space-x-2 rounded-full cursor-pointer md:hover:bg-gray-500 ${activeDetail ? "bg-gray-500" : ""}`}>
                                            <SlOptionsVertical />
                                        </MenuButton>
                                        {/* Menu DropDown */}
                                        <MenuList className="px-2">
                                            <MenuItem as={Button}
                                                onClick={
                                                    //Checks if the comment is already deleted
                                                    commentData.isDeleted
                                                        ? () => toast({
                                                            title: 'Comment Already Deleted',
                                                            status: 'error',
                                                            duration: 3000,
                                                            isClosable: true,

                                                        })
                                                        : onOpen
                                                }
                                                className="hover:text-red-500 hover:bg-gray-700"
                                            >
                                                <HiOutlineTrash className="mr-2 text-lg" />
                                                Delete Comment
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </>
                                : null
                        }
                    </div>

                </div>

                {/* Reply Submission Contents Div */}
                <div className={`bg-gray-800 p-2 rounded-lg ${activeReply ? "" : "hidden"}`}>
                    {/* Reply Textarea for Reply */}
                    <textarea className={`w-full h-32 rounded-lg p-2 bg-transparent border-none outline-none`} placeholder="Post a reply..." value={replyValue} onChange={(e) => setReplyValue(e.target.value)}></textarea>

                    {/* Reply Submission Buttons & Error Message*/}
                    <div className="flex flex-row-reverse">
                        {/* Reply Button */}
                        <div className={`m-2 px-2 bg-gray-600 rounded-lg cursor-pointer hover:bg-orange-red`} onMouseDown={() => { replyValue.length > 0 ? handleReplySubmit(replyValue) : setReplyError(true) }}>
                            Reply
                        </div>

                        {/* Cancel Reply Button */}
                        <div className={`m-2 px-2 bg-gray-600 rounded-lg cursor-pointer hover:bg-orange-red`} onMouseDown={() => setActiveReply(false)}>
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
                                        <MainCommentList id={replyID} parentId={commentData.id} />
                                    </div>
                                }
                                )
                                : null
                        }
                    </div>
                </div>

                {/* Alert for Delete Comment */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent className="mx-4 mt-20">
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Comment
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You cant undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red'
                                    onClick={onClose}
                                    onMouseDown={() => {
                                        deleteComment();
                                        toast({
                                            title: 'Comment Deleted.',
                                            status: 'success',
                                            duration: 3000,
                                            isClosable: true,
                                        })
                                    }}
                                    ml={3}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
            : <Spinner />
    )
}
export default MainCommentList;