import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";

function PrivateRoute({ children }) {
    const [currentUser] = useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);
    return (
        children ? currentUser : null
    );
}

export default PrivateRoute;
