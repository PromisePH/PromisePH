import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";

function App() {
	return (
		<Router>
			<div className="App font-poppins">
				<RouterConfig />
			</div>
		</Router>
	);
}

export default App;
