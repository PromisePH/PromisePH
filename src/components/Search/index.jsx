import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Box, List, ListItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import '../../styles/index.css';
function SearchList(data) {
    const [postsData, setPostsData] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData() {
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const newData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const result = newData.filter((e) => {
                return e.title && e.title.toLowerCase().includes((data.val).toLowerCase());
            });
            setPostsData(result);
        }

        fetchData();
    }, [data.val]);




    if (data.val && data.visible) {
        return (
            <>
                <div className="search-bg mt-10 p-1 rounded-md fixed border-2 border-solid border-black">
                    <div className="table w-60">
                        {function (data) {
                            if (data.length > 0) {
                                return data.slice(0, 10).map((t) => {
                                    return <div className="table-row"
                                        onMouseDown={() => {
                                            navigate(`/post/${t.id}`);
                                        }}>
                                        <div className="p-2 rounded-lg"
                                            onMouseEnter={(e) => { e.target.style.backgroundColor = "#818384" }}
                                            onMouseLeave={(e) => { e.target.style.backgroundColor = "#1a1a1b" }}
                                            onMouseDown={() => {
                                                navigate(`/post/${t.id}`);
                                            }}>
                                            {function (title) {
                                                if (title.length > 22) {
                                                    return title.slice(0, 22) + "...";
                                                } else return title;
                                            }(t.title)}
                                        </div>
                                        <hr />
                                    </div>;
                                })
                            } else {
                                return <div className="table-row">
                                    <div className="p-2">
                                        {"No Promises Found"}
                                    </div>
                                    <hr />
                                </div>;
                            }
                        }(postsData)
                        }
                    </div>
                </div>
            </>
        );
    } else if (!data.val && data.visible) {
        return <> <div className="search-bg mt-10 p-1 rounded-md fixed border-2 border-solid border-black">
            <div className="table w-60">
                <div className="table-row">
                    <div className="p-2">
                        {"Search for a Promise"}
                    </div>
                </div>
            </div>
        </div>
        </>
    } return <></>;
}

export default SearchList;
