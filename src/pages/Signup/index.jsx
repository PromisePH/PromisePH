import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as RouteLink } from 'react-router-dom';
import {
    FormControl,
    FormLabel,
    Input,
    Link,
    Divider,
    Button,
    useToast
} from '@chakra-ui/react';

import PoliticianCards from '../../components/PoliticianCards';
import Logo from "../../assets/img/PromisePH_logo.png";

function Signup() {
    const [user] = useAuthState(auth);

    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    const toast = useToast()
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
            toast({
                title: "Signup Successful.",
                position: 'bottom-left',
                status: 'success',
                isClosable: true
            })
        } catch (error) {
            const errorMessage = error.message;
            console.error(errorMessage);
            toast({
                title: "Signup Failed.",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
        }
    };

    return (
        <main className='min-h-screen bg-black-pearl flex'>
            <section className='flex justify-center items-center gap-5 md:px-12 px-5 md:w-3/5 w-full z-10'>
                <div className='rounded-lg bg-black-pearl flex flex-col justify-center items-center gap-5 p-5 w-full'>
                    <div className='no-underline flex flex-row items-center'>
                        <img src={Logo} alt="PromisePH Logo" className="h-12 w-12" />
                        <span className='text-center ml-2 text-orange-red font-extrabold text-4xl'>
                            PromisePH
                            <div className='text-sm text-white text-start'>
                                Pangako o mapapako
                            </div>
                        </span>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-5 w-full'>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input type="username" name='username' isRequired={true} focusBorderColor='orange.600' value={username} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" name='email' isRequired={true} focusBorderColor='orange.600' value={email} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name='password' isRequired={true} focusBorderColor='orange.600' value={password} onChange={handleChange} />
                        </FormControl>
                        <Button
                            colorScheme="gray"
                            type='submit'
                        >
                            Signup
                        </Button>
                    </form>
                    <Divider orientation='horizontal' />
                    <Link as={RouteLink} to='/login' className='w-full' colorScheme="gray">
                        <Button
                            className='w-full'
                            type='submit'
                        >
                            Login
                        </Button>
                    </Link>
                </div>
            </section>

            <PoliticianCards />
        </main>
    );
}

export default Signup;
