import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Spinner } from '@chakra-ui/react'
import Post from "../../components/Post";
function Menu() {
    const [postsData, setPostsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams();
    const promiseID = params.pID;
    const [user] = useAuthState(auth);
    let location = useLocation();
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
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
            setIsLoading(false)
        }

        fetchData();
    }, [location]);
    return isLoading ?
        <div className='py-20 flex justify-center'>
            <div className="m-10"><Spinner /></div>
        </div>
        :
        postsData.length > 0 ?
                <main className='py-20 md:pb-0'>
                    {
                        postsData.map((i) => {
                            return <Post key={i.id} post={i} user={user} />
                        })
                    }
                </main>
            :
            <div className='py-20 flex justify-center'>
                <div className="m-10">No Promises Found</div>
            </div>
}
export default Menu;