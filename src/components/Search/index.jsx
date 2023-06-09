import React from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import { Spinner } from '@chakra-ui/react'
import '../../styles/index.css';
function SearchList(data) {
    const [postsData, setPostsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const q = query(collection(db, "posts"), where("isDeleted", "==", false));
            const postsSnapshot = await getDocs(q);
            const newData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const result = newData.filter((e) => {
                return e.title && e.title.toLowerCase().includes((data.val).toLowerCase());
            });
            setIsLoading(false);
            setPostsData(result);
        }
        fetchData();
    }, [data.val]);
    return isLoading && data.visible
        ? <div className="w-64 bg-bunker mt-10 p-1 rounded-md fixed border-2 border-solid border-rgb(65 72 78)">
            <div className="flex flex-col w-full">
                <div className="py-2 pr-1 flex justify-center">
                    <Spinner />
                </div>
            </div>
        </div>
        : (data.val && data.visible
            ? <div className="w-64 bg-bunker mt-10 p-1 rounded-md fixed border-2 border-solid border-rgb(65 72 78)">
                <div className="flex flex-col w-full">
                    {function (d) {
                        if (d.length > 0) {
                            return d.slice(0, 10).map((t) => {
                                return <SearchResult info={t} key={t.id} />;
                            })
                        } else {
                            return <div className="p-2">
                                No Promise Found
                            </div>;
                        }
                    }(postsData)
                    }
                </div>
            </div>
            :
            !data.val && data.visible ?
                <div className="w-64 bg-bunker mt-10 p-1 rounded-md fixed border-2 border-solid border-rgb(65 72 78)">
                    <div className="flex flex-col w-full">
                        <div className="p-2">
                            Search for a Promise
                        </div>
                    </div>
                </div>
                :
                null)
}
export default SearchList;