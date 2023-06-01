import React from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";

import Top1 from "../../assets/img/Top1.png";
import Top2 from "../../assets/img/Top2.png";
import Top3 from "../../assets/img/Top3.png";
import Top4 from "../../assets/img/Top4.png";
import Top5 from "../../assets/img/Top5.png";
import Top6 from "../../assets/img/Top6.png";

function Profile() {
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `politician/3J4PFiHd7nkhdkG7Nyzz`; 
      navigate(path);
    }

    return (
        <>
            <NavBar />
            <main className='md:px-4 py-20 md:pb-0 flex flex-col items-center'>
                <section className="pt-1 md:pt-16">
                    {/* Top 3 Div */}
                    <div className="flex flex-col items-center bg-bunker rounded-45px md:px-20 py-3 mb-4">
                        <h className="text-3xl md:text-5xl font-bold">Leaderboard</h>
                        <div className="flex flex-row h-60">
                            {/* Top 2 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full pt-4">
                                <img src={Top2} />
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tl-3xl rounded-bl-3xl h-full">
                                    <p className="text-xl font-bold">RRD</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7298</p>
                                    <p className="text-1xs font-extralight">@rodrigsduts</p>
                                </div>
                            </div>
                            {/* Top 1 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full">
                                <img src={Top1} />
                                <div className="flex flex-col items-center bg-midnight rounded-tl-3xl rounded-tr-3xl h-full">
                                    <p className="text-xl font-bold">BBM</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">7589</p>
                                    <p className="text-1xs font-extralight">@bongvongmarks</p>
                                </div>
                            </div>
                            {/* Top 3 Div */}
                            <div onClick={routeChange} className="flex flex-col h-full pt-10">
                                <img src={Top3} />
                                <div className="flex flex-col items-center bg-midnight bg-opacity-50 rounded-tr-3xl rounded-br-3xl h-full">
                                    <p className="text-xl font-bold">ISD</p>
                                    <p className="text-2xl text-bruschetta-tomato font-extrabold">6490</p>
                                    <p className="text-1xs font-extralight">@indzaesarah</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Top 4++ Div */}
                    <div className="flex flex-col items-center bg-bunker md:px-4 rounded-tl-45px rounded-tr-45px">
                        {/* Top 4 Div */}
                        <div onClick={routeChange} className="min-w-full flex flex-row border-b-2 md:pt-3 py-2 md:pb-3 md:mb-3 px-2 md:px-6 items-center">
                            <img className="pr-7" src={Top4} />
                            <div className="flex flex-col flex-grow">
                                <p className="text-xs md:text-xl font-bold">Leni Robredo</p>
                                <p className="text-1xs md:text-lg font-extralight">@letletilet</p>
                            </div>
                            <p className="text-2xl text-bruschetta-tomato font-extrabold md:pl-32">6296</p>
                        </div>
                        {/* Top 5 Div */}
                        <div onClick={routeChange} className="min-w-full flex flex-row border-b-2 md:pt-3 py-2 md:pb-3 md:mb-3 px-2 md:px-6 items-center">
                            <img className="pr-7" src={Top5} />
                            <div className="flex flex-col flex-grow">
                                <p className="text-xs md:text-xl font-bold">Mar Roxas</p>
                                <p className="text-1xs md:text-lg font-extralight">@maroxas</p>
                            </div>
                            <p className="text-2xl text-bruschetta-tomato font-extrabold  md:pl-32">5877</p>
                        </div>
                        {/* Top 6 Div */}
                        <div onClick={routeChange} className="min-w-full flex flex-row border-b-2 md:pt-3 py-2 md:pb-3 md:mb-3 px-2 md:px-6 items-center">
                            <img className="pr-7" src={Top6} />
                            <div className="flex flex-col flex-grow">
                                <p className="text-xs md:text-xl font-bol">Isko Moreno</p>
                                <p className="text-1xs md:text-lg font-extralight">@iskomnl</p>
                            </div>
                            <p className="text-2xl text-bruschetta-tomato font-extrabold md:pl-32">4542</p>
                        </div>
                    </div>
                </section>
            </main>
            <BottomNav />
        </>
    );
}
export default Profile;