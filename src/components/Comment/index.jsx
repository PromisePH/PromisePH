import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from '../../firebase/firebase';
import MainCommentList from './MainCommentList';
function Comment(post) {
    const [user] = useAuthState(auth);
    const [updateComment, setUpdateComment] = useState(0);
    const [userComment, setUserComment] = useState([]);
    const [postComment, setPostComment] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const commentsRef = collection(db, "comment");
            // const q = query(commentsRef, where("postId", "==", post.id), orderBy("upvotes"));
            const commentsSnapshot = await getDocs(commentsRef);
            const newData = commentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const result = newData.filter((e) => {
                return e && e.postId.includes((post.id));
            });
            console.log(result);
            setPostComment(result);
        } fetchData();
    }, [updateComment]);

    function handleRootCommentSubmit(comment) {
        const commentRef = async () => {
            const comRef = await addDoc(collection(db, "comment"), {
                "commentorID": user.uid,
                "createdAt": new Date(),
                "upvotes": 0,
                "postId": post.id,
                "details": comment,
                "replies": []
            });
            return comRef;
        };
        commentRef();
        setUpdateComment(updateComment + 1);
        setUserComment([]);
    }
    return (
        <div className="flex justify-center w-full">
            <div className="max-w-3xl w-full flex flex-col p-4 bg-bunker rounded-lg">
                <div className='w-full bg-midnight rounded-lg p-2'>
                    <textarea
                        value={userComment}
                        placeholder='What do you think of this promise...'
                        className='h-28 p-2 rounded-lg bg-midnight w-full'
                        onChange={(e) => {
                            console.log(e.target.value);
                            setUserComment(e.target.value)
                        }} />

                    <div className='w-full my-2'>
                        <div className='bg-gray-600 rounded-full cursor-pointer float-right p-1 w-32 text-center hover:bg-orange-red'
                            onMouseDown={() => {
                                handleRootCommentSubmit(userComment);
                            }}>
                            Comment
                        </div>
                    </div>
                </div>
                <div className='pt-6'>
                    <div className='bg-midnight p-2 rounded-lg'>
                        {
                            postComment.map((com) => {
                                return (
                                    <>
                                        <MainCommentList info={com} />
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;