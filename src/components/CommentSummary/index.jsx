import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import CollectionsEnum from "../../constants/collections";

function CommentSummary({ comment_data }) {
    const [post, setPost] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPosts = async () => {
            const postRef = doc(db, CollectionsEnum.POSTS, comment_data.postId);
            const postDoc = await getDoc(postRef)
            setPost(postDoc.data())
        }
        fetchPosts()
    }, [])
    const d1 = comment_data.createdAt.toDate();
    const d2 = new Date();
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    const navigateToPost = () => {
        navigate(`/promise/${comment_data.postId}`);
    }

    return (
        <section onClick={navigateToPost} className="max-w-3xl w-full bg-bunker hover:bg-midnight shadow-md rounded-lg p-8 mb-4 cursor-pointer">
            <p className="font-bold">
                {post.title}
            </p>
            <div className="flex flex-row gap-10">
                <p>
                    {diffDays <= 31 ? diffDays + " dy. ago"
                        : yearDiff > 0 ? yearDiff + " yr. ago"
                            : totalMonthDiff <= 12 && totalMonthDiff != 0 ? totalMonthDiff + " mo. ago"
                                : diffDays + "dy. ago"
                    }
                </p>
                <p>
                    {comment_data.upvotes.length}
                    {comment_data.upvotes.length != 1 ? " upvotes" : " upvote"}
                </p>

            </div>
            <p className="mt-5 text-justify opacity-80">
                {comment_data.details}
            </p>

        </section>
    );
}

export default CommentSummary;