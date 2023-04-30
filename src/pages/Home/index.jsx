import React, { useState, useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import CollectionsEnum from '../../constants/collections';
import PostForm from '../../components/PostForm';
import Post from '../../components/Post';
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import Avatar from '../../components/Avatar';

function Home() {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const q = query(collection(db, CollectionsEnum.POSTS), orderBy("createdAt", "desc"));
        onSnapshot(q, doc => {
            setPosts(doc.docs.map(
                doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    }
                }
            ));
        });

    }, [user]);

    return (
        <>
            <NavBar />
            <main className='px-4 py-16 md:pb-0 flex flex-col items-center w-full'>
                <section className='md:w-1/2 w-full'>
                    <div className='flex w-full gap-2 p-3 my-2 rounded-lg bg-bunker'>
                        <Avatar name={user.displayName} />
                        <button className='w-full bg-midnight p-2 text-left text-periwinkle text-xs rounded-md'>Share a promise a politician has said</button>
                    </div>
                    {/* {
                        user ? <PostForm /> : null
                    } */}
                    {
                        posts.map(post =>
                            <Post key={post.id} {...post} />
                        )
                    }
                </section>
            </main>
            <BottomNav />
        </>
    );
}

export default Home;