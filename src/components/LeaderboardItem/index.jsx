import React from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import FallbackImage from '../../assets/img/default.jpg'

function LeaderboardItem({ politician }) {
    let navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/politicians/${politician.id}`)} className="min-w-full md:flex grid grid-cols-12 border-b-2 py-2 px-6 items-center justify-between hover:cursor-pointer hover:bg-midnight">
            <Image src={politician.imageURL} alt={politician.name} className='mr-7 w-20 h-20 md:w-24 md:h-24 object-cover rounded-full col-span-4' fallbackSrc={FallbackImage} />
            <div className="flex flex-col flex-grow col-span-5">
                <p className="text-sm md:text-xl font-bold">{politician.name}</p>
                <p className="text-xs md:text-lg font-extralight">{politician.currentPosition}</p>
            </div>
            <p className="text-md text-bruschetta-tomato font-extrabold text-center flex flex-col items-center col-span-3">
                {politician.tiwalaPoints}
                <div>
                    Tiwala Points
                </div>
            </p>
        </div>
    )
}
export default LeaderboardItem;