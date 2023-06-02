import React from "react";
import { useNavigate } from "react-router-dom";

import Top6 from "../../assets/img/Top6.png";

function LeaderboardItem() {
    let navigate = useNavigate();
    const routeChange = () => {
        navigate('/politicians/WBXl4RkjhTg3fckg6TGk');
    }
    return (
        <div onClick={routeChange} className="min-w-full flex flex-row border-b-2 md:pt-3 py-2 md:pb-3 md:mb-3 px-2 md:px-6 items-center hover:cursor-pointer">
            <img className="pr-7" src={Top6} />
            <div className="flex flex-col flex-grow">
                <p className="text-xs md:text-xl font-bol">Isko Moreno</p>
                <p className="text-1xs md:text-lg font-extralight">@iskomnl</p>
            </div>
            <p className="text-2xl text-bruschetta-tomato font-extrabold md:pl-32">4542</p>
        </div>
    )
}
export default LeaderboardItem;