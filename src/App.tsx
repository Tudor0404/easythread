import { useEffect } from "react";
import "./styles/App.css";

import Toolbar from "./components/toolbar/Toolbar";
import Sidebar from "./components/sidebar/Sidebar";
import Canvas from "./components/canvas/Canvas";
import UndoRedoTool from "./lib/canvas/UndoRedoTool";
import eventBus from "./lib/eventBus";

// TODO: add msg if screen is too small

function App() {
	useEffect(() => {
		window.addEventListener("keydown", (ev: KeyboardEvent) => {
			// keyboard shortcuts
			if (ev.ctrlKey && ev.key === "z") {
				ev.preventDefault();
				UndoRedoTool.undo();
			} else if (ev.ctrlKey && ev.key === "Z") {
				ev.preventDefault();
				UndoRedoTool.redo();
			} else if (ev.shiftKey && ev.key === "+") {
				ev.preventDefault();
				eventBus.dispatch("zoom", "in");
			} else if (ev.shiftKey && ev.key === "_") {
				ev.preventDefault();
				eventBus.dispatch("zoom", "out");
			} else if (ev.ctrlKey && ev.key === "o") {
				ev.preventDefault();
				eventBus.dispatch("resetView", {});
			}
		});
	}, []);

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
					<Sidebar />
				</div>
			</main>
		</div>
	);
}

export default App;
