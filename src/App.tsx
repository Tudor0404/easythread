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
			<main className="h-screen max-w-screen flex flex-col justify-start items-center overflow-x-hidden bg-repeating-pattern bg-stone-200">
				<Toolbar></Toolbar>
				<div className="grid grid-cols-4 h-full w-full max-h-[1000px]">
					<div className="col-span-3 h-full w-full p-3">
						<div className="bg-white w-full h-full shadow-md">
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
