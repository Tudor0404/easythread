import React, { useRef, useEffect } from "react";
import Paper from "paper";
import useState from "react-usestateref";
import Ruler from "@scena/react-ruler";

import options from "../../data/options.json";
import eventBus from "../../lib/eventBus";
import UndoRedoTool from "../../lib/canvas/UndoRedoTool";

interface Props {}

// TODO: Handle errors from uploading/downloading files etc.

const Canvas: React.FC<Props> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const horizontalRulerRef = useRef<any>(null);
	const verticalRulerRef = useRef<any>(null);
	// prevent selection for a short while after dragging
	const [preventSelect, setPreventSelect, refPreventSelect] = useState(false);
	const [timer, setTimer] = useState<NodeJS.Timeout>();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [topLeftPos, setTopLeftPos] = useState<paper.Point>(
		new Paper.Point(0, 0)
	);
	const [viewZoom, setViewZoom] = useState(1);

	function onClickItemEvent(e: paper.MouseEvent) {
		// prevent from selecting items below it
		e.stopPropagation();
		// allow for multi selection only if holding control key at the same time
		if (!refPreventSelect.current) {
			if (!e.modifiers.control)
				Paper.project.selectedItems.forEach((el) => {
					if (el !== e.target) el.selected = false;
				});
			e.target.selected = !e.target.selected;
		}
		eventBus.dispatch("selectedItemsChanged", {});
	}

	function openFileDialog() {
		fileInputRef.current?.click();
	}

	function updateRulerDimensions() {
		setTopLeftPos(Paper.view.viewToProject(new Paper.Point(0, 0)));
		setViewZoom(Paper.view.zoom);

		if (horizontalRulerRef.current) {
			horizontalRulerRef.current.resize();
		}
		if (verticalRulerRef.current) {
			verticalRulerRef.current.resize();
		}
	}

	function setCenter() {
		Paper.view.center = new Paper.Point(
			Paper.project.view.viewSize.width / 2,
			Paper.project.view.viewSize.height / 2
		);
		updateRulerDimensions();
	}

	function resetZoom() {
		Paper.view.zoom = 1;
		updateRulerDimensions();
	}

	// add SVG to screen
	function addSvg(svg: string, title?: string) {
		Paper.project.clear();

		const item = Paper.project.importSVG(svg, {
			insert: false,
			expandShapes: true,
		});

		// add item to new layer, so that the layer can be centered by itself
		let l = new Paper.Layer();
		l.addChild(item);

		Paper.project.getItems({}).forEach((e) => {
			if (e.hasChildren()) return;
			//@ts-ignore
			e.onClick = onClickItemEvent;
		});

		l.position = new Paper.Point(
			Paper.view.viewSize.width / 2,
			Paper.view.viewSize.height / 2
		);

		eventBus.dispatch("initialSvgBounds", {
			width: l.strokeBounds.width,
			height: l.strokeBounds.height,
		});

		l.data = { userEditable: true };

		if (title) eventBus.dispatch("initialFilename", title);

		Paper.view.update();
	}

	function handleFileUploaded(e: React.ChangeEvent<HTMLInputElement>) {
		let reader = new FileReader();

		if (!e.target.files) return;

		if (e.target.files[0].type !== "image/svg+xml") return;

		reader.onload = (f: ProgressEvent<FileReader>) => {
			try {
				if (!f.target || !f.target.result) return;
				//@ts-ignore
				addSvg(f.target.result.toString(), e.target.files[0].name);
			} catch {}
		};

		reader.readAsText(e.target.files[0]);
	}

	function setSelectedStroke(hex: string) {
		Paper.project.selectedItems.forEach((e) => {
			e.strokeColor = new Paper.Color(hex);
		});
	}

	function setSelectedFill(hex: string) {
		Paper.project.selectedItems.forEach((e) => {
			e.fillColor = new Paper.Color(hex);
		});
	}

	useEffect(() => {
		//@ts-ignore
		Paper.setup(canvasRef.current);

		new Paper.Tool().on({
			// dragging functionality
			mousedrag: (event: paper.ToolEvent) => {
				event.stopPropagation();
				event.preventDefault();
				let pan_offset = event.point.subtract(event.downPoint);
				Paper.view.center = Paper.view.center.subtract(pan_offset);
				setPreventSelect(true);
				updateRulerDimensions();
			},
		});

		Paper.view.on({
			// resize
			resize: () => {
				Paper.project.layers.forEach((element) => {
					if (element.data.userEditable === true)
						element.position = new Paper.Point(
							Paper.view.viewSize.width / 2,
							Paper.view.viewSize.height / 2
						);
				});
				updateRulerDimensions();
			},
			// remove selection if not clicked anything, since view.click propagates last, and propagation is stopped when clicked on an element, this will not trigger if clicked over an element which can be selected.
			click: () => {
				Paper.project.selectedItems.forEach((e) => {
					e.selected = false;
				});
			},
		});

		//#region bus events
		eventBus.on("resetView", () => {
			resetZoom();
			setCenter();
		});

		eventBus.on("resetCenter", () => {
			setCenter();
		});

		eventBus.on("setSelectedStrokeColour", (data: any) => {
			if (Paper.project.selectedItems.length > 0) {
				UndoRedoTool.addStateDefault();
				setSelectedStroke(data);
			}
		});

		eventBus.on("setSelectedFillColour", (data: any) => {
			if (Paper.project.selectedItems.length > 0) {
				UndoRedoTool.addStateDefault();
				setSelectedFill(data);
			}
		});

		eventBus.on("removeSelectedStroke", () => {
			if (Paper.project.selectedItems.length > 0) {
				UndoRedoTool.addStateDefault();
				Paper.project.selectedItems.forEach((e) => {
					e.strokeColor = null;
				});
			}
		});

		eventBus.on("removeSelectedFill", () => {
			if (Paper.project.selectedItems.length > 0) {
				UndoRedoTool.addStateDefault();
				Paper.project.selectedItems.forEach((e) => {
					e.fillColor = null;
				});
			}
		});

		eventBus.on("setCanvasLayer", (layer: paper.Layer) => {
			if (layer) {
				Paper.project.clear();

				const newLayer = Paper.project.addLayer(layer);
				newLayer.children.forEach((e) => {
					e.onClick = onClickItemEvent;
					e.selected = false;
				});
			}
		});

		eventBus.on("openLocalFile", () => {
			openFileDialog();
		});

		eventBus.on("updateRulers", updateRulerDimensions);

		//#endregion

		updateRulerDimensions();

		return eventBus.remove(
			[
				"resetView",
				"resetCenter",
				"setSelectedStrokeColour",
				"setSelectedFillColour",
				"removeSelectedStroke",
				"removeSelectedFill",
				"setCanvasLayer",
				"openLocalFile",
				"resetRulers",
				"updateRulers",
			],
			() => {}
		);
	}, []);

	useEffect(() => {
		if (timer) {
			clearTimeout(timer);
		}

		if (preventSelect) {
			setTimer(
				setTimeout(() => {
					setPreventSelect(false);
				}, 200)
			);
		}

		//@ts-ignore
		return () => clearTimeout(timer);
	}, [preventSelect]);

	useEffect(() => {
		if (horizontalRulerRef.current) {
			horizontalRulerRef.current.scroll(topLeftPos.x);
		}
		if (verticalRulerRef.current) {
			verticalRulerRef.current.scroll(topLeftPos.y);
		}
	}, [topLeftPos]);

	return (
		<div className="h-full w-full ">
			<div className="flex h-5 w-full flex-row">
				<div className="h-5 w-5 bg-gray-700"></div>
				<div className="w-[calc(100%-20px)]">
					<Ruler
						ref={horizontalRulerRef}
						type="horizontal"
						height={20}
						segment={4}
						zoom={viewZoom}
						unit={
							viewZoom < 0.5
								? 250
								: viewZoom < 0.7
								? 100
								: viewZoom > 3.5
								? 10
								: 50
						}
						mainLineSize={12}
						longLineSize={6}
						shortLineSize={6}
						backgroundColor="#E5E7EB"
						lineColor="#374151"
						textColor="#374151"
						textOffset={[0, 7]}
						textFormat={(scale: number) => {
							if (viewZoom < 0.7)
								return (scale / 10).toString() + "cm";
							else return scale.toString() + "mm";
						}}
					></Ruler>
				</div>
			</div>
			<div className="flex h-[calc(100%-20px)] w-full flex-row">
				<div className=" h-full w-5 ">
					<Ruler
						type="vertical"
						width={20}
						segment={4}
						ref={verticalRulerRef}
						zoom={viewZoom}
						unit={
							viewZoom < 0.5
								? 250
								: viewZoom < 0.7
								? 100
								: viewZoom > 3.5
								? 10
								: 50
						}
						mainLineSize={12}
						longLineSize={6}
						shortLineSize={6}
						backgroundColor="#E5E7EB"
						lineColor="#374151"
						textColor="#374151"
						textOffset={[7, 0]}
						textFormat={(scale: number) => {
							if (viewZoom < 0.7)
								return (scale / 10).toString() + "cm";
							else return scale.toString() + "mm";
						}}
					></Ruler>
				</div>
				<div className="h-full w-full">
					<canvas
						ref={canvasRef}
						className="h-full w-full"
						id="canvas"
						//@ts-ignore
						resize="true"
						onWheel={(event) => {
							let newZoom = Paper.view.zoom;
							let oldZoom = Paper.view.zoom;

							if (event.deltaY < 0) {
								newZoom = Paper.view.zoom + 0.15;
								newZoom =
									newZoom > options.maxZoom
										? options.maxZoom
										: newZoom;
							} else {
								newZoom = Paper.view.zoom - 0.15;
								newZoom =
									newZoom < options.minZoom
										? options.minZoom
										: newZoom;
							}

							let beta = oldZoom / newZoom;

							let mousePosition = new Paper.Point(
								event.clientX,
								event.clientY
							);

							var viewPosition =
								Paper.view.viewToProject(mousePosition);

							var mpos = viewPosition;
							var ctr = Paper.view.center;

							var pc = mpos.subtract(ctr);
							var offset = mpos
								.subtract(pc.multiply(beta))
								.subtract(ctr);

							Paper.view.zoom = newZoom;
							Paper.view.center = Paper.view.center.add(offset);

							updateRulerDimensions();
							Paper.view.update();
						}}
					></canvas>
				</div>
			</div>
			<input
				ref={fileInputRef}
				type={"file"}
				className="absolute -top-full"
				accept=".svg"
				onChange={handleFileUploaded}
			/>
		</div>
	);
};

export default Canvas;
