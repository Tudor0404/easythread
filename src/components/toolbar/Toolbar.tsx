import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	LinkIcon,
	ZoomInIcon,
	ZoomOutIcon,
	ArrowsExpandIcon,
	DocumentIcon,
	DocumentAddIcon,
	CubeTransparentIcon,
	DocumentDownloadIcon,
} from "@heroicons/react/outline";
import Paper from "paper";

import Logo from "../../data/logo.png";
import TextInput from "../input/TextInput";
import Seperator from "../seperator/Seperator";
import OptionsDropdown from "./OptionsDropdown";
import Dropdown from "../dropdown/Dropdown";
import DropdownItem from "../dropdown/DropdownItem";
import options from "../../data/options.json";
import eventBus from "../../lib/eventBus";
import UndoRedoTool from "../../lib/canvas/UndoRedoTool";

interface Props {}

const Toolbar: React.FC<Props> = (props) => {
	const [filename, setFilename] = useState("");
	const [width, setWidth] = useState<number>(0);
	const [length, setLength] = useState<number>(0);
	const [isSizeLinked, setSizeLinked] = useState(true);
	const [isOutlineShown, setOutlineShown] = useState(false);

	useEffect(() => {
		if (Paper.project)
			Paper.project.getItems({}).forEach((e) => {
				e.selected = isOutlineShown;
			});
	}, [isOutlineShown]);

	const buttonStyle =
		"ease-in-out text-center transition-all duration-200 flex justify-center items-center";

	return (
		<div>
			<div className="w-screen bg-white shadow-sm">
				{/*Upper Toolbar*/}
				<div className="flex flex-row justify-between items-center px-3 pt-2 pb-1 border-b-[0.8px]">
					<div className="flex flex-row items-center justify-start">
						<div className="mr-2">
							<img
								src={Logo}
								className="row-span-2 "
								alt="EasyThread logo"
								width={36}
								height={36}
							></img>
						</div>

						<div className="flex flex-col">
							<div>
								<TextInput
									placeholder="Untitled File"
									className="text-lg rounded-none"
									value={filename}
									setValue={setFilename}
								></TextInput>
							</div>
							<div className="flex flex-row ">
								<Dropdown
									button={<Button>File</Button>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem label="New" />
									<DropdownItem label="Open" />
									<DropdownItem label="Save" />
									<DropdownItem label="export" />
								</Dropdown>
								<Dropdown
									button={<Button>Edit</Button>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem label="Undo" />
									<DropdownItem label="Redo" />
								</Dropdown>
								<Dropdown
									button={<Button>View</Button>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem label="Zoom in" />
									<DropdownItem label="Zoom out" />
									<DropdownItem label="Reset zoom" />
								</Dropdown>
								<Dropdown
									button={<Button>Help</Button>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem label="About" />
									<DropdownItem label="Credits" />
								</Dropdown>
							</div>
						</div>
					</div>
				</div>

				{/*Lower Toolbar*/}
				<div className="mt-0.5 stroke-gray-700 text-gray-700 flex flex-row items-center justify-start py-1 prose-p:leading-1 prose-p:text-center">
					{/*Undo*/}
					<Button className="!p-1 ml-4 mx-0.5" tooltip="undo">
						<ArrowLeftIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					{/*Redo*/}
					<Button className="!p-1 mx-0.5" tooltip="redo">
						<ArrowRightIcon className="h-5 w-5" stroke="inherit" />
					</Button>

					<Seperator />
					<Button className="!p-1 mx-0.5" tooltip="new file">
						<DocumentAddIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button className="!p-1 mx-0.5" tooltip="open file">
						<DocumentIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button className="!p-1 mx-0.5" tooltip="download file">
						<DocumentDownloadIcon
							className="h-5 w-5"
							stroke="inherit"
						/>
					</Button>

					<Seperator />
					{/*Sizing*/}
					<p className="mx-0.5">width</p>
					<TextInput
						setValue={setWidth}
						value={width}
						className="max-w-[70px] !px-0.5 !py-0 mx-0.5 !border-2 !border-opacity-100 font-mono focus:border-primary"
						type={"number"}
					></TextInput>
					<p className="mx-0.5">mm</p>
					<Button
						toggled={isSizeLinked}
						className="!p-1 mx-2"
						tooltip="maintain aspect-ratio"
						onClick={() => {
							setSizeLinked(!isSizeLinked);
						}}
					>
						<LinkIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<p className="mx-0.5">length</p>
					<TextInput
						setValue={setLength}
						value={length}
						className="max-w-[70px] !px-0.5 !py-0 mx-0.5 !border-2 !border-opacity-100 font-mono focus:border-primary"
						type={"number"}
					></TextInput>
					<p className="mx-0.5">mm</p>

					<Button
						className="!p-1 mx-0.5"
						tooltip="toggle outline"
						onClick={() => {
							setOutlineShown(!isOutlineShown);
						}}
					>
						<CubeTransparentIcon
							className="h-5 w-5"
							stroke="inherit"
						/>
					</Button>

					<Seperator />
					<Button
						className="!p-1 mx-0.5"
						tooltip="zoom in"
						onClick={() => {
							let newZoom = Paper.view.zoom;

							newZoom = Paper.view.zoom + 0.15;
							newZoom =
								newZoom > options.maxZoom
									? options.maxZoom
									: newZoom;

							Paper.view.zoom = newZoom;
						}}
					>
						<ZoomInIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button
						className="!p-1 mx-0.5"
						tooltip="zoom out"
						onClick={() => {
							let newZoom = Paper.view.zoom;

							newZoom = Paper.view.zoom - 0.15;
							newZoom =
								newZoom < options.minZoom
									? options.minZoom
									: newZoom;

							Paper.view.zoom = newZoom;
						}}
					>
						<ZoomOutIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button
						className="!p-1 mx-0.5"
						tooltip="reset view"
						onClick={() => {
							eventBus.dispatch("resetView", {});
						}}
					>
						<ArrowsExpandIcon
							className="h-5 w-5"
							stroke="inherit"
						/>
					</Button>

					<Seperator />
					<Button
						filled
						className="!py-0.5 !px-1 !mx-0.5"
						tooltip="convert to embroidery"
					>
						Convert
					</Button>
					<OptionsDropdown />
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
