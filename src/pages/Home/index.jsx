import React, { useState, useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from '../../firebase/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import CollectionsEnum from '../../constants/collections';
import Post from '../../components/Post';
import NavBar from "../../components/NavBar";
import BottomNav from "../../components/BottomNav";
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
} from '@chakra-ui/react'

const steps = [
    { title: 'First', description: 'Political Entity' },
    { title: 'Second', description: 'Promise Details' },
    { title: 'Third', description: 'Sources' },
]

function Home() {
    const [user] = useAuthState(auth);

    // Post Forms state
    const [politicalEntity, setPoliticalEntity] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [sources, setSources] = useState([])

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

    // Home state
    const [posts, setPosts] = useState([])
    const toast = useToast()

    useEffect(() => {
        // Realtime listener for posts
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

    const closePostFormModal = () => {
        // Reset the post form onClose
        setPoliticalEntity(null)
        setTitle('')
        setDescription('')
        setSources([])
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
        if (step == 2 && ((title == '') || (description == ''))) {
            toast({
                title: "Please enter a title and description",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
            return
        }
        if (step == 3 && sources.length == 0) {
            toast({
                title: "Please add at least one source",
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
            return
        }
        setStep(step + 1);
        setActiveStep(activeStep + 1);
    }

    const submitPromisePost = () => {
        setStep(1);
        setActiveStep(0);
        toast({
            title: "Promise Posted Successfully",
            position: 'bottom-left',
            status: 'success',
            isClosable: true
        })
        onClose()
    }


    const activeStepText = steps[activeStep].description
    return (
        <>
            <NavBar />
            <main className='px-4 py-20 md:pb-0 flex flex-col items-center w-full'>
                <section>
                    {
                        user ?
                            <div className='flex w-full gap-2 p-3 my-2 rounded-lg bg-bunker'>
                                <Avatar name={user.displayName} />
                                <button onClick={() => setIsModalOpen(true)} className='w-full bg-midnight p-2 text-left text-periwinkle text-xs rounded-md cursor-text'>
                                    Share a promise a politician has said
                                </button>
                            </div>
                            : null
                    }
                    {
                        posts.map(post =>
                            <Post key={post.id} {...post} />
                        )
                    }
                    <Modal isOpen={isModalOpen} onClose={() => setIsAlertOpen(true)} closeOnOverlayClick={false} size='5xl'>
                        <ModalOverlay />
                        <ModalContent className='bg-bunker py-7 mx-5'>
                            <ModalCloseButton />
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
                                    step === 1 ? <Form1 setPoliticalEntity={setPoliticalEntity} /> :
                                        step === 2 ? <Form2 politicalEntity={politicalEntity} setTitle={setTitle} setDescription={setDescription} /> :
                                            <Form3 />
                                }
                            </ModalBody>
                            <ModalFooter>
                                {
                                    step > 1 ?
                                        <Button colorScheme='gray' mr={3} onClick={previousStep}>
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
                                        <Button colorScheme='blue' mr={3} onClick={submitPromisePost}>
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
                            <AlertDialogContent>
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