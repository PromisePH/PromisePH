import React from "react";
import NewImage from "../../assets/svg/New.svg";
import PopularImage from "../../assets/svg/Popular.svg";
import TagImage from "../../assets/svg/Tag.svg";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'

function Filter() {
    return (
        <section className="max-w-3xl w-full">
            {/* Desktop View */}
            <div className="hidden xl:flex fixed bg-bunker flex-col items-start justify-start rounded-2xl py-1 px-2 gap-1 left-0 ml-16">
                {/* Newest and Recent Button */}
                <button className="w-full flex flex-row justify-start p-2 rounded-sm hover:bg-gray-600">
                    <img className="pl-1 bg-midnight p-1 rounded-md border-radius my-auto" src={NewImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-lg">Newest and Recent</span>
                        <span className="text-2xs opacity-40">Find the latest updates</span>
                    </div>
                </button>
                {/* Popular of the Day Button */}
                <button className="w-full flex flex-row justify-start p-2 rounded-sm hover:bg-gray-600">
                    <img className="pl-1 bg-midnight p-1 rounded-md border-radius my-auto" src={PopularImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-lg">Popular of the Day</span>
                        <span className="text-2xs opacity-40">Hottest promises of the day</span>
                    </div>
                </button>
                {/* Tags Button */}
                <button className="w-full flex flex-row justify-start p-2 rounded-sm hover:bg-gray-600">
                    <Menu>
                        <MenuButton>
                            <div className="flex flex-row">
                                <img className=" bg-midnight p-1 rounded-md border-radius my-auto" src={TagImage} alt="default"></img>
                                <div className="pl-1 flex flex-col items-start">
                                    <div className="flex flex-row items-center">
                                        <span className="text-lg">Tags</span>
                                        <span className="bg-burning-orange rounded-sm text-1xs font-semibold">24</span>
                                    </div>

                                    <span className="text-2xs opacity-40">Explore Popular Topics</span>
                                </div>
                            </div>
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Help</MenuItem>
                            <MenuItem>Finance</MenuItem>
                            <MenuItem>Test</MenuItem>
                        </MenuList>
                    </Menu>
                </button>
            </div>
            {/* Mobile View */}
            <div className="flex xl:hidden flex-row justify-around bg-bunker w-full rounded-md">
                {/* Newest and Recent Button */}
                <button className="flex flex-row items-center p-1 rounded-sm">
                    <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={NewImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-xs">Newest</span>
                    </div>
                </button>
                {/* Popular of the Day Button */}
                <button className="max-w-2xs flex flex-row items-center p-1 rounded-sm">
                    <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={PopularImage} alt="default"></img>
                    <div className="flex flex-col items-start">
                        <span className="text-xs">Popular</span>
                    </div>
                </button>
                {/* Tags Button */}
                <Menu className="max-w-2xs flex flex-row p-1 rounded-sm">
                    <MenuButton>
                        <div className="flex flex-row items-center">
                            <img className="bg-midnight p-1 rounded-md border-radius my-auto" src={TagImage} alt="default"></img>
                            <div className="flex flex-row items-center">
                                <span className="text-xs pr-1">Tags</span>
                                <span className="bg-burning-orange rounded-sm text-1xs font-semibold p-1">24</span>
                            </div>
                        </div>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Help</MenuItem>
                        <MenuItem>Finance</MenuItem>
                        <MenuItem>Test</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </section>
    );
}
export default Filter;