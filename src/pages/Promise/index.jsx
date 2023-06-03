import React, { useEffect, useRef, useState } from "react";
import { collection, doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, increment, setDoc } from "firebase/firestore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
    Skeleton,
    useToast,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react'

import { db, auth } from "../../firebase/firebase";

import { GoKebabHorizontal } from "react-icons/go";

import Comment from "../../components/Comment";
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav"
import CollectionsEnum from '../../constants/collections';

function Promise() {
    const [user] = useAuthState(auth);
    const [data, setPromiseData] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [isPoster, setIsPoster] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postDeleteStatus, setPostDeleteStatus] = useState(true);
    const toast = useToast();
    const cancelRef = useRef(null);
    const navigate = useNavigate();
    const params = useParams();

    function updateView() {
        const postRef = doc(db, "posts", params.promiseID);
        const update = async () => await updateDoc(postRef, { views: increment(1) });
        update();
    }

    useEffect(() => {
        updateView();
        setIsLoading(true);
        const postRef = doc(db, "posts", params.promiseID);
        const comRef = collection(db, CollectionsEnum.COMMENTS);
        onSnapshot(postRef, (doc) => {
            const temp = doc.data();
            setPromiseData({ id: doc.id, ...temp });
            setIsPoster(
                user && user.uid
                    ? user.uid == temp.poster.id
                        ? true
                        : false
                    : false
            )
            setPostDeleteStatus(temp.isDeleted);
            setIsActive(
                user
                    ? !!temp.upvotes.includes(user.uid)
                    : false
            );
            setViewCount(temp.views);
            setLikeCount(
                temp.upvotes
                    ? temp.upvotes.length
                    : 0
            );
        }
        );

        onSnapshot(comRef, (doc) => {
            setCommentCount(
                doc.docs.map(doc => { return doc.data() })
                    .filter((q) => q.postId.includes(params.promiseID))
                    .length
            )
            setIsLoading(false);
        }
        );
    }, [user, params.promiseID]);
    const d1 = data.createdAt ? data.createdAt.toDate() : new Date();
    const d2 = new Date();
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    // Update Reaction
    const updatePostLike = async (liked) => {
        setIsActive(!isActive);
        const userDataRef = doc(db, CollectionsEnum.USER_DATA, user.uid)

        if (liked) {
            const postRef = doc(db, "posts", params.promiseID);
            await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
            await setDoc(
                userDataRef,
                { upvotedPosts: arrayUnion(params.promiseID) },
                { merge: true }
            );
        } else {
            const postRef = doc(db, "posts", params.promiseID);
            await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
            await setDoc(
                userDataRef,
                { upvotedPosts: arrayRemove(params.promiseID) },
                { merge: true }
            );
        }
    }

    //Delete Post Function
    function deletePost() {
        console.log(data.id);
        const postRef = doc(db, "posts", data.id);
        const update = async () => await setDoc(postRef, { isDeleted: true }, { merge: true })
        update();
        setPostDeleteStatus(true);
    }

    // Heart Reaction Clicked
    function handleLike() {
        //If a User is Logged In
        if (user) {
            updatePostLike(!isActive);
            //If no User Logged In
        } else {
            navigate("/login");
        }
    }

    //deleteStatus: deciding value to show or not to show the post 
    const deleteStatus = () => {
        // If post is Deleted but the post creator is logged in
        if (data.isDeleted && user && user.uid === data.poster.id) {
            return false;
            //If the post is Deleted and the logged in user is not the post owner
        } else if (data.isDeleted && user && user.uid !== data.poster.id) {
            return true;
            //If the post is delted but no user logged in
        } else if (!data.isDeleted) {
            return false;
        } else {
            return true;
        }
    }

    return <>
        <NavBar />
        {
            isLoading
                ? <>
                    {/* Skeleton */}
                    <div className="flex pt-20 justify-center md:w-full">
                        <div className="p-4 flex flex-col bg-bunker items-center w-full md:w-4/12">
                            <div className="flex flex-row w-full mb-10">
                                <Skeleton height='130px' width='160px' className="rounded-md" />
                                <div className="flex flex-col w-full px-4">
                                    <Skeleton height='30px' width='100%' className="rounded-md my-5" />
                                    <Skeleton height='30px' width='100%' className="rounded-md" />
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <Skeleton height='17px' width='85%' className="rounded-md my-5" />
                            </div>
                            <Skeleton height='17px' width='100%' className="rounded-md" />
                            <Skeleton height='17px' width='100%' className="rounded-md my-5" />
                            <Skeleton height='17px' width='100%' className="rounded-md" />
                            <div className="w-full flex justify-start">
                                <Skeleton height='17px' width='70%' className="rounded-md my-5" />
                            </div>
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
                //Checks the post's delete status
                : deleteStatus()
                    // Delete Message Post 
                    ? <main className=" flex justify-center items-center h-screen">
                        <div className="flex flex-col justify-center items-center bg-bunker rounded-3xl p-10">
                            <div className="bg-red-600 rounded-full box-content p-8 mb-10">
                                <BsTrash className="text-8xl" />
                            </div>
                            <div className="text-4xl md:text-5xl text-center">
                                Promise Deleted
                            </div>
                        </div>
                    </main>

                    : <>
                        {/* Main Promise Div */}
                        <main className="pt-16 pb-3 px-4">
                            <div className="max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4 mt-5">
                                <div className="flex flex-row">
                                    <div className="flex flex-row items-center mb-2 mx-0 w-3/6">
                                        <a href={window.location.href} target="_blank" rel="noreferrer" className="flex items-center">
                                            {/* Poster Name */}
                                            <span className="ml-2 text-white text-1xs text-sm font-bold">{data.poster.name}</span>
                                        </a>
                                        <span className="ml-4 text-white text-xs text-sm italic">
                                            {/* Post Date */}
                                            {diffDays <= 31
                                                ? diffDays + " Day/s ago"
                                                : yearDiff > 0 ? yearDiff + " Year/s ago"
                                                    : totalMonthDiff <= 12 && totalMonthDiff != 0
                                                        ? totalMonthDiff + " Month/s ago"
                                                        : diffDays + "Day/s ago"
                                            }
                                        </span>
                                    </div>
                                    {/* Checks if the logged in user is the post's creator for Menu Button Visibility*/}
                                    {isPoster
                                        ? <div className="w-3/6 h-min flex flex-row-reverse">
                                            <div className="h-max hover:bg-gray-700 p-1 flex items-center rounded-full">
                                                {
                                                    //DropDown Menu
                                                    <Menu onMouseDown={(e) => e.stopPropagation()}>
                                                        <MenuButton onMouseDown={(e) => e.stopPropagation()}>
                                                            <GoKebabHorizontal onMouseDown={(e) => e.stopPropagation()} className="text-xl" />
                                                        </MenuButton>
                                                        <MenuList onMouseDown={(e) => e.stopPropagation()} className="px-2">
                                                            <MenuItem as={Button}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onClick={
                                                                    //Checks if the comment is already deleted
                                                                    data.isDeleted
                                                                        ? () => toast({
                                                                            title: 'Post Already Deleted',
                                                                            status: 'error',
                                                                            duration: 3000,
                                                                            isClosable: true,

                                                                        })
                                                                        : onOpen
                                                                }
                                                                className="hover:text-red-600 hover:bg-gray-700"
                                                            >
                                                                <BsTrash className="mr-2 text-lg" onMouseDown={(e) => e.stopPropagation()} />
                                                                Delete Post
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                }
                                            </div>
                                        </div>
                                        : null
                                    }
                                </div>

                                {/* Promise Contents Div*/}
                                <div className="flex flex-row">

                                    {/* Post Image Div */}
                                    <div className="rounded-lg object-scale-down">
                                        <a href={`${data.image}`} target="_blank" rel="noreferrer" className="">
                                            <img src={data.image} className="sm:w-36 sm:h-36 w-28 h-28 object-cover rounded-md" />
                                        </a>
                                    </div>

                                    {/* Promise Header Div */}
                                    <div className="w-5/6 h-28 box-content box-border">
                                        <div className="flex flex-col p-2 h-max min-w-0 max-w-max">
                                            {/* Post Title Div */}
                                            <div className="md:text-2xl font-bold w-full max-w-full h-16 overflow-hidden overflow-ellipsis">
                                                {data.title}
                                            </div>

                                            {/* Tags Row Div*/}
                                            <div className="flex flex-row h-12 max-h-10 items-center">
                                                {/* 'Verified By' Tags Div */}
                                                <div>
                                                    {
                                                        data.verifiedUpvotes.map((verifiedBy) => {
                                                            return <div className="bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2 mr-1 md:p-3 md:mr-4 transform hover:scale-110" key={verifiedBy}>
                                                                {verifiedBy}
                                                            </div>
                                                        }
                                                        )
                                                    }
                                                </div>
                                                {/* Flair/Tags Div */}
                                                <div>
                                                    {
                                                        data.isDeleted
                                                            ? <div className="bg-red-600 border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2 mr-1 md:p-3 md:mr-4 transform hover:scale-110 text-white" onMouseDown={(e) => e.stopPropagation()}>
                                                                DELETED
                                                            </div>
                                                            : null
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        data.tags.map((tag) => {
                                                            return <li className="bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 transform hover:scale-110 mr-2" key={tag}>
                                                                <span className="text-white">{tag}</span>
                                                            </li>
                                                        }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promise Description Div */}
                                <div className="mt-5 text-justify">
                                    {data.description}
                                </div>

                                {/* (View, Like, Comment) Count - View Sources - React Button Divs*/}
                                <div className="flex flex-wrap flex-row justify-evenly items-center pt-3 gap-12">
                                    <span className="text-white text-xs md:text-sm">{viewCount} Views</span>
                                    <span className="text-white text-xs md:text-sm">{likeCount} Likes</span>
                                    <span className="text-white text-xs md:text-sm">{commentCount} Comments</span>
                                    <span className="text-white text-xs md:text-sm underline cursor-pointer">View Sources</span>
                                    <button className="text-orange-red text-2xl transform hover:scale-110" onClick={() => handleLike()}>
                                        {isActive ? <AiFillHeart /> : <AiOutlineHeart />}
                                    </button>
                                </div>

                            </div>
                        </main>
                        {/* Comment Section Div */}
                        <Comment id={params.promiseID} postIsDeleted={postDeleteStatus} />
                        <BottomNav />
                    </>
        }
        {/* Alert Dialog for Post Delete */}
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <AlertDialogOverlay onMouseDown={(e) => e.stopPropagation()}>
                <AlertDialogContent className="mx-4 mt-20" onMouseDown={(e) => e.stopPropagation()}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold' onMouseDown={(e) => e.stopPropagation()}>
                        Delete Post
                    </AlertDialogHeader>

                    <AlertDialogBody onMouseDown={(e) => e.stopPropagation()}>
                        Are you sure? You cant undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter onMouseDown={(e) => e.stopPropagation()}>
                        <Button ref={cancelRef} onClick={onClose} onMouseDown={(e) => e.stopPropagation()}>
                            Cancel
                        </Button>
                        <Button colorScheme='red'
                            onClick={onClose}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                deletePost();
                                toast({
                                    title: 'Post Deleted.',
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
}
export default Promise;