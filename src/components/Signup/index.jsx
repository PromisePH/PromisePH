import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const { email, password, username } = formData;

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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            await sendEmailVerification(userCredential.user);
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
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={handleChange} />
                </div>
                <button type="submit">Login</button>
            </form>
        </main>
    );
}

export default Signup;
