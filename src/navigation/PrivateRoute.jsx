import React from "react";
import { Route, useNavigate } from "react-router-dom";
import { auth } from '../firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";

function PrivateRoute({ children, ...rest }) {
    const [currentUser] = useAuthState(auth);
    const navigate = useNavigate();
    if (!currentUser) {
        navigate('/login');
        return null;
    }
    return (
        <Route {...rest}
            render={({ location }) => (
                <>
                    {children}
                </>
            )}
        />
    );

}

export default PrivateRoute;
