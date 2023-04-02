import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { db, auth } from "./firebase/firebase";

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
