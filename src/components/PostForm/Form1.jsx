import React, { useState, useEffect } from 'react';

import { collection, query, orderBy, setDoc, doc, getDocs, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase/firebase';

import CollectionsEnum from '../../constants/collections';
import EntityCollectionEnum from '../../constants/entity';
import SearchItem from '../PostForm/SearchItem'

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

function Form1({ politicalEntity, setPoliticalEntity }) {
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [allPoliticalEntities, setAllPoliticalEntities] = useState([])
    const [politicalEntities, setPoliticalEntities] = useState([])
    const [filter, setFilter] = useState('')
    const [isError, setIsError] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [isCreatingEntity, setIsCreatingEntity] = useState(false)
    const toast = useToast()

    useEffect(() => {
        initializeEntities();
    }, []);

    const initializeEntities = async () => {
        if (politicalEntity) {
            setPoliticalEntities([politicalEntity])
        }

        // Query all entities
        const q = query(collection(db, CollectionsEnum.ENTITY), orderBy(EntityCollectionEnum.CREATED_AT, "desc"));
        const querySnapshot = await getDocs(q);

        // Filter the entities
        setAllPoliticalEntities([])
        querySnapshot.forEach((doc) => {
            const entity = {
                id: doc.id,
                ...doc.data()
            }
            setAllPoliticalEntities(prevEntities => [...prevEntities, entity])
        });

        if (!politicalEntity) {
            setPoliticalEntities(allPoliticalEntities)
        }
    }

    const setSelectedEntity = (result) => {
        // Set the political entity to be displayed and posted
        setPoliticalEntity(result)
        setPoliticalEntities([result])
    }

    const handleSearchChange = (e) => {
        setFilter(e.target.value);
        // Guard clause for empty search
        if (filter.length == 0) {
            return
        }

        // Filter the entities
        setPoliticalEntities([])
        allPoliticalEntities.forEach((entity) => {
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
        tiwalaPoints: 0,
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

        try {
            // Check if the entity already exists
            const q = query(collection(db, CollectionsEnum.ENTITY), where(EntityCollectionEnum.NAME, "==", name));
            const querySnapshot = await getDocs(q);
            if (
                name.length == 0 ||
                querySnapshot.docs.length > 0
            ) {
                toast({
                    title: "Entity Already Exists.",
                    position: 'bottom-left',
                    status: 'error',
                    isClosable: true
                })
                setIsError(true);
                return
            }

            // Create the entity
            setIsCreatingEntity(true)

            // Upload the entity image to cloud storage
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageURL = await getDownloadURL(storageRef);


            // Add the entity to the database
            const entityRef = doc(collection(db, CollectionsEnum.ENTITY))
            const entityData = {
                ...formData,
                imageURL: imageURL
            }
            if (entityData.dateAppointed) {
                entityData.dateAppointed = new Date(entityData.dateAppointed)
            }
            await setDoc(entityRef, entityData);

            // Set the selected entity
            setSelectedEntity({
                ...entityData,
                id: entityRef.id
            })
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
                        <FormErrorMessage>Entity Name already exists.</FormErrorMessage>
                        :
                        <FormHelperText>
                            Enter the Entity Name of the Political Entity
                        </FormHelperText>}
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Current Position</FormLabel>
                    <Input type='text' name='currentPosition' value={currentPosition} onChange={handleEntityFormChange} />
                    <FormHelperText>
                        Enter the Current Position of the Political Entity
                    </FormHelperText>
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
                (filter.length != 0) || (politicalEntity) ?
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