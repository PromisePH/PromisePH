import React, { useState, useEffect } from 'react';

import { db,auth } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy, where, getDoc, doc } from "firebase/firestore";
import { useParams, useLocation } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';

import CollectionsEnum from "../../constants/collections";
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import Post from "../../components/Post";
import SearchItem from "../../components/PostForm/SearchItem";

function Politician() {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([]);
    const [entity, setEntity] = useState({});
    let location = useLocation();
    const params = useParams();
    const { politicianId } = params;

    useEffect(() => {
        const entityRef = doc(db, CollectionsEnum.ENTITY, politicianId);
        getDoc(entityRef).then((doc) => {
            if (doc.exists()) {
                setEntity(
                    {
                        id: doc.id,
                        ...doc.data(),
                    }
                );
            }
        });

        const q = query(
            collection(db, CollectionsEnum.POSTS),
            where("entityId", "==", politicianId),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push({ ...doc.data(), id: doc.id });
            });
            setPosts(posts);
        });
    }, [location]);

    return (
        <>
            <NavBar />
            <section className="px-4 py-20 md:pb-0 flex flex-col items-center w-full">
                <div className="w-full max-w-3xl p-4 rounded-lg">
                    <div className='p-4 rounded-lg bg-bunker mb-4'>
                        <SearchItem
                            key={entity.id}
                            result={entity}
                            setSelectedEntity={() => { }}
                        />
                    </div>
                    {
                        posts && posts.length > 0 ?
                            posts.map(post => (
                                <Post key={post.id} post={post} user={user}/>
                            ))
                            :
                            <p className='flex flex-col items-center justify-center w-full h-96 font-bold text-lg'>
                                No Promises Found
                            </p>
                    }
                </div>
            </section>
            <BottomNav />
        </>
    );
}

export default Politician;