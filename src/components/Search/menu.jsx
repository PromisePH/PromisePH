import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import SearchPostList from "./sample";
function Menu() {
    const [postsData, setPostsData] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const promiseID = params.pID;
    useEffect(() => {
        async function fetchData() {
            const postsRef = collection(db, "posts");
            const postsSnapshot = await getDocs(postsRef);
            const newData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const result = newData.filter((e) => {
                return e.title && e.title.toLowerCase().includes(promiseID.toLowerCase());
            });
            setPostsData(result);
        }

        fetchData();
    }, []);
    return (
        <>
            <main className='py-16 md:pb-0'>
                {
                    postsData.map((i) => {
                        return (
                            <a onClick={() => {
                                navigate(`post/${i.id}`)
                            }}>
                                {i.title}
                            </a>
                        );
                    })
                }
            </main>
        </>
    );
}

export default Menu;