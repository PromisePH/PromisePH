import React from "react";
import { useNavigate } from "react-router-dom";
function SearchResult(data) {
    console.log(data);
    const navigate = useNavigate();
    return (<>
        <div key={data.info.id} className="bg-black-russian cursor-pointer"
            onMouseDown={() => {
                navigate(`/promise/${data.info.id}`);
            }}>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis p-2 h-10 w-full rounded-lg bg-black-russian hover:bg-aluminium "
                onMouseDown={() => {
                    navigate(`/promise/${data.info.id}`);
                }}>
                {function (title) {
                    return title;
                }(data.info.title)}
            </div>
            <hr />
        </div>
    </>);
}
export default SearchResult;