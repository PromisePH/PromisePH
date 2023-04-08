import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "./firebase/firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
	const [user] = useAuthState(auth);

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route path="*" element={<Navigate to="/" />}></Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
