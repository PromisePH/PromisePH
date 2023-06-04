import React from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import LeaderboardItem from "../../components/LeaderboardItem";

import rank_1_footer from "../../assets/img/rank_1_footer.png";
import rank_2_footer from "../../assets/img/rank_2_footer.png";
import rank_3_footer from "../../assets/img/rank_3_footer.png";

function Leaderboard() {
    let navigate = useNavigate();
    const routeChange = () => {
        navigate('/politicians/WBXl4RkjhTg3fckg6TGk');
    }

    return (
        <>
            <NavBar />
            <main className='px-4 py-20 flex flex-col items-center'>
                <section className="w-full max-w-3xl">
                    {/* Top 3 Div */}
                    <div className="w-full flex flex-col items-center bg-bunker rounded-45px py-3 mb-4">
                        <h1 className="text-2xl text-center font-bold mb-2">Leaderboard</h1>
                        <div className="flex flex-row h-72 px-5 w-full justify-center">
                            {/* Top 2 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 pt-8 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-orange-400 flex items-center justify-center self-center">
                                    <img src={"https://avatars.githubusercontent.com/u/82669071?s=80&v=4"} className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src={rank_2_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                </div>
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tl-3xl rounded-bl-3xl h-32">
                                    <p className="text-xl font-bold">RRD</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7298</p>
                                    <p className="text-1xs font-extralight">@rodrigsduts</p>
                                </div>
                            </div>
                            {/* Top 1 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 hover:cursor-pointer hover:bg-midnight rounded-t-3xl">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-red-600 flex items-center justify-center self-center">
                                    <img src={"https://avatars.githubusercontent.com/u/82669071?s=80&v=4"} className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src={rank_1_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                </div>
                                <div className="flex flex-col items-center bg-midnight rounded-tl-3xl rounded-tr-3xl h-40">
                                    <p className="text-xl font-bold">BBM</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7589</p>
                                    <p className="text-1xs font-extralight">@bongvongmarks</p>
                                </div>
                            </div>
                            {/* Top 3 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 pt-12 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-green-700 flex items-center justify-center self-center">
                                    <img src={"https://avatars.githubusercontent.com/u/82669071?s=80&v=4"} className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
                                </div>
                                <div className="flex justify-center">
                                    <img src={rank_3_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                </div>
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tr-3xl rounded-br-3xl h-28">
                                    <p className="text-xl font-bold">ISD</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">6490</p>
                                    <p className="text-1xs font-extralight">@indzaesarah</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Top 4++ Div */}
                    <div className="flex flex-col items-center bg-bunker rounded-45px overflow-hidden">
                        <LeaderboardItem />
                        <LeaderboardItem />
                        <LeaderboardItem />
                    </div>
                </section>
            </main>
            <BottomNav />
        </>
    );
}
export default Leaderboard;