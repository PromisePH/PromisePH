import React, { useState } from "react";
function MainCommentList(com) {
    const [activeReply, setActiveReply] = useState(false);
    console.log(com);
    return (
        <>
            <div className="text-justify">
                {com.info.details}
            </div>
            <div className='flex flex-row'>
                <div className={`${activeReply ? "" : "hidden"} w-full`}
                    onBlur={() => { setActiveReply(!activeReply) }}>
                    <div className="bg-gray-600 rounded-lg p-2">
                        <textarea className="w-full h-32 rounded-lg bg-gray-600 p-2" placeholder="Post a reply..."></textarea>
                        <div className="flex flex-row">
                            <div className="cursor-pointer text-xs w-12 bg-orange-red rounded-lg text-center  mx-1"
                                onMouseDown={() => setActiveReply(!activeReply)}>
                                Reply
                            </div>
                            <div className="cursor-pointer text-xs w-12 bg-orange-red rounded-lg text-center  mx-1"
                                onMouseDown={() => setActiveReply(!activeReply)}>
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`rounded-lg w-min cursor-pointer text-xs ${activeReply ? "hidden" : ""}`}
                    onMouseDown={() => setActiveReply(!activeReply)}>
                    Reply
                </div>
                {
                    com.replies ?
                        <div className={`rounded-lg w-min cursor-pointer text-xs ${activeReply ? "hidden" : ""}`}
                            onMouseDown={() => setActiveReply(!activeReply)}>
                            View {com.replies.length} Reply
                        </div>
                        : <></>
                }

            </div>
        </>
    );
}

export default MainCommentList;