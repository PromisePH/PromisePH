import React from 'react';
import draftToHtml from 'draftjs-to-html';

function Post(post) {
    const createMarkup = (raw) => {
        return { __html: draftToHtml(raw) };
    }

    return (
        <section className='py-1'>
            <h1 className='font-bold text-xl'>
                {post.title}
            </h1>
            <div
                className="preview"
                dangerouslySetInnerHTML={createMarkup(post.description)}>
            </div>

        </section>
    );
}

export default Post;