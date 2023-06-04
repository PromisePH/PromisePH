import React from "react";
import { useNavigate } from "react-router-dom";

function LeaderboardItem() {
    let navigate = useNavigate();
    const routeChange = () => {
        navigate('/politicians/WBXl4RkjhTg3fckg6TGk');
    }
    return (
        <div onClick={routeChange} className="min-w-full flex flex-row border-b-2 p-2 md:px-6 items-center hover:cursor-pointer hover:bg-midnight">
           <img src={"https://avatars.githubusercontent.com/u/82669071?s=80&v=4"} className="mr-7 w-20 h-20 md:w-24 md:h-24 rounded-full" />
            <div className="flex flex-col flex-grow">
                <p className="text-xs md:text-xl font-bol">Isko Moreno</p>
                <p className="text-1xs md:text-lg font-extralight">@iskomnl</p>
            </div>
            <p className="text-2xl text-bruschetta-tomato font-extrabold md:pl-32">4542</p>
        </div>
    )
}
export default LeaderboardItem;