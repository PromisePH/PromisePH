import React, { useEffect } from 'react'
import { signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from '../../firebase/firebase';

function Home() {
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        }
    };

    return (
        <main>
            <h1>Home</h1>
            <button onClick={handleLogout}>
                Logout
            </button>
        </main>
    );
}

export default Home;