import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";
<<<<<<< Updated upstream
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
=======
>>>>>>> Stashed changes

function App() {
	return (
		<Router>
			<main className="bg-black-pearl text-white font-poppins">
<<<<<<< Updated upstream
				<NavBar />
				<div className="App font-poppins py-16 md:pb-0">
=======
				<div className="App font-poppins">
>>>>>>> Stashed changes
					<RouterConfig />
				</div>
				<BottomNav />
			</main>
		</Router>
	);
}

export default App;
