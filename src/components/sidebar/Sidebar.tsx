import React, { useState, useEffect } from "react";
import useResizeObserver from "use-resize-observer";

import Button from "../button/Button";
import DMCColours from "../../data/DMCColours.json";
import ColourBox from "./ColourBox";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import type { DMCColour } from "../../types/DMCColour";
import normaliseColours from "../../lib/svg/normaliseColours";
import eventBus from "../../lib/eventBus";
import UndoRedoTool from "../../lib/canvas/UndoRedoTool";

const Sidebar: React.FC = () => {
	const defaultDMC: DMCColour = {
		"#RGB": "",
		"Floss Name": "",
		DMC: "",
	};

	const [currPage, setCurrPage] = useState<number>(1);
	const [coloursPerPage, setColoursPerPage] = useState<number>(60);
	const [maxPage, setMaxPage] = useState(
		Math.ceil(DMCColours.length / coloursPerPage)
	);
	const [softColour, setSoftColour] = useState<DMCColour>(defaultDMC);
	const [hardColour, setHardColour] = useState<DMCColour>({
		"#RGB": "",
		"Floss Name": "",
		DMC: "",
	});
	const { ref } = useResizeObserver({
		onResize: ({ width }) => {
			if (width !== undefined)
				setColoursPerPage(
					Math.floor((width / 26) * 7) < 10
						? 10
						: Math.floor((width / 26) * 7)
				);
			setCurrPage(1);
		},
	});

	useEffect(() => {
		setMaxPage(Math.ceil(DMCColours.length / coloursPerPage));
	}, [coloursPerPage]);

	return (
		<div className="flex h-full min-w-[300px] basis-1/4 flex-col items-center justify-start overflow-y-scroll bg-white pt-3 shadow-inner">
			<h1 className="mb-1 border-b-2 text-xl">Colours</h1>
			<div className="flex w-[90%] flex-row flex-wrap items-center justify-start ">
				<div className="my-2 flex min-h-[100px] w-full flex-col justify-between rounded-md bg-stone-200 p-1 shadow-xl">
					<div className="flex flex-row items-start justify-start">
						<div className="flex flex-col items-start justify-start">
							<div
								className="min-h-[40px] min-w-[40px] rounded-lg border-2 border-black/20"
								style={{
									background:
										softColour["#RGB"] ||
										hardColour["#RGB"],
								}}
							></div>
							<p>
								<strong>
									{softColour.DMC || hardColour.DMC || "code"}
								</strong>
							</p>
						</div>
						<div className="flex flex-col px-2">
							<p className=" text-lg text-gray-800">
								<strong>
									{softColour["Floss Name"] ||
										hardColour["Floss Name"] ||
										"Name"}
								</strong>{" "}
								<span className="text-sm">
									{softColour["#RGB"] ||
										hardColour["#RGB"] ||
										"#hex"}
								</span>
							</p>
						</div>
					</div>
					<div className="grid w-full grid-cols-3">
						<p>
							<strong>R</strong>{" "}
							{softColour?.Red || hardColour?.Red || "---"}
						</p>
						<p>
							<strong>G</strong>{" "}
							{softColour?.Blue || hardColour?.Blue || "---"}
						</p>
						<p>
							<strong>B</strong>{" "}
							{softColour?.Green || hardColour?.Green || "---"}
						</p>
					</div>
				</div>
				<div ref={ref} className="h-[200px] items-start justify-center">
					<div className="flex w-full flex-row flex-wrap items-start justify-center">
						{DMCColours.slice(
							(currPage - 1) * coloursPerPage,
							currPage * coloursPerPage + 1 >
								DMCColours.length - 1
								? DMCColours.length
								: currPage * coloursPerPage + 1
						).map((e, i) => {
							return (
								<ColourBox
									key={i}
									hex={e["#RGB"]}
									onClick={() => setHardColour(e)}
									onMouseLeave={() =>
										setSoftColour(defaultDMC)
									}
									onMouseEnter={() => setSoftColour(e)}
								/>
							);
						})}
					</div>
				</div>
				<div className="flex w-full flex-row items-center justify-between">
					<Button
						onClick={() => {
							setCurrPage(
								currPage === 1 ? maxPage : currPage - 1
							);
						}}
						className="border-2 p-1"
						tooltip="previous page"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</Button>
					<p className="select-none">
						{currPage} of {maxPage}
					</p>
					<Button
						onClick={() => {
							setCurrPage(
								currPage === maxPage ? 1 : currPage + 1
							);
						}}
						className="border-2 p-1"
						tooltip="next page"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</Button>
				</div>
				<Button
					className="self-place-center my-2 w-full"
					filled
					onClick={() => {
						UndoRedoTool.addStateDefault();
						normaliseColours();
					}}
				>
					Normalise colours
				</Button>
				<div className="my-1 grid w-full grid-cols-2 gap-2">
					<Button
						className="self-place-center !m-0 w-full"
						filled
						onClick={() => {
							if (softColour["#RGB"])
								eventBus.dispatch(
									"setSelectedStrokeColour",
									softColour["#RGB"]
								);
							else if (hardColour["#RGB"])
								eventBus.dispatch(
									"setSelectedStrokeColour",
									hardColour["#RGB"]
								);
						}}
					>
						Set stroke
					</Button>
					<Button
						className="self-place-center !m-0 w-full"
						filled
						onClick={() => {
							if (softColour["#RGB"]) {
								eventBus.dispatch(
									"setSelectedFillColour",
									softColour["#RGB"]
								);
							} else if (hardColour["#RGB"]) {
								eventBus.dispatch(
									"setSelectedFillColour",
									hardColour["#RGB"]
								);
							}
						}}
					>
						Set fill
					</Button>
					<Button
						className="self-place-center !m-0 w-full p-0"
						filled
						onClick={() => {
							eventBus.dispatch("removeSelectedStroke", {});
						}}
					>
						Remove stroke
					</Button>
					<Button
						className="self-place-center !m-0 w-full"
						filled
						onClick={() => {
							eventBus.dispatch("removeSelectedFill", {});
						}}
					>
						Remove fill
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
