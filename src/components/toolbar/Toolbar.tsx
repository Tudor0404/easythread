import React, { useEffect, useState, useRef } from "react";
import Button from "../button/Button";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ZoomInIcon,
	ZoomOutIcon,
	ArrowsExpandIcon,
	DocumentAddIcon,
	CubeTransparentIcon,
	DocumentDownloadIcon,
} from "@heroicons/react/outline";
import Paper from "paper";
import FileSaver from "file-saver";
import { Oval } from "react-loader-spinner";

import Logo from "../../data/logo.png";
import TextInput from "../input/TextInput";
import Seperator from "../seperator/Seperator";
import OptionsDropdown from "./OptionsDropdown";
import Dropdown from "../dropdown/Dropdown";
import DropdownItem from "../dropdown/DropdownItem";
import eventBus from "../../lib/eventBus";
import UndoRedoTool from "../../lib/canvas/UndoRedoTool";
import NumberInput from "../input/NumberInput";
import removeOverlap from "../../lib/svg/removeOverlap";
import Modal from "../modal/Modal";

//TODO: handle downloading files better, set metadata, set filename if empty, check if file ext. is correct, remove file ext. from title at start

interface Props {}

const Toolbar: React.FC<Props> = (props) => {
	const [filename, setFilename] = useState<string>("");
	const [width, setWidth] = useState<string>("");
	const [height, setHeight] = useState<string>("");
	const [isOutlineShown, setOutlineShown] = useState<boolean>(false);
	const [isUndo, setUndo] = useState<boolean>(false);
	const [isRedo, setRedo] = useState<boolean>(false);
	const [areItemsSelected, setItemsSelected] = useState<boolean>(false);
	const [stroke, setStroke] = useState<string>("");
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

	const [isConvertToEmbroidery, setConvertToEmbroidery] =
		useState<boolean>(true);
	const [isRemoveOverlap, setRemoveOverlap] = useState<boolean>(true);
	const [isAverageOutColours, setAverageOutColours] = useState<boolean>(true);

	useEffect(() => {
		if (Paper.project)
			Paper.project.getItems({}).forEach((e) => {
				e.selected = isOutlineShown;
			});
		eventBus.dispatch("selectedItemsChanged", {});
	}, [isOutlineShown]);

	useEffect(() => {
		eventBus.on(
			"setSvgBounds",
			({ width, height }: { width: number; height: number }) => {
				setWidth(width.toFixed(3));
				setHeight(height.toFixed(3));
			}
		);

		eventBus.on("undoAvailable", (state: boolean) => {
			setUndo(state);
		});

		eventBus.on("redoAvailable", (state: boolean) => {
			setRedo(state);
		});

		eventBus.on("initialFilename", (title: string) => {
			setFilename(title);
		});

		eventBus.on("selectedItemsChanged", () => {
			let len = Paper.project.selectedItems.length;

			// update the stroke input, if multiple items with different widths are selected, leave it empty
			if (len > 0) {
				setItemsSelected(true);
				let strokeWidth: string =
					Paper.project.selectedItems[0].strokeWidth.toString();

				if (len > 1) {
					for (let i = 1; i < len; i++) {
						if (
							Paper.project.selectedItems[
								i
							].strokeWidth.toString() !== strokeWidth
						) {
							strokeWidth = "";
							break;
						}
					}
				}
				setStroke(strokeWidth);
			} else setItemsSelected(false);
		});

		eventBus.on("conversionFinished", () => {
			setModalOpen(false);
		});

		return eventBus.remove(
			[
				"setSvgBounds",
				"undoAvailable",
				"redoAvailable",
				"selectedItemsChanged",
				"initialFilename",
				"conversionFinished",
			],
			() => {}
		);
	}, []);

	useEffect(() => {
		if (stroke !== "") {
			Paper.project.selectedItems.forEach((e) => {
				e.strokeWidth = parseFloat(stroke);
			});
		}
	}, [stroke]);

	function saveFileSvg() {
		if (Paper.project.layers.length < 0) return;

		let markup = Paper.project
			.exportSVG({
				bounds: "content",
				asString: true,
			})
			.toString();

		FileSaver(new Blob([markup], { type: "image/svg+xml" }), filename);
	}

	// updates the dimensions of the SVG on enter
	function onEnterDimensions(e: KeyboardEvent) {
		if (e.key === "Enter") {
			try {
				UndoRedoTool.addStateDefault();
				const initWidth = Paper.project.layers[0].strokeBounds.width;
				const initHeight = Paper.project.layers[0].strokeBounds.height;

				const widthMultiple =
					Number(
						((parseFloat(width) - initWidth) / initWidth).toFixed(
							10
						)
					) + 1;
				const heightMultiple =
					Number(
						(
							(parseFloat(height) - initHeight) /
							initHeight
						).toFixed(10)
					) + 1;

				const newWidth = Number(
					(
						initWidth *
						(widthMultiple === 1 ? heightMultiple : widthMultiple)
					).toFixed(3)
				);

				const newHeight = Number(
					(
						initHeight *
						(widthMultiple === 1 ? heightMultiple : widthMultiple)
					).toFixed(3)
				);

				let rectBounds = new Paper.Rectangle(
					Paper.project.view.bounds.width / 2 - newWidth / 2,
					Paper.project.view.bounds.height / 2 - newHeight / 2,
					newWidth,
					newHeight
				);

				Paper.project.layers[0].fitBounds(rectBounds);

				Paper.project.layers[0].position = new Paper.Point(
					Paper.view.viewSize.width / 2,
					Paper.view.viewSize.height / 2
				);

				if (rectBounds) {
					setHeight(rectBounds.height.toFixed(3));
					setWidth(rectBounds.width.toFixed(3));
				}

				eventBus.dispatch("resetCenter", {});
			} catch {}
		}
	}

	useEffect(() => {
		if (isModalOpen) {
			setTimeout(
				() =>
					eventBus.dispatch("convertSvg", {
						convertToEmbroidery: isConvertToEmbroidery,
						removeOverlap: isRemoveOverlap,
						averageColours: isAverageOutColours,
					}),
				500
			);
		}
	}, [isModalOpen]);

	const buttonStyle =
		"bg-black bg-opacity-0 text-black hover:bg-opacity-10 rounded-md px-1.5 text-center transition-all duration-200 ease-in-out";

	return (
		<div>
			<div className="w-screen bg-white shadow-sm">
				{/*Upper Toolbar*/}
				<div className="flex flex-row items-center justify-between border-b-[0.8px] px-3 pt-2 pb-1">
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
									className="rounded-none text-lg"
									value={filename}
									setValue={setFilename}
								></TextInput>
							</div>
							<div className="flex flex-row ">
								<Dropdown
									button={<p>File</p>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem
										label="Open SVG"
										onClick={() => {
											eventBus.dispatch(
												"openLocalFile",
												{}
											);
										}}
									/>
									<DropdownItem
										label="Save SVG"
										onClick={saveFileSvg}
									/>
									<DropdownItem
										label="Save EXP"
										onClick={() => {
											eventBus.dispatch(
												"saveExp",
												filename
											);
										}}
									/>
								</Dropdown>
								<Dropdown
									button={<p>Edit</p>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem
										label="Undo"
										disabled={!isUndo}
										onClick={UndoRedoTool.undo}
									/>
									<DropdownItem
										label="Redo"
										disabled={!isRedo}
										onClick={UndoRedoTool.redo}
									/>
									<DropdownItem
										label="Remove overlap"
										onClick={removeOverlap}
									/>
								</Dropdown>
								<Dropdown
									button={<p>View</p>}
									buttonStyle={buttonStyle}
									align="left"
									contentStyle="min-w-[150px]"
								>
									<DropdownItem
										label="Zoom in"
										onClick={() => {
											eventBus.dispatch("zoom", "in");
										}}
									/>
									<DropdownItem
										label="Zoom out"
										onClick={() => {
											eventBus.dispatch("zoom", "out");
										}}
									/>
									<DropdownItem
										label="Reset zoom"
										onClick={() => {
											eventBus.dispatch("resetView", {});
										}}
									/>
								</Dropdown>
								<Dropdown
									button={<p>Help</p>}
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
				<div className="prose-p:leading-1 prose-p:text-center mt-0.5 flex flex-row items-center justify-start stroke-gray-700 py-1 text-gray-700">
					{/*Undo*/}
					<Button
						className="mx-0.5 ml-4 !p-1"
						tooltip="undo"
						disabled={!isUndo}
						onClick={() => {
							UndoRedoTool.undo();
						}}
					>
						<ArrowLeftIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					{/*Redo*/}
					<Button
						className="mx-0.5 !p-1"
						tooltip="redo"
						disabled={!isRedo}
						onClick={() => {
							UndoRedoTool.redo();
						}}
					>
						<ArrowRightIcon className="h-5 w-5" stroke="inherit" />
					</Button>

					<Seperator />
					<Button
						className="mx-0.5 !p-1"
						tooltip="open file"
						onClick={() => {
							eventBus.dispatch("openLocalFile", {});
						}}
					>
						<DocumentAddIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button
						className="mx-0.5 !p-1"
						tooltip="download file"
						onClick={saveFileSvg}
					>
						<DocumentDownloadIcon
							className="h-5 w-5"
							stroke="inherit"
						/>
					</Button>

					<Seperator />
					{/*Sizing*/}
					<p className="mx-0.5">width</p>
					<NumberInput
						setValue={setWidth}
						value={width}
						onKeyUp={onEnterDimensions}
						className="focus:border-primary mx-0.5 max-w-[70px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
					></NumberInput>
					<p className="mx-0.5">mm</p>
					<p className="mx-0.5 ml-2">height</p>
					<NumberInput
						setValue={setHeight}
						onKeyUp={onEnterDimensions}
						value={height}
						className="focus:border-primary mx-0.5 max-w-[70px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
					></NumberInput>
					<p className="mx-0.5">mm</p>

					<Button
						className="mx-0.5 !p-1"
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
						className="mx-0.5 !p-1"
						tooltip="zoom in"
						onClick={() => {
							eventBus.dispatch("zoom", "in");
						}}
					>
						<ZoomInIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button
						className="mx-0.5 !p-1"
						tooltip="zoom out"
						onClick={() => {
							eventBus.dispatch("zoom", "out");
						}}
					>
						<ZoomOutIcon className="h-5 w-5" stroke="inherit" />
					</Button>
					<Button
						className="mx-0.5 !p-1"
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
						className="!mx-0.5 !py-0.5 !px-1"
						tooltip="convert to embroidery"
						disabled={isModalOpen}
						onClick={() => {
							setModalOpen(true);
						}}
					>
						Convert
					</Button>
					<OptionsDropdown
						isAverageOutColours={isAverageOutColours}
						setAverageOutColours={setAverageOutColours}
						isConvertToEmbroidery={isConvertToEmbroidery}
						setConvertToEmbroidery={setConvertToEmbroidery}
						isRemoveOverlap={isRemoveOverlap}
						setRemoveOverlap={setRemoveOverlap}
					/>
					{areItemsSelected && (
						<>
							<Seperator />
							<p className="mx-0.5">stroke</p>
							<NumberInput
								setValue={setStroke}
								value={stroke}
								className="focus:border-primary mx-0.5 max-w-[50px] !border-2 !border-opacity-100 !px-0.5 !py-0 font-mono"
							></NumberInput>
							<p className="mx-0.5">mm</p>
						</>
					)}
				</div>
			</div>
			<Modal
				isOpen={isModalOpen}
				setOpen={setModalOpen}
				title="Converting..."
				preventAutoClose
			></Modal>
		</div>
	);
};

export default Toolbar;
