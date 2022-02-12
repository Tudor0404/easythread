import "./styles/App.css";

import Toolbar from "./components/toolbar/Toolbar";
import Sidebar from "./components/sidebar/Sidebar";
import Canvas from "./components/canvas/Canvas";

function App() {
	return (
		<div>
			<main className="max-w-screen bg-repeating-pattern flex h-screen flex-col items-center justify-start overflow-x-hidden overflow-y-clip bg-stone-200">
				<Toolbar></Toolbar>
				<div className="bg-repeating-pattern flex h-full w-full flex-row justify-between ">
					<div className="shadow-inset flex h-full w-full items-center justify-center shadow-md">
						<div className=" h-[calc(100%-20px)] w-[calc(100%-20px)]  bg-white">
							<Canvas></Canvas>
						</div>
					</div>
					<Sidebar state="SVG" />
				</div>
			</main>
		</div>
	);
}

export default App;
