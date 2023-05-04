import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import NavBar from "./components/NavBar/index";
import RouterConfig from "./navigation/RouterConfig";
function App() {
	return (
		<Router>
			
			<main className="bg-black-pearl text-white font-poppins">
			<NavBar />
				<div className="App font-poppins">
					<RouterConfig />
				</div>
			</main>
		</Router>
	);
}

export default App;
