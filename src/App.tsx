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
			<main className="h-screen max-w-screen flex flex-col justify-start items-center overflow-y-clip overflow-x-hidden bg-repeating-pattern bg-stone-200">
				<Toolbar></Toolbar>
				<div className="flex flex-row h-full w-full ">
					<div className="basis-3/4 max-h-fit w-full m-3 bg-white shadow-md">
						<Canvas></Canvas>
					</div>
					<Sidebar state="SVG" />
				</div>
			</main>
		</div>
	);
}

export default App;
