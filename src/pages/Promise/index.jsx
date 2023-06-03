import React, { useEffect, useState } from 'react';
import { collection, doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, increment, setDoc, addDoc, getDoc } from 'firebase/firestore';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { db, auth } from '../../firebase/firebase';

import Comment from '../../components/Comment';
import NavBar from '../../components/NavBar';
import BottomNav from '../../components/BottomNav'
import CollectionsEnum from '../../constants/collections';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Link,
    ListItem,
    UnorderedList,
    Skeleton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    FormControl,
    FormLabel,
    FormHelperText,
    Button,
    useToast,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

function FallBackLinkPreview({ source }) {
    return (
        <Link href={source} isExternal className='break-all'>
            {source} <ExternalLinkIcon mx='2px' />
        </Link>
    )
}

function Promise() {
    const [user] = useAuthState(auth);

    // promise details state
    const [data, setPromiseData] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [politicalEntity, setPoliticalEntity] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()

    // judge promise state
    const [alreadyJudged, setAlreadyJudged] = useState(false);
    const [isFullfilled, setIsFullfilled] = useState(false);
    const [rating, setRating] = useState(0);
    const [judgeComment, setJudgeComment] = useState('');
    const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
    const [isPostingJudgement, setIsPostingJudgement] = useState(false);


    const navigate = useNavigate();
    const params = useParams();
    const toast = useToast()
    const ratingNumbers = [1, 2, 3, 4, 5];

    const updateView = async () => {
        const postRef = doc(db, 'posts', params.promiseID);
        await updateDoc(postRef, { views: increment(1) });

        const userDataRef = doc(db, CollectionsEnum.USER_DATA, user.uid);
        const userData = await getDoc(userDataRef)
        if (userData.exists() && userData.data().judgedPromises) {
            setAlreadyJudged(userData.data().judgedPromises.includes(params.promiseID));
        }
    }

    useEffect(() => {
        if (!user) {
            return;
        }

        setIsLoading(true);
        updateView();

        const postRef = doc(db, 'posts', params.promiseID);
        const comRef = collection(db, CollectionsEnum.COMMENTS);

        onSnapshot(postRef, (doc_data) => {
            const temp = doc_data.data();
            setPromiseData({ id: doc_data.id, ...temp });
            setIsActive(
                user
                    ? !!temp.upvotes.includes(user.uid)
                    : false
            );
            setViewCount(temp.views);
            setLikeCount(
                temp.upvotes
                    ? temp.upvotes.length
                    : 0
            );

            const politicalEntityRef = doc(db, CollectionsEnum.ENTITY, temp.entityId);
            getDoc(politicalEntityRef).then((doc) => {
                if (doc.exists()) {
                    setPoliticalEntity({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            });
        });

        onSnapshot(comRef, (doc) => {
            setCommentCount(
                doc.docs.map(doc => { return doc.data() })
                    .filter((q) => q.postId.includes(params.promiseID))
                    .length
            )
            setIsLoading(false);
        }
        );
    }, [user, params.promiseID]);

    const d1 = data.createdAt ? data.createdAt.toDate() : new Date();
    const d2 = new Date();
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    // Update Reaction
    const updatePostLike = async (liked) => {
        setIsActive(!isActive);
        const userDataRef = doc(db, CollectionsEnum.USER_DATA, user.uid)

        if (liked) {
            const postRef = doc(db, 'posts', params.promiseID);
            await updateDoc(postRef, { upvotes: arrayUnion(user.uid) });
            await setDoc(
                userDataRef,
                { upvotedPosts: arrayUnion(params.promiseID) },
                { merge: true }
            );
        } else {
            const postRef = doc(db, 'posts', params.promiseID);
            await updateDoc(postRef, { upvotes: arrayRemove(user.uid) });
            await setDoc(
                userDataRef,
                { upvotedPosts: arrayRemove(params.promiseID) },
                { merge: true }
            );
        }
    }

    // Heart Reaction Clicked
    const handleLike = () => {
        //If a User is Logged In
        if (user) {
            updatePostLike(!isActive);
            //If no User Logged In
        } else {
            navigate('/login');
        }
    }

    const handleJudgePromise = ({ isFilfilled }) => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (alreadyJudged) {
            toast({
                title: "You have already judged this promise",
                status: "error",
                position: 'bottom-left',
                isClosable: true,
            })
            return;
        }

        setIsJudgeModalOpen(true);
        setIsFullfilled(isFilfilled);
    }

    const submitJudgePromise = async (e) => {
        e.preventDefault();
        try {
            setIsPostingJudgement(true);

            // edit tiwala points for political entity
            const politicalEntityRef = doc(db, CollectionsEnum.ENTITY, data.entityId);
            await setDoc(
                politicalEntityRef,
                {
                    tiwalaPoints: increment(isFullfilled ? rating : -rating),
                },
                { merge: true }
            )

            // add judgement comment to comments collection
            const commentDoc = await addDoc(collection(db, CollectionsEnum.COMMENTS),
                {
                    commentorName: user.displayName,
                    commentorID: user.uid,
                    createdAt: new Date(),
                    upvotes: [],
                    downvotes: [],
                    postId: params.promiseID,
                    rootComment: 'true',
                    details: judgeComment,
                    isDeleted: false,
                    replies: [],
                }
            );

            // add judgement to user data
            const userDataRef = doc(db, CollectionsEnum.USER_DATA, user.uid)
            await setDoc(
                userDataRef,
                {
                    judgedPromises: arrayUnion(params.promiseID),
                    userComments: arrayUnion(commentDoc.id)
                },
                { merge: true }
            );

            toast({
                title: 'Judgment Submission Success.',
                position: 'bottom-left',
                status: 'success',
                isClosable: true
            })
        }
        catch (error) {
            const errorMessage = error.message;
            console.error(errorMessage);
            toast({
                title: 'Judgment Submission Failed.',
                position: 'bottom-left',
                status: 'error',
                isClosable: true
            })
        }
        finally {
            setRating(0);
            setJudgeComment('');
            setIsPostingJudgement(false);
            setIsJudgeModalOpen(false);
        }
    }

    return <>
        <NavBar />
        {
            isLoading
                ? <>
                    {/* Skeleton */}
                    <div className='flex pt-20 justify-center md:w-full'>
                        <div className='p-4 flex flex-col bg-bunker items-center w-full md:w-4/12'>
                            <div className='flex flex-row w-full mb-10'>
                                <Skeleton height='130px' width='160px' className='rounded-md' />
                                <div className='flex flex-col w-full px-4'>
                                    <Skeleton height='30px' width='100%' className='rounded-md my-5' />
                                    <Skeleton height='30px' width='100%' className='rounded-md' />
                                </div>
                            </div>
                            <div className='w-full flex justify-end'>
                                <Skeleton height='17px' width='85%' className='rounded-md my-5' />
                            </div>
                            <Skeleton height='17px' width='100%' className='rounded-md' />
                            <Skeleton height='17px' width='100%' className='rounded-md my-5' />
                            <Skeleton height='17px' width='100%' className='rounded-md' />
                            <div className='w-full flex justify-start'>
                                <Skeleton height='17px' width='70%' className='rounded-md my-5' />
                            </div>
                            <div className='w-full flex flex-row justify-evenly mt-10 mb-5'>
                                <Skeleton height='17px' width='10%' className='rounded-md' />
                                <Skeleton height='17px' width='10%' className='rounded-md' />
                                <Skeleton height='17px' width='10%' className='rounded-md' />
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center w-full mt-10'>
                        <div className='p-4 flex flex-col bg-bunker items-center w-full md:w-4/12'>
                            <div className='w-full flex flex-col items-center my-5'>
                                <Skeleton height='20px' width='95%' className='rounded-md' />
                                <Skeleton height='20px' width='95%' className='rounded-md my-10' />
                                <Skeleton height='20px' width='95%' className='rounded-md' />
                            </div>
                        </div>
                    </div>
                </>
                : <>
                    {/* Main Promise Div */}
                    <main className='pt-16 pb-3 px-4'>
                        <div className='max-w-3xl mx-auto bg-bunker shadow-md rounded-lg p-4 mb-4 mt-5'>

                            <div className='flex flex-row items-center mb-2'>
                                <a href={window.location.href} target='_blank' rel='noreferrer' className='flex items-center'>
                                    {/* Poster Name */}
                                    <span className='ml-2 text-white text-1xs text-sm font-bold'>{data.poster.name}</span>
                                </a>
                                <span className='ml-4 text-white text-xs text-sm italic'>
                                    {/* Post Date */}
                                    {diffDays <= 31
                                        ? diffDays + ' Day/s ago'
                                        : yearDiff > 0 ? yearDiff + ' Year/s ago'
                                            : totalMonthDiff <= 12 && totalMonthDiff != 0
                                                ? totalMonthDiff + ' Month/s ago'
                                                : diffDays + 'Day/s ago'
                                    }
                                </span>
                            </div>

                            {/* Promise Contents Div*/}
                            <div className='flex flex-row'>

                                {/* Post Image Div */}
                                <div className='w-28 h-28 rounded-lg object-scale-down'>
                                    <a href={`${data.image}`} target='_blank' rel='noreferrer' className=''>
                                        <img src={data.image} />
                                    </a>
                                </div>

                                {/* Promise Header Div */}
                                <div className='w-5/6 h-28 box-content box-border'>
                                    <div className='flex flex-col p-2 h-max min-w-0 max-w-max'>
                                        {/* Post Title Div */}
                                        <div className='md:text-2xl font-bold w-full max-w-full h-16 overflow-hidden overflow-ellipsis'>
                                            {data.title}
                                        </div>

                                        {/* Tags Row Div*/}
                                        <div className='flex flex-row h-12 max-h-10 items-center space-x-2'>
                                            {/* 'Verified By' Tags Div */}
                                            <div>
                                                {
                                                    data.verifiedUpvotes.map((verifiedBy) => {
                                                        return <div className='bg-caribbean-green border-radius-full rounded-full text-black text-1xs md:text-xs text-center font-bold p-2  transform hover:scale-110' key={verifiedBy}>
                                                            {verifiedBy}
                                                        </div>
                                                    }
                                                    )
                                                }
                                            </div>
                                            {/* Flair/Tags Div */}
                                            <div>
                                                {
                                                    data.tags.map((tag) => {
                                                        return <li className='bg-midnight border-radius-full rounded-full text-black font-bold text-1xs md:text-xs inline-block text-center px-2 py-1 transform hover:scale-110' key={tag}>
                                                            <span className='text-white'>{tag}</span>
                                                        </li>
                                                    }
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promise Description Div */}
                            <div className='mt-5 text-justify'>
                                {data.description}
                            </div>

                            {/* (View, Like, Comment) Count - View Sources - React Button Divs*/}
                            <div className='flex flex-wrap flex-row justify-evenly items-center pt-3 gap-12'>
                                <span className='text-white text-xs md:text-sm'>{viewCount} Views</span>
                                <span className='text-white text-xs md:text-sm'>{likeCount} Likes</span>
                                <span className='text-white text-xs md:text-sm'>{commentCount} Comments</span>
                                <button className='text-white text-xs md:text-sm underline cursor-pointer' onClick={onOpen}>View Sources</button>
                                <Popover>
                                    <PopoverTrigger>
                                        <button className='bg-orange-red text-white font-bold p-2 rounded-full hover:scale-110'>
                                            Judge
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className='bg-bunker'>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader className='text-center font-bold'>
                                            Is this Promise...
                                        </PopoverHeader>
                                        <PopoverBody className='flex justify-around px-5'>
                                            <button onClick={() => handleJudgePromise(true)} className='bg-caribbean-green text-white font-bold p-3 rounded-full hover:scale-110'>
                                                Fulfilled
                                            </button>
                                            <div className='text-center flex items-center justify-center font-bold'>
                                                or
                                            </div>
                                            <button onClick={() => handleJudgePromise(false)} className='bg-burning-orange text-white font-bold p-3 rounded-full hover:scale-110'>
                                                Unfulfilled
                                            </button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                                <button className='text-orange-red text-2xl transform hover:scale-110' onClick={() => handleLike()}>
                                    {isActive ? <AiFillHeart /> : <AiOutlineHeart />}
                                </button>
                            </div>

                        </div>
                    </main>
                    {/* Comment Section Div */}
                    <Comment id={params.promiseID} />
                    <BottomNav />
                </>
        }

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent className='bg-bunker py-7 mx-5'>
                <ModalHeader className='font-bold text-center text-3xl'>Sources</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <UnorderedList>
                        {
                            data && data.sources && data.sources.length > 0 ?
                                data.sources.map((source, key) => {
                                    return <ListItem key={key}>
                                        <FallBackLinkPreview source={source} />
                                    </ListItem>
                                })
                                : <ListItem className='text-2xl font-bold'>No Sources</ListItem>
                        }
                    </UnorderedList>
                </ModalBody>
            </ModalContent>
        </Modal>

        <Modal isOpen={isJudgeModalOpen} onClose={() => setIsJudgeModalOpen(false)} closeOnOverlayClick={false} lockFocusAcrossFrames={true}>
            <ModalOverlay />
            <ModalContent className='bg-bunker py-7 mx-5'>
                <ModalHeader className='font-bold text-center text-2xl'>Judge this Promise</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        politicalEntity ?
                            <form onSubmit={submitJudgePromise} className='flex flex-col gap-3'>
                                <FormControl isRequired>
                                    <FormLabel>Rating</FormLabel>
                                    <div className='flex flex-row justify-evenly'>
                                        {
                                            ratingNumbers.map((star) =>
                                                <div key={star} onClick={() => setRating(star)} className='text-orange-red text-3xl transform hover:scale-110'>
                                                    {
                                                        rating >= star ? <AiFillStar /> : <AiOutlineStar />
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                    <FormHelperText>
                                        How well did {politicalEntity.name} work on fulfilling this Promise?
                                    </FormHelperText>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Comment</FormLabel>
                                    <textarea
                                        className='h-28 p-2 rounded-lg bg-midnight w-full border-none outline-none'
                                        value={judgeComment}
                                        placeholder='What do you think of this promise...'
                                        onChange={(e) => { setJudgeComment(e.target.value) }}
                                    />
                                    <FormHelperText>
                                        Describe your thoughts on this Promise. What can be done better?
                                    </FormHelperText>
                                </FormControl>

                                <Button isLoading={isPostingJudgement} loadingText='Submiting' spinnerPlacement='start' type='submit' className='w-full hover:bg-orange-red'>
                                    Submit Judgement
                                </Button>
                            </form>
                            : null
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}
export default Promise;