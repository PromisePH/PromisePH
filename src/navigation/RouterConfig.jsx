import React from "react";
import {
	Route,
	Routes,
	Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Menu from "../pages/SearchMenu/Menu";
import Promise from "../pages/Promise";

const RouterConfig = () => {
	return (
		<Routes>
			<Route exact path="/" element={<Home />}></Route>
			<Route exact path="/login" element={<Login />}></Route>
			<Route exact path="/signup" element={<Signup />}></Route>
			<Route exact path="/profile" element={<Profile />}></Route>
			<Route exact path="/search/:pID" element={<Menu/>}/>
			<Route exact path="/promise/:promiseID" element={<Promise />}/>
			<Route path="*" element={<Navigate to="/" />}></Route>
		</Routes>
	);
}
export default RouterConfig;