import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import CollectionsEnum from '../../constants/collections';
import PostForm from '../../components/PostForm';
import Post from '../../components/Post';
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";

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

    const handleLogout = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            const errorMessage = error.message;
            alert(errorMessage);
        }
    };

    return (
        <>
            <NavBar />
            <main className='py-16 md:pb-0'>
                <h1>Home</h1>
                {
                    user ? <PostForm /> : null
                }
                {
                    posts.map(post =>
                        <Post key={post.id} {...post} />
                    )
                }
                {
                    user ? <button onClick={handleLogout}>Logout</button> : null
                }
            </main>
            <BottomNav />
        </>
    );
}

export default Home;