import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { db, auth } from '../../firebase/firebase';
import { setDoc, doc, collection } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import CollectionsEnum from '../../constants/collections';

function PostForm() {
    const [user] = useAuthState(auth);
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    // Form submission handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        const description = convertToRaw(editorState.getCurrentContent());
        const postsRef = doc(collection(db, CollectionsEnum.POSTS))
        await setDoc(postsRef, {
            title: 'title',
            description: description,
            posterId: user.uid,
            entityId: 'entityId',
            images: [],
            sources: [],
            upvotes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: [],
            flags: [],
            verifiedUpvotes: [],
            isMallicious: false,
            isFake: false
        });
        console.log(`${postsRef.id} created successfully}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                    options: ['inline', 'blockType']
                }}
                hashtag={{
                    separator: ' ',
                    trigger: '#',
                }}
                mention={{
                    separator: ' ',
                    trigger: '@',
                }}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default PostForm;