import React from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import LeaderboardItem from "../../components/LeaderboardItem";

import Top1 from "../../assets/img/Top1.png";
import Top2 from "../../assets/img/Top2.png";
import Top3 from "../../assets/img/Top3.png";

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
                        <div className="flex flex-row h-60 px-5 w-full justify-center">
                            {/* Top 2 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 pt-4 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                <img src={Top2} className="w-28 self-center" />
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tl-3xl rounded-bl-3xl h-full">
                                    <p className="text-xl font-bold">RRD</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7298</p>
                                    <p className="text-1xs font-extralight">@rodrigsduts</p>
                                </div>
                            </div>
                            {/* Top 1 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 hover:cursor-pointer hover:bg-midnight rounded-t-3xl">
                                <img src={Top1} className="w-28 self-center" />
                                <div className="flex flex-col items-center bg-midnight rounded-tl-3xl rounded-tr-3xl h-full">
                                    <p className="text-xl font-bold">BBM</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7589</p>
                                    <p className="text-1xs font-extralight">@bongvongmarks</p>
                                </div>
                            </div>
                            {/* Top 3 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full w-1/3 pt-10 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                <img src={Top3} className="w-28 self-center" />
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tr-3xl rounded-br-3xl h-full">
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