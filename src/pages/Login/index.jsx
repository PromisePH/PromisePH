import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from '../../firebase/firebase';

function Login() {
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    useEffect(() => {
        if (user)
            navigate('/');
    }, [user]);

    const [formData, setFormData] = useState({
        password: '',
        username: ''
    });

    const { email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        }
    };

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={handleChange} />
                </div>
                <button type="submit">Login</button>
            </form>
        </main>
    );
}

export default Login;
