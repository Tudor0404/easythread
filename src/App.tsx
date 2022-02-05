import React from "react";
import logo from "./logo.svg";
import "./styles/App.css";

import Toolbar from "./components/toolbar/Toolbar";
import Sidebar from "./components/sidebar/Sidebar";
import Canvas from "./components/canvas/Canvas";

function App() {
	return (
		<div>
			{/* <Head>
				<title>EasyThread</title>
				<meta name="EasyThread is a SVG to embroidery converter" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
					rel="stylesheet"
				/>
				<Script />
			</Head> */}
			<main className="max-w-screen bg-repeating-pattern flex h-screen flex-col items-center justify-start overflow-x-hidden overflow-y-clip bg-stone-200">
				<Toolbar></Toolbar>
				<div className="flex h-full w-full flex-row ">
					<div className="m-3 max-h-fit w-full basis-3/4 bg-white shadow-md">
						<Canvas></Canvas>
					</div>
					<Sidebar state="SVG" />
				</div>
			</main>
		</div>
	);
}

export default App;
