import React from "react";
import {
	Route,
	Routes,
	Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Settings from "../pages/Settings";
import Menu from "../components/Search/menu";
import IndivPost from '../components/Search/IndivPost'
import PrivateRoute from "./PrivateRoute";

const RouterConfig = () => {
	return (
		<Routes>
			<Route exact path="/" element={<Home />}></Route>
			<Route exact path="/login" element={<Login />}></Route>
			<Route exact path="/signup" element={<Signup />}></Route>
			<Route exact path='/settings' element={<PrivateRoute />}>
				<Route path="/settings" element={<Settings />}></Route>
			</Route>
			<Route path="searchmenu/:pID" element={<Menu/>}/>
			<Route path="post/:postID" element={<IndivPost/>}/>
			<Route path="*" element={<Navigate to="/" />}></Route>
		</Routes>
	);
}

export default RouterConfig;