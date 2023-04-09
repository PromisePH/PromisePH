import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";
import NavBar from "./components/NavBar";

function App() {
	return (
		<Router>
			<main className="bg-black-pearl text-white font-poppins">
				<NavBar />
				<div className="App font-poppins pt-16">
					<RouterConfig />
				</div>
			</main>
		</Router>
	);
}

export default App;
