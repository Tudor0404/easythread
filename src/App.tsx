import { useEffect, useState } from "react";
import "./styles/App.css";
import useResizeObserver from "use-resize-observer";

import Toolbar from "./components/toolbar/Toolbar";
import Sidebar from "./components/sidebar/Sidebar";
import Canvas from "./components/canvas/Canvas";
import UndoRedoTool from "./lib/canvas/UndoRedoTool";
import eventBus from "./lib/eventBus";
import Modal from "./components/modal/Modal";

// TODO: add msg if screen is too small

function App() {
	const { ref, width = 1000, height = 1000 } = useResizeObserver();
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (width < 800 || height < 650) {
			setShowModal(true);
		} else {
			setShowModal(false);
		}
	}, [width, height]);

	function listener(ev: KeyboardEvent) {
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
	}

	useEffect(() => {
		window.addEventListener("keydown", listener);

		return window.removeEventListener("keydown", listener);
	}, []);

	return (
		<div ref={ref}>
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
			<Modal
				isOpen={showModal}
				setOpen={setShowModal}
				title={"WARNING"}
				description={
					"Using this website with a small screen may result in a bad experience"
				}
			></Modal>
		</div>
	);
}

export default App;
