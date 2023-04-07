import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML } from 'draft-convert';
import draftToHtml from 'draftjs-to-html';

import { db, auth } from '../../firebase/firebase';
import { setDoc, doc, collection } from 'firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";

function PostForm() {
    const [user] = useAuthState(auth);
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [convertedContent, setConvertedContent] = useState(null);

    useEffect(() => {
        let html = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(html);
    }, [editorState]);

    function createMarkup() {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        const markup = draftToHtml(rawContentState);
        return { __html: markup };
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const description = convertToRaw(editorState.getCurrentContent());
        const postsRef = doc(collection(db, "posts"))
        await setDoc(postsRef, {
            title: 'title',
            description: description,
            posterId: user.uid,
            entityId: 'entityId',
            images: [],
            sources: [],
            upvotes: null,
            createdAt: null,
            updatedAt: null,
            comments: null,
            flags: null,
            verifiedUpvotes: null,
            isMallicious: null,
            isFake: null
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
                    suggestions: [
                        { text: 'JavaScript', value: 'javascript', url: 'js' },
                        { text: 'Golang', value: 'golang', url: 'go' },
                    ],
                }}
            />
            <div
                className="preview"
                dangerouslySetInnerHTML={createMarkup(convertedContent)}>
            </div>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
}

export default PostForm;