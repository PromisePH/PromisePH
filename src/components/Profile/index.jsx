import React, { useState } from "react";
import draftToHtml from "draftjs-to-html";
import ProfIcon from "../../assets/img/Sample_Profile_Icon.png";
import Post from '../../components/Post';
import { MdVerified } from "react-icons/md";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import {
    Input,
    Flex,
    ButtonGroup,
    IconButton,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    useEditableControls
} from "@chakra-ui/react";

function Profile(profile) {
    const createMarkup = (raw) => {
        return { __html: draftToHtml(raw) };
    };
    function CustomEditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton icon={<h1>Save</h1>} {...getSubmitButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center'>
                <IconButton size='sm' icon={<h1>Edit</h1>} {...getEditButtonProps()} />
            </Flex>
        );
    }
    return (
        <section className='max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4'>
            {/* Page Title Div */}
            <div>
                <h1 className='text-2xl font-bold text-center'>Profile</h1>
            </div>
            {/* User Info Div */}
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row'>
                    {/* Image Div */}
                    <div>
                        <img src={ProfIcon} alt='sample' className='mr-2' />
                    </div>
                    {/* Info Div */}
                    <div>
                        <div className='flex flex-row items-center mb-2'>
                            {/* Editable Name */}
                            <Editable className="flex flex-row items-center" defaultValue='Username' isPreviewFocusable={false}>
                                <EditablePreview />
                                <Input as={EditableInput} />
                                <div className='text-caribbean-green'>
                                    <MdVerified />
                                </div>
                                <div className="ml-96">
                                    <CustomEditableControls />
                                </div>
                            </Editable>
                        </div>
                        <div className='flex flex-row'>
                            {/* Date Joined Div */}
                            <div className='flex flex-row justify-items-center'>
                                <BsFillCalendarWeekFill />
                                <p className='text-xs opacity-30'>Joined 1 day ago</p>
                            </div>
                            {/* Upvote Count Div */}
                            <div className='flex flex-col items-center ml-2'>
                                <p className='font-bold'>Upvotes</p>
                                <div className='flex flex-row items-center'>
                                    <div className='text-orange-red'>
                                        <AiFillHeart />
                                    </div>
                                    <p>7589</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tabs defaultIndex={0} align="center" variant='unstyled'>
                <TabList className="gap-20">
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Posts</Tab>
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Comments</Tab>
                    <Tab className="border-b-4 rounded-sm border-transparent hover:border-orange-500 focus:border-orange-red">Upvotes</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Post className="" />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                    </TabPanel>
                    <TabPanel>
                        <p>Wala may gibuhat si Duterte na dautan</p>
                    </TabPanel>
                    <TabPanel>
                        <Post />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </section>
    );
}
export default Profile;