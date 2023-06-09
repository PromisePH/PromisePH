import React, { useEffect, useState } from "react";
import { query, where, collection, addDoc, onSnapshot, setDoc, arrayUnion, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase/firebase";
import CollectionsEnum from '../../constants/collections';
import CommentsCollectionEnum from "../../constants/comments";

import MainCommentList from "./MainCommentList";

function Comment(com) {

    const [user] = useAuthState(auth);
    const [userComment, setUserComment] = useState([]);
    const [commentAlert, setCommentAlert] = useState(false);
    const [commentData, setCommentData] = useState([]);
    const [postDeleteStatus, setPostDeleteStatus] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const commentRef = query(
            collection(
                db,
                CollectionsEnum.COMMENTS,
            ), 
            where(
                CommentsCollectionEnum.POST_ID,
                "==",
                com.id
            ),
            where(
                CommentsCollectionEnum.ROOT_COMMENT,
                "==",
                'true'
            )
        );
        setPostDeleteStatus(com.postIsDeleted);
        onSnapshot(commentRef, (doc) => {
            setCommentData(
                doc.docs
                    .map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    })
            );
        });
    }, [user, params.promiseID, com]);

    //Comment Submission
    const handleRootCommentSubmit = (comment) => {
        //If a User is Logged in
        if (user) {
            const commentRef = async () => {
                const commentDoc = await addDoc(collection(db, CollectionsEnum.COMMENTS),
                    {
                        commentorName: user.displayName,
                        commentorID: user.uid,
                        createdAt: new Date(),
                        upvotes: [],
                        downvotes: [],
                        postId: params.promiseID,
                        rootComment: "true",
                        details: comment,
                        isDeleted: false,
                        replies: [],
                    }
                );

                const userDataRef = doc(db, CollectionsEnum.USER_DATA, user.uid)
                await setDoc(
                    userDataRef,
                    { userComments: arrayUnion(commentDoc.id) },
                    { merge: true }
                );

                setCommentAlert(false);
            };

            // if the length of comment is greater than zero
            // Submit the comment and reset Comment Text Area
            if (comment.length > 0) {
                commentRef();
                setUserComment([]);
            }
            // else Show error Message
            else {
                setCommentAlert(true);
            }
        }
        //If No user Logged In 
        else {
            navigate("/login");
        }
    }
    return (
        <div className="flex justify-center w-full pb-16 px-4">
            <div className="max-w-3xl w-full flex flex-col p-4 bg-bunker rounded-lg">
                {/* Post a Comment Area*/}
                <div className={`w-full bg-midnight rounded-lg p-2 mb-6 ${postDeleteStatus ? "hidden" : ""}`} onBlur={() => setCommentAlert(false)}>
                    {/* Textarea for comment posting*/}
                    <textarea className="h-28 p-2 rounded-lg bg-midnight w-full border-none outline-none" value={userComment} placeholder="What do you think of this promise..." onChange={(e) => { setUserComment(e.target.value) }} />
                    <div className="w-full my-2 flex flex-row-reverse">
                        {/* Comment button for submission */}
                        <button className="bg-gray-600 rounded-full cursor-pointer float-right p-1 w-32 text-center hover:bg-orange-red" onMouseDown={() => { handleRootCommentSubmit(userComment) }}>
                            Comment
                        </button>
                        {/* Comment submission error message*/}
                        <div className={`text-red-600 pr-36 ${commentAlert ? "" : "hidden"}`}>
                            Cannot Submit Empty Comment...
                        </div>
                    </div>
                </div>

                {/* Comments Column List */}
                    <div className="bg-midnight p-3 rounded-lg">
                        {
                            commentData
                                ? commentData.length > 0
                                    ? commentData.map((com) => { return <MainCommentList key={com.id} id={com.id} parentId={null} postIsDeleted={postDeleteStatus} nestNum={0}/>  })
                                    : <div className="w-full flex justify-center my-5">No Comments Found . . .</div>
                                : <div className="w-full flex justify-center my-5">No Comments Found . . .</div>
                        }
                    </div>
            </div>
        </div>
    );
}
export default Comment;
