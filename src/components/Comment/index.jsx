import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from '../../firebase/firebase';
import MainCommentList from './MainCommentList';
import { useParams } from 'react-router';
import { useNavigate } from "react-router-dom";
function Comment(com) {
    const [user] = useAuthState(auth);
    const [updateComment, setUpdateComment] = useState(0);
    const [userComment, setUserComment] = useState([]);
    const [commentAlert, setCommentAlert] = useState(false);
    const [commentData, setCommentData] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const commentRef = collection(db, "comment");
        onSnapshot(commentRef, doc => {
            setCommentData(
                doc.docs.map(
                    doc => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                    }
                )
                .filter((comment) => {
                    return comment.postId.includes(com.id) && comment.rootComment.includes("true");
                }
                )
            );
        })
    }, [user, params.promiseID])
    function handleRootCommentSubmit(comment) {
        if (user) {
            const commentRef = async () => {
                const comRef = await addDoc(collection(db, "comment"), {
                    "commentorName": user.displayName,
                    "commentorID": user.uid,
                    "createdAt": new Date(),
                    "upvotes": [],
                    "downvotes": [],
                    "postId": params.promiseID,
                    "rootComment": "true",
                    "details": comment,
                    "replies": []
                });
                setCommentAlert(false);
                console.log(comRef.id);
            };
            if (comment.length > 0) {
                commentRef()
                setUpdateComment(updateComment + 1)
                setUserComment([])
            } else {
                setCommentAlert(true);
            }
        } else {
            navigate("/login");
        }
    }
    return (
        <div className="flex justify-center w-full">
            <div className="max-w-3xl w-full flex flex-col p-4 bg-bunker rounded-lg">
                <div className='w-full bg-midnight rounded-lg p-2' onBlur={() => setCommentAlert(false)}>
                    <textarea
                        value={userComment}
                        placeholder='What do you think of this promise...'
                        className='h-28 p-2 rounded-lg bg-midnight w-full'
                        onChange={(e) => {
                            console.log(e.target.value);
                            setUserComment(e.target.value)
                        }} />

                    <div className='w-full my-2 flex flex-row-reverse'>
                        <div className='bg-gray-600 rounded-full cursor-pointer float-right p-1 w-32 text-center hover:bg-orange-red'
                            onMouseDown={() => {
                                handleRootCommentSubmit(userComment);
                            }}>
                            Comment
                        </div>
                        <div className={`text-red-600 pr-36 ${commentAlert ? "" : "hidden"}`}>
                            Cannot Submit Empty Comment...
                        </div>

                    </div>
                </div>
                <div className='pt-6'>
                    <div className='bg-midnight p-2 rounded-lg'>
                        {
                            // commentLength ? isLoading ? <Spinner /> 
                            commentData ? commentData.length > 0 ? commentData.map((com) => {
                                return (
                                    <MainCommentList key={com.id} id={com.id} />
                                )
                            }) : <div className="w-full flex justify-center my-5">No Comments Found . . .</div>
                            : <div className="w-full flex justify-center my-5">No Comments Found . . .</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;