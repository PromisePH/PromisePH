import React, { useState, useEffect } from "react";
import ProfIcon from "../../assets/img/Sample_Profile_Icon.png";
import { db, auth } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Post from '../../components/Post';
import CollectionsEnum from '../../constants/collections';
import { MdVerified } from "react-icons/md";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import {
    Input,
    Flex,
    ButtonGroup,
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
        <ButtonGroup>
            <IconButton className="bg-orange-red rounded-full px-2" icon={<h1 className="flex flex-row items-center gap-2px">Save<BsQuestionCircleFill /></h1>} {...getSubmitButtonProps()} />
        </ButtonGroup>
    ) : (
        <Flex>
            <IconButton className="bg-orange-red rounded-full px-2" icon={<h1 className="flex flex-row items-center gap-2px">Edit<RiPencilFill /></h1>} {...getEditButtonProps()} />
        </Flex>
    );
}
function Profile() {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([])
    useEffect(() => {
        // Realtime listener for posts
        if (!user) {
            return;
        }

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
            
            console.log(posts)
        });
    }, [user]);
    return (
        <section className='max-w-3xl mx-auto bg-bunker shadow-md rounded-lg px-10 pt-5 min-h-screen'>
            {/* Page Title */}
            <h1 className='text-2xl font-bold text-center'>Profile</h1>
            {/* User Info Div */}
            <div className='flex flex-row w-full'>
                {/* Image */}
                <img src={ProfIcon} alt='sample' className='mr-5' />
                {/* Info Div */}
                <div className="w-full pt-3">
                    {/* Editable Name */}
                    <Editable className="flex flex-row justify-between items-center" defaultValue='Username' isPreviewFocusable={false}>
                        <div className='flex flex-row gap-1 items-center font-bold text-xl'>
                            <EditablePreview max={5} />
                            <Input as={EditableInput} />
                            <div className='text-caribbean-green'>
                                <MdVerified />
                            </div>
                        </div>
                        <CustomEditableControls />
                    </Editable>
                    <div className='flex flex-row items-center gap-6'>
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
            <Tabs defaultIndex={0} align="center" variant='unstyled'>
                <TabList className="gap-24 font-semibold">
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Posts</Tab>
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Comments</Tab>
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Upvotes</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {
                            user && posts.length > 0 ?
                                posts.map(post => 
                                    <Post key={post.id} post={post} user={user} />
                                )
                                : null
                        }
                    </TabPanel>
                    <TabPanel>
                        {
                            user && posts.length > 0 ?
                                posts.map(post => 
                                    <Post key={post.id} post={post} user={user} />
                                )
                                : null
                        }
                    </TabPanel>
                    <TabPanel>
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
        </section>
    );
}
export default Profile;