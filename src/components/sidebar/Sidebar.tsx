import React, { useState, useEffect } from "react";
import useResizeObserver from "use-resize-observer";

import Button from "../button/Button";
import DMCColours from "../../data/DMCColours.json";
import ColourBox from "./ColourBox";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import type { DMCColour } from "../../types/DMCColour";
import normaliseColours from "../../lib/svg/normaliseColour";
import removeOverlaps from "../../lib/svg/removeOverlap";

interface Props {
	state: "SVG" | "Embroidery";
}

const Sidebar: React.FC<Props> = (props) => {
	const defaultDMC: DMCColour = {
		"#RGB": "",
		"Floss Name": "",
		DMC: "",
	};

	const [currPage, setCurrPage] = useState(1);
	const [coloursPerPage, setColoursPerPage] = useState(60);
	const [maxPerPage, setMaxPerPage] = useState(
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
			setColoursPerPage(
				//@ts-ignore
				Math.floor((width / 26) * 11) < 10
					? 10
					: //@ts-ignore
					  Math.floor((width / 26) * 11)
			);
			setCurrPage(1);
		},
	});

	useEffect(() => {
		setMaxPerPage(Math.ceil(DMCColours.length / coloursPerPage));
	}, [coloursPerPage]);

	return (
		<div className="h-full min-w-1/4 shadow-inner bg-white flex flex-col justify-start items-center pt-3">
			<h1 className="text-xl border-b-2 mb-1">Colours</h1>
			<div className="flex flex-row flex-wrap justify-start items-center w-[90%] ">
				<div className="w-full flex flex-col justify-between p-1 shadow-xl bg-stone-200 rounded-md my-2 min-h-[120px]">
					<div className="flex flex-row items-start justify-start">
						<div className="flex flex-col justify-start items-start">
							<div
								className="min-h-[40px] min-w-[40px] rounded-lg"
								style={{
									background:
										softColour["#RGB"] ||
										hardColour["#RGB"],
								}}
							></div>
							<p>
								<strong>
									{softColour.DMC || hardColour.DMC}
								</strong>
							</p>
						</div>
						<div className="flex flex-col px-2">
							<p className=" text-lg text-gray-800">
								<strong>
									{softColour["Floss Name"] ||
										hardColour["Floss Name"]}
								</strong>{" "}
								<span className="text-sm">
									{softColour["#RGB"] || hardColour["#RGB"]}
								</span>
							</p>
						</div>
					</div>
					<div className="grid grid-cols-3 w-full">
						<p>
							<strong>R</strong>{" "}
							{softColour?.Red || hardColour?.Red}
						</p>
						<p>
							<strong>G</strong>{" "}
							{softColour?.Blue || hardColour?.Blue}
						</p>
						<p>
							<strong>B</strong>{" "}
							{softColour?.Green || hardColour?.Green}
						</p>
					</div>
				</div>
				<div ref={ref} className="justify-center items-start h-[300px]">
					<div className="w-full flex flex-row flex-wrap justify-center items-start">
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
				<div className="w-full flex flex-row justify-between items-center">
					<Button
						onClick={() => {
							setCurrPage(
								currPage - 1 === 0 ? maxPerPage : currPage - 1
							);
						}}
						className="p-1 border-2"
						tooltip="previous page"
					>
						<ChevronLeftIcon className="w-5 h-5" />
					</Button>
					<p>
						{currPage} of {maxPerPage}
					</p>
					<Button
						onClick={() => {
							setCurrPage(
								currPage + 1 === maxPerPage + 1
									? 1
									: currPage + 1
							);
						}}
						className="p-1 border-2"
						tooltip="next page"
					>
						<ChevronRightIcon className="w-5 h-5" />
					</Button>
				</div>
				<Button
					className="self-place-center w-full my-2"
					filled
					onClick={() => normaliseColours()}
				>
					Normalise colours
				</Button>
				<Button
					className="self-place-center w-full my-2"
					filled
					onClick={() => removeOverlaps()}
				>
					Remove Overlap
				</Button>
			</div>
		</div>
	);
};

export default Sidebar;