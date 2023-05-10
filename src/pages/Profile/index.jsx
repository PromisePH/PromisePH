import React, { useState, useEffect } from "react";
import { updateProfile } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from '../../firebase/firebase';

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import Avatar from "../../components/Avatar";
import Post from '../../components/Post';
import CollectionsEnum from '../../constants/collections';

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
    useEditableControls
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
    const [posts, setPosts] = useState([])
    const [name, setName] = useState('')
    useEffect(() => {
        // Realtime listener for posts
        if (!user) {
            return;
        }

        console.log(user)

        setName(user.displayName)

        const q = query(collection(db, CollectionsEnum.POSTS), orderBy("createdAt", "desc"));
        onSnapshot(q, doc => {
            const posts = doc.docs.map(
                doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                }
            )
            const filteredPosts = posts.filter(
                data => data.poster && data.poster.id === user.uid
            )
            setPosts(filteredPosts);
        });
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
            <main className='px-4 py-20 md:pb-0 flex flex-col items-center w-full gap-5'>
                <section className="bg-bunker p-5 rounded-lg w-full max-w-3xl flex flex-col gap-1">
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
                            <div className='flex flex-row items-center gap-2 md:gap-7'>
                                {/* Date Joined Div */}
                                <div className='flex flex-row justify-items-center gap-1'>
                                    <BsFillCalendarWeekFill className='text-xs' />
                                    <p className='text-xs opacity-30'>Joined 1 day ago</p>
                                </div>
                                {/* Upvote Count Div */}
                                <div className='flex flex-col items-center ml-2'>
                                    <p className='font-medium text-xs'>Upvotes</p>
                                    <p className="flex flex-row items-center font-extralight text-1xs gap-1"><AiFillHeart className="text-orange-red" />7589</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Tabs className="w-full max-w-3xl" defaultIndex={0} align="center" variant='unstyled'>
                    <TabList className="md:gap-24 font-semibold flex-wrap">
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Posts</Tab>
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Comments</Tab>
                        <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Upvotes</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel className="px-0">
                            {
                                user && posts.length > 0 ?
                                    posts.map(post =>
                                        <Post key={post.id} post={post} user={user} />
                                    )
                                    : null
                            }
                        </TabPanel>
                        <TabPanel className="px-0">
                            {
                                user && posts.length > 0 ?
                                    posts.map(post =>
                                        <Post key={post.id} post={post} user={user} />
                                    )
                                    : null
                            }
                        </TabPanel>
                        <TabPanel className="px-0">
                            {
                                user && posts.length > 0 ?
                                    posts.map(post =>
                                        <Post key={post.id} post={post} user={user} />
                                    )
                                    : null
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