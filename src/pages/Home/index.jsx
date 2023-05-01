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
    Text
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

    const [posts, setPosts] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [step, setStep] = useState(1);
    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    })
    const toast = useToast()
    useEffect(() => {
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

    const nextStep = () => {
        setStep(step + 1);
        setActiveStep(activeStep + 1);
    }

    const submit = () => {
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
            <main className='px-4 py-16 md:pb-0 flex flex-col items-center w-full'>
                <section className='md:w-1/2 w-full'>
                    {
                        user ?
                            <div className='flex w-full gap-2 p-3 my-2 rounded-lg bg-bunker'>
                                <Avatar name={user.displayName} />
                                <button onClick={onOpen} className='w-full bg-midnight p-2 text-left text-periwinkle text-xs rounded-md cursor-text'>
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
                    <Modal isOpen={isOpen} onClose={onClose} size='5xl' isCentered>
                        <ModalOverlay />
                        <ModalContent className='bg-bunker py-7'>
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
                                {step === 1 ? <Form1 setPoliticalEntity={setPoliticalEntity} /> : step === 2 ? <Form2 /> : <Form3 />}
                            </ModalBody>
                            <ModalFooter>
                                {
                                    step < 3 ?
                                        <Button colorScheme='blue' mr={3} onClick={nextStep}>
                                            Next
                                        </Button>
                                        :
                                        <Button colorScheme='blue' mr={3} onClick={submit}>
                                            Submit
                                        </Button>
                                }
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </section>
            </main>
            <BottomNav />
        </>
    );
}

export default Home;