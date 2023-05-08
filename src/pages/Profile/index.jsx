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

        // const q = query(collection(db, CollectionsEnum.POSTS), orderBy("createdAt", "desc"));
        // onSnapshot(q, doc => {
        //     setPosts(doc.docs.map(
        //         doc => {
        //             const data = doc.data();
        //             if (data.poster && data.poster.id === user.uid) {
        //                 return {
        //                     id: doc.id,
        //                     ...data
        //                 }
        //             }
        //         }
        //     ));
        // });
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
                            user ?
                                posts.map(post =>
                                    <Post key={post.id} post={post} user={user} />
                                )
                                : null
                        }
                    </TabPanel>
                    <TabPanel>
                        <p>Wala may gibuhat si Duterte na dautan</p>
                    </TabPanel>
                    <TabPanel>
                        <p className="text-justify">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                            molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                            numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                            optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                            obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                            nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
                            tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                            quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos
                            sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
                            recusandae alias error harum maxime adipisci amet laborum. Perspiciatis
                            minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit
                            quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur
                            fugiat, temporibus enim commodi iusto libero magni deleniti quod quam
                            consequuntur! Commodi minima excepturi repudiandae velit hic maxime
                            doloremque. Quaerat provident commodi consectetur veniam similique ad
                            earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo
                            fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore
                            suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium
                            modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam
                            totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniam
                            quasi aliquam eligendi, placeat qui corporis!
                        </p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </section>
    );
}
export default Profile;