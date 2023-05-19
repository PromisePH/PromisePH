import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import NewImage from "../../assets/svg/New.svg";
import PopularImage from "../../assets/svg/Popular.svg";
import TagImage from "../../assets/svg/Tag.svg";

import CollectionsEnum from '../../constants/collections';
import EntityCollectionEnum from "../../constants/entity";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'

function Filter({setFilter}) {
    const [tags, setTags] = useState([]);
    const getTags = async () => {
        const tagsRef = collection(db, CollectionsEnum.TAGS);
        const tagsSnapshot = await getDocs(tagsRef);
        const tagList = tagsSnapshot.docs.map(
            doc => {
                return {
                    id: doc.id,
                  ...doc.data()
                }
            }
        )
        setTags(tagList);
    }

    useEffect(() => {
        getTags();
    }, []);

    const handleTagSelect = (tag) => {
        setFilter(tag)
    }

    return (
        <section className="max-w-3xl w-full">
            {/* Desktop View */}
            <div className="fixed left-5 hidden xl:flex bg-bunker flex-col items-start justify-start rounded-2xl py-4 px-2 gap-1 w-fit">
                {/* Newest and Recent Button */}
                <button onClick={()=>handleTagSelect(EntityCollectionEnum.NEW)} className="w-full flex flex-row justify-start p-2 rounded-lg hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600 gap-1">
                    <img className="pl-1 bg-midnight p-1 rounded-md border-radius my-auto" src={NewImage} alt="default"></img>
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-md font-bold">Newest and Recent</span>
                        <span className="text-2xs opacity-40">Find the latest updates</span>
                    </div>
                </button>
                {/* Popular of the Day Button */}
                <button onClick={()=>handleTagSelect(EntityCollectionEnum.POPULAR)} className="w-full flex flex-row justify-start p-2 rounded-lg hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600 gap-1">
                    <img className="pl-1 bg-midnight p-1 rounded-md border-radius my-auto" src={PopularImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-md font-bold">Popular of the Day</span>
                        <span className="text-2xs opacity-40">Hottest promises of the day</span>
                    </div>
                </button>
                {/* Tags Button */}
                <Menu>
                    <MenuButton className="w-full flex flex-row justify-start p-2 rounded-lg hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600">
                        <div className="flex flex-row gap-1">
                            <img className=" bg-midnight p-1 rounded-md border-radius my-auto" src={TagImage} alt="default"></img>
                            <div className="pl-1 flex flex-col items-start">
                                <div className="flex flex-row items-center gap-1">
                                    <span className="text-md font-bold">Tags</span>
                                    <span className="bg-burning-orange rounded-lg text-1xs font-semibold p-1">{tags.length}</span>
                                </div>
                                <span className="text-2xs opacity-40">Explore Popular Topics</span>
                            </div>
                        </div>
                    </MenuButton>
                    <MenuList>
                        {
                            tags.map((tag) => (
                                <MenuItem key={tag.id} onClick={()=>{handleTagSelect(tag.id)}}>{tag.id}</MenuItem>
                            ))
                       }
                    </MenuList>
                </Menu>
            </div>
            {/* Mobile View */}
            <div className="flex xl:hidden flex-row justify-around bg-bunker w-full rounded-md mb-2 py-1">
                {/* Newest and Recent Button */}
                <button onClick={()=>handleTagSelect(EntityCollectionEnum.NEW)} className="flex flex-row items-center p-2 gap-2 rounded-lg hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600">
                    <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={NewImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold">Newest</span>
                    </div>
                </button>
                {/* Popular of the Day Button */}
                <button onClick={()=>handleTagSelect(EntityCollectionEnum.POPULAR)}  className="max-w-2xs flex flex-row items-center p-2 gap-2 rounded-lg hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600">
                    <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={PopularImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold">Popular</span>
                    </div>
                </button>
                {/* Tags Button */}
                <Menu className="max-w-2xs flex flex-row p-2 rounded-sm hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600">
                    <MenuButton>
                        <div className="flex flex-row gap-2 items-center rounded-lg ">
                            <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={TagImage} alt="default"></img>
                            <div className="flex flex-row items-center">
                                <span className="text-xs font-bold pr-1">Tags</span>
                                <span className="bg-burning-orange rounded-sm text-1xs font-semibold p-1">{tags.length}</span>
                            </div>
                        </div>
                    </MenuButton>
                    <MenuList>
                        {
                            tags.map((tag) => (
                                <MenuItem key={tag.id} onClick={()=>{handleTagSelect(tag.id)}}>{tag.id}</MenuItem>
                            ))
                        }
                    </MenuList>
                </Menu>
            </div>
        </section>
    );
}
export default Filter;