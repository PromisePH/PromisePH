import React, { useState, useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, storage } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy, setDoc, doc, arrayUnion, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import CollectionsEnum from '../../constants/collections';
import EntityCollectionEnum from "../../constants/entity";
import PostCollectionEnum from '../../constants/posts';
import Post from '../../components/Post';
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
import Filter from "../../components/Filter";
import Avatar from '../../components/Avatar';
import Form1 from '../../components/PostForm/Form1';
import Form2 from '../../components/PostForm/Form2';
import Form3 from '../../components/PostForm/Form3';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    useToast,
    Step,
    StepIcon,
    StepIndicator,
    StepSeparator,
    StepStatus,
    Stepper,
    useSteps,
    Text,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Spinner
} from '@chakra-ui/react'

const steps = [
    { title: 'First', description: 'Political Entity' },
    { title: 'Second', description: 'Promise Details' },
    { title: 'Third', description: 'Provide Credible Sources' },
]

function Home() {
    const [user] = useAuthState(auth);

    // Post Forms state
    const [politicalEntity, setPoliticalEntity] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [sources, setSources] = useState([''])
    const [tags, setTags] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [filter, setFilter] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Post UI state
    const { onClose } = useDisclosure()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const cancelRef = React.useRef()
    const [step, setStep] = useState(1);
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Home state
    const [posts, setPosts] = useState([])
    const toast = useToast()

    useEffect(() => {
        // Realtime listener for posts
        try {
            setIsLoading(true)
            let q;
            if (filter == null) {
                q = query(collection(db, CollectionsEnum.POSTS), orderBy(PostCollectionEnum.CREATED_AT, "desc"));
            }
            else if (filter == EntityCollectionEnum.POPULAR) {
                q = query(collection(db, CollectionsEnum.POSTS), orderBy(PostCollectionEnum.VIEWS, "desc"));
            }
            else if (filter == EntityCollectionEnum.NEW) {
                q = query(collection(db, CollectionsEnum.POSTS), orderBy(PostCollectionEnum.CREATED_AT, "desc"));
            }
            else {
                q = query(collection(db, CollectionsEnum.POSTS), where(PostCollectionEnum.TAGS, "array-contains", filter));
            }

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
        }
        catch (error) {
            console.error(error.message)
        }
        finally {
            setIsLoading(false);
        }
    }, [user, filter]);

    const closePostFormModal = () => {
        // Reset the post form onClose
        setPoliticalEntity(null)
        setTitle('')
        setDescription('')
        setImageFile(null)
        setSources([''])
        setTags([])
        setStep(1);
        setActiveStep(0);

        setIsAlertOpen(false);
        setIsModalOpen(false);
    }

    const previousStep = () => {
        setStep(step - 1);
        setActiveStep(activeStep - 1);
    }


    const nextStep = () => {
        // Validate form before next step
        if (step == 1 && politicalEntity == null) {
            toast({
                title: "Please select a political entity",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
            return
        }
        if (step == 2) {
            const errors = {
                '': 'Please enter a title.',
                [description]: 'Please enter a description.',
                [tags.length === 0]: 'Please add at least one tag.',
                [imageFile === null]: 'Please upload an image.',
            };

            const errorMessage = errors[true];
            if (errorMessage) {
                toast({
                    title: errorMessage,
                    position: 'bottom-left',
                    status: 'error',
                    isClosable: true
                });
                return;
            }
        }
        if (step == 3) {
            const errors = {
                [sources.length == 0]: 'Please add at least one credible source.',
                [tags.length == 0]: 'Please add at least one tag.',
                [sources.length == 1 && sources[0] == '']: 'Please add at least one credible source.',
            }
            const errorMessage = errors[true];
            if (errorMessage) {
                toast({
                    title: "Please add at least one credible source",
                    position: 'bottom-left',
                    status: 'error',
                    isClosable: true
                })
                return
            }
        }
        setStep(step + 1);
        setActiveStep(activeStep + 1);
    }

    const submitPromisePost = async () => {
        try {
            setIsSubmitting(true)
            setStep(step + 1);

            // Remove empty sources
            setSources(sources.filter(source => source !== ''))

            // Upload the entity image to cloud storage
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageURL = await getDownloadURL(storageRef);

            // Add the post to the database
            const userData = {
                id: user.uid,
                name: user.displayName,
            }

            const postRef = doc(collection(db, CollectionsEnum.POSTS))
            const postData = {
                title: title,
                description: description,
                image: imageURL,
                upvotes: [],
                views: 0,
                verifiedUpvotes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                poster: userData,
                comments: [],
                entityId: politicalEntity.id,
                sources: sources,
                tags: tags,
                isMallicious: false,
                isFake: false,
            }
            await setDoc(postRef, postData);

            // Save tags in the promise
            for (const tag of tags) {
                const tagRef = doc(db, CollectionsEnum.TAGS, tag)
                const tagData = {
                    posts: arrayUnion(postRef.id),
                    createdAt: new Date(),
                }
                await setDoc(tagRef, tagData);
            }

            // Close modal and show toast
            closePostFormModal()
            toast({
                title: "Promise Posted Successfully",
                position: 'bottom-left',
                status: 'success',
                isClosable: true
            })
        }
        catch (error) {
            toast({
                title: "Promise Post Failed",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    const activeStepText = steps[activeStep].description

    return (
        <>
            <NavBar />
            <main className='px-4 py-20 md:pb-0 flex flex-col items-center w-full'>
                <Filter setFilter={(filter) => { setFilter(filter) }} />
                <section className='max-w-3xl w-full'>
                    {
                        user ?
                            <div className='flex w-full gap-2 p-3 mb-2 rounded-lg bg-bunker'>
                                <Avatar name={user.displayName} styles='rounded-lg min-w-fit' />
                                <button onClick={() => setIsModalOpen(true)} className='w-full bg-midnight p-2 text-left text-periwinkle text-xs rounded-md cursor-text'>
                                    Share a promise a politician has said
                                </button>
                            </div>
                            : null
                    }
                    {
                        isLoading ?
                            <Spinner />
                            :
                            posts.length > 0 ?
                                posts.map(post =>
                                    <Post key={post.id} post={post} user={user} />
                                )
                                :
                                <p className='flex flex-col items-center justify-center w-full h-96 font-bold text-lg'>
                                    No Promises Found
                                </p>
                    }
                    <Modal isOpen={isModalOpen} onClose={() => setIsAlertOpen(true)} closeOnOverlayClick={false} size='5xl'>
                        <ModalOverlay />
                        <ModalContent className='bg-bunker py-7 mx-5'>
                            <ModalCloseButton isDisabled={isSubmitting} />
                            <ModalHeader>
                                <Stepper size='sm' index={activeStep} gap='0'>
                                    {steps.map((step, index) => (
                                        <Step key={index} gap='0'>
                                            <StepIndicator>
                                                <StepStatus complete={<StepIcon />} />
                                            </StepIndicator>
                                            <StepSeparator _horizontal={{ ml: '0' }} />
                                        </Step>
                                    ))}
                                </Stepper>
                                <Text>
                                    Step {activeStep + 1}: <b>{activeStepText}</b>
                                </Text>
                            </ModalHeader>
                            <ModalBody>
                                {
                                    step === 1 ? <Form1 politicalEntity={politicalEntity} setPoliticalEntity={setPoliticalEntity} /> :
                                        step === 2 ? <Form2
                                            politicalEntity={politicalEntity}
                                            title={title}
                                            setTitle={setTitle}
                                            description={description}
                                            tags={tags}
                                            setTags={setTags}
                                            setDescription={setDescription}
                                            setImageFile={setImageFile}
                                        /> :
                                            <Form3 sources={sources} setSources={setSources} />
                                }
                            </ModalBody>
                            <ModalFooter>
                                {
                                    step > 1 ?
                                        <Button isDisabled={isSubmitting} colorScheme='gray' mr={3} onClick={previousStep}>
                                            Previous
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    step < 3 ?
                                        <Button colorScheme='blue' mr={3} onClick={nextStep}>
                                            Next
                                        </Button>
                                        :
                                        <Button isLoading={isSubmitting} loadingText='Posting' colorScheme='blue' mr={3} onClick={submitPromisePost}>
                                            Submit
                                        </Button>
                                }
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <AlertDialog
                        isOpen={isAlertOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent className='bg-bunker mx-5'>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Quit Promise Post
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure? You cannot undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className='bg-orange-red'
                                        onClick={closePostFormModal}
                                        ml={3}
                                    >
                                        Quit
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </section>
            </main>
            <BottomNav />
        </>
    );
}

export default Home;