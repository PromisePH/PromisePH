import React from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Spinner } from '@chakra-ui/react'
import Post from "../Post";
function Menu() {
    const [postsData, setPostsData] = useState("initial");
    const params = useParams();
    const promiseID = params.pID;
    useEffect(() => {
        async function fetchData() {
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const newData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const result = newData.filter((e) => {
                return e.title && e.title.toLowerCase().includes(promiseID.toLowerCase());
            });
            setPostsData(result);
        }

        fetchData();
    }, []);
    return postsData === "initial" ?
        <>
            <div className='py-16 flex justify-center'>
                <div className="m-10"><Spinner /></div>
            </div>
        </>
        :
        postsData.length > 0 ?
            <>
                <main className='py-16 md:pb-0'>
                    {
                        postsData.map((i) => {
                            return <Post info={i} key={i.id} />
                        })
                    }
                </main>
            </>
            :
            <>
                <div className='py-16 flex justify-center'>
                    <div className="m-10">NO PROMISE FOUND</div>
                </div>
            </>
}
export default Menu;