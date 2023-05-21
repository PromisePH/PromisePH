import React, { useState, useEffect } from "react";

import { db } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import CollectionsEnum from "../../constants/collections";
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import SearchItem from "../../components/PostForm/SearchItem";
import { Spinner } from '@chakra-ui/react'

function PoliticiansList() {
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        try {
            setIsLoading(true);
            const q = query(collection(db, CollectionsEnum.ENTITY), orderBy("createdAt", "desc"));
            onSnapshot(q, (querySnapshot) => {
                const entities = [];
                querySnapshot.forEach((doc) => {
                    entities.push({ ...doc.data(), id: doc.id });
                });
                setEntities(entities);
            });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            <NavBar />
            <section className="px-4 py-20 md:pb-0 flex flex-col items-center w-full">
                <div className="w-full max-w-5xl bg-bunker p-4 rounded-lg">
                    <h1 className="text-2xl font-bold text-center pb-2">Politicians</h1>
                    {
                        isLoading ?
                            <Spinner /> :
                            entities && entities.length > 0 ?
                                entities.map(entity => (
                                    <SearchItem
                                        key={entity.id}
                                        result={entity}
                                        setSelectedEntity={() => {
                                            navigate(`/politicians/${entity.id}`)
                                        }}
                                    />
                                ))
                                :
                                <p className='flex flex-col items-center justify-center w-full h-96 font-bold text-lg'>
                                    No Politicians Found
                                </p>
                    }
                </div>
            </section>
            <BottomNav />
        </>
    );
}

export default PoliticiansList;