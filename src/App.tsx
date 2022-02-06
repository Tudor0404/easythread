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
