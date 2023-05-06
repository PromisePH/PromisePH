import React, { useState } from 'react';
import { collection, query, orderBy, setDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase/firebase';
import CollectionsEnum from '../../constants/collections';
import {
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    useToast,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons';

import SearchItem from '../PostForm/SearchItem'

function Form1({ setPoliticalEntity }) {
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [politicalEntities, setPoliticalEntities] = useState([])
    const [filter, setFilter] = useState('')
    const [isError, setIsError] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [isCreatingEntity, setIsCreatingEntity] = useState(false)
    const toast = useToast()

    const setSelectedEntity = (result) => {
        setPoliticalEntity(result)
        setPoliticalEntities([result])
    }

    const handleSearchChange = async (e) => {
        setFilter(e.target.value);
        if (filter.length == 0) {
            return
        }
        const q = query(collection(db, CollectionsEnum.ENTITY), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        setPoliticalEntities([])
        querySnapshot.forEach((doc) => {
            const entity = {
                id: doc.id,
                ...doc.data()
            }
            if (entity.name.toLowerCase().includes(filter.toLowerCase())) {
                setPoliticalEntities(prevEntities => [...prevEntities, entity]);
            }
        });
    };

    const [formData, setFormData] = useState({
        name: '',
        promises: [],
        fulfilledPromises: [],
        currentPosition: '',
        termDuration: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        dateAppointed: new Date(),
    });

    const {
        name,
        currentPosition,
        termDuration,
        dateAppointed,
    } = formData;

    const handleEntityFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = async (event) => {
        setImageFile(event.target.files[0]);
    };

    const createNewEntity = async (e) => {
        e.preventDefault();
        if (
            name.length == 0 ||
            currentPosition.length == 0 ||
            imageFile == null
        ) {
            setIsError(true);
            return
        }

        try {
            setIsCreatingEntity(true)

            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageURL = await getDownloadURL(storageRef);

            const entityRef = doc(collection(db, CollectionsEnum.ENTITY))
            const entityData = {
                ...formData,
                id: entityRef.id,
                imageURL: imageURL
            }

            await setDoc(entityRef, entityData);

            setSelectedEntity(entityData)
            toast({
                title: "Entity Creation Successful.",
                position: 'bottom-left',
                status: 'success',
                isClosable: true
            })
            setIsCreateMode(false)
        }
        catch (error) {
            const errorMessage = error.message;
            console.error(errorMessage);
            toast({
                title: "Entity Creation Failed.",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
        }
        finally {
            setIsCreatingEntity(false)
        }
    }

    if (isCreateMode) {
        return (
            <form onSubmit={createNewEntity} className='flex flex-col gap-3'>
                <FormControl isInvalid={isError} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' name='name' value={name} onChange={handleEntityFormChange} />
                    {isError ?
                        <FormErrorMessage>First Name is required.</FormErrorMessage>
                        :
                        <FormHelperText>
                            Enter the First Name of the Political Entity
                        </FormHelperText>}
                </FormControl>

                <FormControl isInvalid={isError} isRequired>
                    <FormLabel>Current Position</FormLabel>
                    <Input type='text' name='currentPosition' value={currentPosition} onChange={handleEntityFormChange} />
                    {isError ?
                        <FormErrorMessage>Current positionis required.</FormErrorMessage>
                        :
                        <FormHelperText>
                            Enter the Current Position of the Political Entity
                        </FormHelperText>}
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Political Entity Image</FormLabel>
                    <Input className='p-1' type='file' accept="image/*" onChange={handleImageChange} />
                    <FormHelperText>
                        Enter an Image of the Political Entity
                    </FormHelperText>
                </FormControl>

                <FormControl>
                    <FormLabel>Term Duration</FormLabel>
                    <Input type='text' name='termDuration' value={termDuration} onChange={handleEntityFormChange} />
                    <FormHelperText>
                        Enter the Term Duration of the Political Entity
                    </FormHelperText>
                </FormControl>

                <FormControl>
                    <FormLabel>Date Appointed</FormLabel>
                    <Input type='date' name='dateAppointed' value={dateAppointed} onChange={handleEntityFormChange} />
                    <FormHelperText>
                        Enter the Date Appointed of the Political Entity
                    </FormHelperText>
                </FormControl>

                <Button isLoading={isCreatingEntity} loadingText='Creating' spinnerPlacement='start' type='submit' className='w-full hover:bg-orange-red'>
                    Create Entity
                </Button>
            </form>
        )
    }

    return (
        <>
            <InputGroup >
                <InputLeftElement
                    pointerEvents='none'
                >
                    <Search2Icon color='gray.300' />
                </InputLeftElement>
                <Input type='search' placeholder='Search' value={filter} onChange={handleSearchChange} />
            </InputGroup>
            {
                (filter.length != 0) ?
                    (politicalEntities && politicalEntities.length > 0) ?
                        politicalEntities.map((result) => (
                            <SearchItem key={result.id} result={result} setSelectedEntity={setSelectedEntity} />
                        ))
                        :
                        <div className='w-full flex flex-col items-center gap-5 mt-5'>
                            <p className='text-center text-xl font-bold'>No Political Entities Found</p>
                            <Button className='w-min hover:bg-orange-red' onClick={() => setIsCreateMode(true)}>
                                Create new entity
                            </Button>
                        </div>
                    : null
            }
        </>
    );
}

export default Form1;