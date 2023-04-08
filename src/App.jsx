import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";

function App() {
	return (
		<Router>
			<div className="App">
				<RouterConfig />
			</div>
		</Router>
	);
}

export default App;
