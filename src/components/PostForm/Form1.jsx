import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { setDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import CollectionsEnum from '../../constants/collections';
import {
    Input,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons';

import SearchItem from '../PostForm/SearchItem'
function Form1(setPoliticalEntity) {
    const [politicalEntities, setPoliticalEntities] = useState([])
    const [filter, setFilter] = useState([])

    const submitEntity = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        setPoliticalEntity(e.target.value)
    }

    const createNewEntity = async () => {
        const entityRef = doc(collection(db, CollectionsEnum.ENTITY))
        await setDoc(entityRef, {
            firstName: '',
            middleName: '',
            lastName: '',
            nickName: '',
            posts: [],
            currenPosition: '',
            termDuration: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            dateAppointed: new Date(),
            dateEndOfTerm: new Date(),
        });
    }

    const handleChange = async(e) => {
        setFilter(e.target.value);
        const q = query(collection(db, CollectionsEnum.ENTITY), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.filter((entity) => {
            if (entity.firstName.toLowerCase().includes(e.target.value.toLowerCase())) {
                return entity
            }
        })
        setPoliticalEntities(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    return (
        <>
            <form onSubmit={submitEntity}>
                <InputGroup >
                    <InputLeftElement
                        pointerEvents='none'
                    >
                        <Search2Icon color='gray.300' />
                    </InputLeftElement>
                    <Input type='search' placeholder='Search'  value={filter} onChange={handleChange} />
                </InputGroup>
                {
                    politicalEntities.map((result) => (
                        <SearchItem key={result.id} result={result} />
                    ))
                }
            </form>
        </>
    );
}

export default Form1;