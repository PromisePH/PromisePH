import React, { useState, useEffect } from "react";
import { updateProfile } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import Avatar from "../../components/Avatar";
import Post from '../../components/Post';
import CommentSummary from "../../components/CommentSummary";
import CollectionsEnum from '../../constants/collections';
import { get_difference_string } from '../../utils/utils';

import { MdVerified } from "react-icons/md";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import { AiTwotoneSave } from "react-icons/ai";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import {
    Input,
    IconButton,
    Editable,
    EditableInput,
    EditablePreview,
    useEditableControls,
    Spinner
} from "@chakra-ui/react";

function CustomEditableControls() {
    const {
        isEditing,
        getSubmitButtonProps,
        getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
        <IconButton className="bg-orange-red rounded-full md:px-2"
            icon={
                <h1 className="flex flex-row items-center gap-0.5 p-1">
                    <span className="hidden md:flex ">
                        Save
                    </span>
                    <AiTwotoneSave />
                </h1>}
            {...getSubmitButtonProps()}
        />
    ) : (
        <IconButton className="bg-orange-red rounded-full px-0.5 md:px-2"
            icon={
                <h1 className="flex flex-row items-center gap-0.5 p-1">
                    <span className="hidden md:flex">
                        Edit
                    </span>
                    <RiPencilFill />
                </h1>}
            {...getEditButtonProps()}
        />
    );
}

function Profile() {
    const [user] = useAuthState(auth);
    const [latestPost, setLatestPost] = useState(null)
    const [totalUpvotes, setTotalUpvotes] = useState(0)
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [upvotedPosts, setUpvotedPosts] = useState([])
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        // Realtime listener for posts
        if (!user) {
            navigate('/login')
            return;
        }

        setName(user.displayName)

        try {
            const fetchUserData = async () => {
                setIsLoading(true)
                const userDataRef = doc(
                    db,
                    CollectionsEnum.USER_DATA,
                    user.uid
                )
                const userDataDoc = await getDoc(userDataRef)

                if (!userDataDoc.exists()) {
                    console.error("User Data not found");
                    setIsLoading(false)
                    return;
                }

                const userData = userDataDoc.data()
                if (userData == undefined) {
                    setIsLoading(false)
                    return;
                }

                // Set Posts
                if (userData.userPosts && userData.userPosts.length > 0) {
                    setPosts([]);

                    const postIds = userData.userPosts
                    const postData = []
                    for (const postId of postIds) {
                        const postRef = doc(
                            db,
                            CollectionsEnum.POSTS,
                            postId
                        )
                        const postDoc = await getDoc(postRef)
                        if (postDoc.exists()) {
                            const post = {
                                id: postDoc.id,
                                ...postDoc.data()
                            }
                            postData.push(post)

                            // append to total upvotes
                            setTotalUpvotes(totalUpvotes + post.upvotes.length)

                            // compare latest post to date of current post
                            if (latestPost == null || post.createdAt && post.createdAt > latestPost.createdAt) {
                                setLatestPost(post)
                            }
                        }
                    }
                    setPosts(postData.reverse())
                }


                // Set Comments
                if (userData.userComments && userData.userComments.length > 0) {
                    setComments([]);

                    const commentIds = userData.userComments
                    const commentsData = []
                    for (const commentId of commentIds) {
                        const commentRef = doc(
                            db,
                            CollectionsEnum.COMMENTS,
                            commentId
                        )
                        const commentDoc = await getDoc(commentRef)
                        if (commentDoc.exists()) {
                            const comment = {
                                id: commentDoc.id,
                                ...commentDoc.data()
                            }
                            commentsData.push(comment)
                        }
                    }
                    setComments(commentsData.reverse())
                }

                // Set Upvoted Posts
                if (userData.upvotedPosts && userData.upvotedPosts.length > 0) {
                    setUpvotedPosts([]);

                    const upvotedPostIds = userData.upvotedPosts
                    const postData = []
                    for (const postId of upvotedPostIds) {
                        const postRef = doc(
                            db,
                            CollectionsEnum.POSTS,
                            postId
                        )
                        const postDoc = await getDoc(postRef)
                        if (postDoc.exists()) {
                            postData.push({
                                id: postDoc.id,
                                ...postDoc.data()
                            })
                        }
                    }

                    setUpvotedPosts(postData.reverse())
                }

                setIsLoading(false)
            }

            fetchUserData();
        }
        catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }, [user]);

    const nameChangeHandler = (e) => {
        setName(e.target.value)
    }

    const changeDisplayName = async () => {
        await updateProfile(user, { displayName: name });
    }

    return (
        <>
            <NavBar />
            <main className='px-4 py-20 md:pb-0 flex flex-col items-center w-full'>
                <section className="bg-bunker p-5 rounded-t-lg w-full max-w-3xl flex flex-col gap-1">
                    {/* Page Title */}
                    <h1 className='text-2xl font-bold text-center'>Profile</h1>

                    <div className="flex flex-row gap-5">
                        {/* Image */}
                        {
                            user ?
                                <Avatar name={user.displayName} styles='rounded-full w-36' />
                                : null
                        }
                        <div className="flex flex-col justify-center gap-1 w-full">
                            {/* User Info Div */}
                            <Editable className="flex flex-row justify-between items-center w-full" value={name} onSubmit={changeDisplayName} isPreviewFocusable={false}>
                                <div className='flex flex-row gap-1 items-center font-bold text-xl'>
                                    <EditablePreview />
                                    <Input as={EditableInput} className="w-3/4" onChange={nameChangeHandler} />
                                    <div className='text-caribbean-green'>
                                        <MdVerified />
                                    </div>
                                </div>
                                <CustomEditableControls />
                            </Editable>
                            {
                                isLoading ?
                                    <div className="flex justify-center items-center">
                                        <Spinner />
                                    </div> :
                                    <div className='flex flex-row items-center gap-2 md:gap-7'>
                                        {/* Date Joined Div */}
                                        <div className='flex flex-row justify-items-center gap-1'>
                                            <BsFillCalendarWeekFill className='text-xs' />
                                            <p className='text-xs opacity-30'>
                                                {
                                                    latestPost ?
                                                        `Posted ${get_difference_string(latestPost.createdAt)}`
                                                        :
                                                        'No posts yet'
                                                }
                                            </p>
                                        </div>
                                        {/* Upvote Count Div */}
                                        <div className='flex flex-col items-center ml-2'>
                                            <p className='font-medium text-xs'>Upvotes</p>
                                            <p className="flex flex-row items-center font-extralight text-1xs gap-1">
                                                <AiFillHeart className="text-orange-red" />
                                                {totalUpvotes}
                                            </p>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </section>
                <Tabs className="w-full max-w-3xl rounded-b-lg" defaultIndex={0} variant='unstyled' >
                    <TabList className="md:gap-24 font-semibold flex-wrap bg-bunker p-1 flex justify-center">
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Posts</Tab>
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Comments</Tab>
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Upvotes</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel className="px-0">
                            {
                                isLoading ?
                                    <div className="h-56 flex justify-center items-center">
                                        <Spinner />
                                    </div> :
                                    posts.length > 0 ?
                                        posts.map(post =>
                                            <Post key={post.id} post={post} user={user} />
                                        ) :
                                        <p className="h-56 flex justify-center items-center">
                                            <span className="text-2xl font-bold">
                                                No Posts Found
                                            </span>
                                        </p>
                            }
                        </TabPanel>
                        <TabPanel className="px-0">
                            {
                                isLoading ?
                                    <div className="h-56 flex justify-center items-center">
                                        <Spinner />
                                    </div> :
                                    comments.length > 0 ?
                                        comments.map(comment =>
                                            <CommentSummary key={comment.id} comment_data={comment} />
                                        ) :
                                        <p className="h-56 flex justify-center items-center">
                                            <span className="text-2xl font-bold">
                                                No Comments Found
                                            </span>
                                        </p>
                            }
                        </TabPanel>
                        <TabPanel className="px-0">
                            {
                                isLoading ?
                                    <div className="h-56 flex justify-center items-center">
                                        <Spinner />
                                    </div> :
                                    upvotedPosts.length > 0 ?
                                        upvotedPosts.map(post =>
                                            <Post key={post.id} post={post} user={user} />
                                        ) :
                                        <p className="h-56 flex justify-center items-center">
                                            <span className="text-2xl font-bold">
                                                No Upvoted Posts Found
                                            </span>
                                        </p>
                            }
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </main>
            <BottomNav />
        </>
    );
}
export default Profile;