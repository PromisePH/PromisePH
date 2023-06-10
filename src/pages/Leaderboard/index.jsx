import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from "../../firebase/firebase";

import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import LeaderboardItem from "../../components/LeaderboardItem";

import FallbackImage from '../../assets/img/default.jpg'
import rank_1_footer from "../../assets/img/rank_1_footer.png";
import rank_2_footer from "../../assets/img/rank_2_footer.png";
import rank_3_footer from "../../assets/img/rank_3_footer.png";
import CollectionsEnum from '../../constants/collections';
import EntityCollectionEnum from '../../constants/entity';

import {
    Skeleton,
    Image
} from "@chakra-ui/react";

function Leaderboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [firstPolitician, setFirstPolitician] = useState(null)
    const [secondPolitician, setSecondPolitician] = useState(null)
    const [thirdPolitician, setThirdPolitician] = useState(null)
    const [politicianRankings, setPoliticianRankings] = useState([])
    const [remainingPoliticianRankings, setRemainingPoliticianRankings] = useState([])

    let navigate = useNavigate();
    const routeChange = (id) => {
        navigate(`/politicians/${id}`);
    }

    useEffect(() => {
        const getPoliticianRankings = async () => {
            setIsLoading(true)

            const q = query(collection(db, CollectionsEnum.ENTITY), orderBy(EntityCollectionEnum.TIWALA_POINTS, "desc"));
            const querySnapshot = await getDocs(q);
            const rankings_data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const remaining_rankings_data = rankings_data.slice(3)

            setPoliticianRankings(rankings_data);
            setFirstPolitician(rankings_data[0]);
            setSecondPolitician(rankings_data[1]);
            setThirdPolitician(rankings_data[2]);
            setRemainingPoliticianRankings(remaining_rankings_data);

            setIsLoading(false)
        }

        getPoliticianRankings().catch(console.error)
    }, [])

    return (
        <>
            <NavBar />
            <main className='px-4 py-20 flex flex-col items-center'>
                <section className="w-full max-w-3xl">
                    {/* Top 3 Div */}
                    <div className="w-full flex flex-col items-center bg-bunker rounded-45px py-3 mb-4">
                        {
                            isLoading || politicianRankings.length == 0 ?
                                <div className="w-full pt-16 pb-3 px-4 flex justify-center items-center flex-col">
                                    <div className='w-full max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4'>
                                        <div className='flex flex-row w-full mb-10'>
                                            <Skeleton height='130px' width='160px' className='rounded-md' />
                                            <div className='flex flex-col w-full px-4'>
                                                <Skeleton height='30px' width='100%' className='rounded-md my-5' />
                                                <Skeleton height='30px' width='100%' className='rounded-md' />
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-end'>
                                            <Skeleton height='17px' width='85%' className='rounded-md my-5' />
                                        </div>
                                        <Skeleton height='17px' width='100%' className='rounded-md' />
                                        <Skeleton height='17px' width='100%' className='rounded-md my-5' />
                                        <Skeleton height='17px' width='100%' className='rounded-md' />
                                        <div className='w-full flex justify-start'>
                                            <Skeleton height='17px' width='70%' className='rounded-md my-5' />
                                        </div>
                                        <div className='w-full flex flex-row justify-evenly mt-10 mb-5'>
                                            <Skeleton height='17px' width='10%' className='rounded-md' />
                                            <Skeleton height='17px' width='10%' className='rounded-md' />
                                            <Skeleton height='17px' width='10%' className='rounded-md' />
                                        </div>
                                    </div>
                                    <div className='w-full max-w-3xl flex justify-center p-4 bg-bunker rounded-lg'>
                                        <div className='w-full flex flex-col items-center my-5'>
                                            <Skeleton height='20px' width='95%' className='rounded-md' />
                                            <Skeleton height='20px' width='95%' className='rounded-md my-10' />
                                            <Skeleton height='20px' width='95%' className='rounded-md' />
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    <h1 className="text-2xl text-center font-bold mb-2">Leaderboard</h1>
                                    <div className="flex flex-row h-72 px-5 w-full justify-center">
                                        {
                                            (firstPolitician == null && secondPolitician == null && thirdPolitician == null) ?
                                                <span className="flex justify-center items-center text-center text-lg font-bold">No Politicians Found</span> :
                                                <>
                                                    {/* Top 2 Div */}
                                                    {
                                                        secondPolitician ?
                                                            <div onClick={() => routeChange(secondPolitician.id)} className="flex flex-col h-full w-1/3 pt-8 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-orange-400 flex items-center justify-center self-center">
                                                                    <Image src={secondPolitician.imageURL} alt={secondPolitician.name} className='w-20 h-20 md:w-24 md:h-24 rounded-full object-cover' fallbackSrc={FallbackImage} />
                                                                </div>
                                                                <div className="flex justify-center">
                                                                    <img src={rank_2_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center bg-midnight bg-opacity-50 rounded-tl-3xl rounded-bl-3xl h-32 p-2">
                                                                    <p className="md:text-xl text-sm font-bold text-center">{secondPolitician.name}</p>
                                                                    <p className="md:text-xl text-1xs text-bruschetta-tomato font-extrabold text-center">{secondPolitician.tiwalaPoints} Tiwala Points</p>
                                                                    <p className="text-1xs font-extralight text-center">{secondPolitician.currentPosition}</p>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                    {/* Top 1 Div */}
                                                    {
                                                        firstPolitician ?
                                                            <div onClick={() => routeChange(firstPolitician.id)} className="flex flex-col h-full w-1/3 hover:cursor-pointer hover:bg-midnight rounded-t-3xl">
                                                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-red-600 flex items-center justify-center self-center">
                                                                    <Image src={firstPolitician.imageURL} alt={firstPolitician.name} className='w-20 h-20 md:w-24 md:h-24 rounded-full object-cover' fallbackSrc={FallbackImage} />
                                                                </div>
                                                                <div className="flex justify-center">
                                                                    <img src={rank_1_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center bg-midnight rounded-tl-3xl rounded-tr-3xl h-40 p-2">
                                                                    <p className="md:text-xl text-sm font-bold text-center">{firstPolitician.name}</p>
                                                                    <p className="md:text-xl text-1xs text-bruschetta-tomato font-extrabold text-center">{firstPolitician.tiwalaPoints} Tiwala Points</p>
                                                                    <p className="text-1xs font-extralight text-center">{firstPolitician.currentPosition}</p>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                    {/* Top 3 Div */}
                                                    {
                                                        thirdPolitician ?
                                                            <div onClick={() => routeChange(thirdPolitician.id)} className="flex flex-col h-full w-1/3 pt-12 hover:cursor-pointer hover:bg-midnight bg-opacity-50 rounded-t-3xl">
                                                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-green-700 flex items-center justify-center self-center">
                                                                    <Image src={thirdPolitician.imageURL} alt={thirdPolitician.name} className='w-20 h-20 md:w-24 md:h-24 rounded-full object-cover' fallbackSrc={FallbackImage} />
                                                                </div>
                                                                <div className="flex justify-center">
                                                                    <img src={rank_3_footer} className="md:w-6 md:h-6 w-4 h-4" />
                                                                </div>
                                                                <div className="flex flex-col items-center justify-center bg-midnight bg-opacity-50 rounded-tr-3xl rounded-br-3xl h-28 p-2">
                                                                    <p className="md:text-xl text-sm font-bold text-center">{thirdPolitician.name}</p>
                                                                    <p className="md:text-xl text-1xs text-bruschetta-tomato font-extrabold text-center">{thirdPolitician.tiwalaPoints} Tiwala Points</p>
                                                                    <p className="text-1xs font-extralight text-center">{thirdPolitician.currentPosition}</p>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </>
                                        }
                                    </div>
                                </>
                        }
                    </div>
                    {/* Top 4++ Div */}
                    <div className="flex flex-col items-center bg-bunker rounded-45px overflow-hidden">
                        {
                            remainingPoliticianRankings && remainingPoliticianRankings.length > 0 ?
                                remainingPoliticianRankings.map((politician) =>
                                    <LeaderboardItem key={politician.id} politician={politician} />
                                )
                                : null
                        }
                    </div>
                </section>
            </main>
            <BottomNav />
        </>
    );
}
export default Leaderboard;