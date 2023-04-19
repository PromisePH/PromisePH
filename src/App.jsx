import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";

function App() {
	return (
		<Router>
			<main className="bg-black-pearl text-white font-poppins">
				<NavBar />
				<div className="App font-poppins py-16 md:pb-0">
					<RouterConfig />
				</div>
				<BottomNav />
			</main>
		</Router>
	);
}

export default App;
