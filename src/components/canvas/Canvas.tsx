import React, { useRef, useEffect, useCallback } from "react";
import Paper from "paper";
import useResizeObserver from "use-resize-observer";
import { Point } from "paper/dist/paper-core";
import useState from "react-usestateref";

import options from "../../data/options.json";
import eventBus from "../../lib/eventBus";
import UndoRedoTool from "../../lib/canvas/UndoRedoTool";

interface Props {}

const Canvas: React.FC<Props> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// using useStateRefs for the width and height because they are not updated in passed functions, which results in the original values (1, 1) being used in functions such as the one to reset view, instead of the new dimensions
	const [width, setWidth, refWidth] = useState(1);
	const [height, setHeight, refHeight] = useState(1);
	// get updates on the dimsenions of the encapsulating div
	const { ref } = useResizeObserver({
		onResize: ({ width, height }) => {
			if (width) setWidth(width);
			if (height) setHeight(height);
		},
	});

	function onClickItemEvent(e: MouseEvent) {
		// prevent from selecting items below it
		e.stopPropagation();

		//@ts-ignore
		e.target.selected = !e.target.selected;
	}

	// add SVG to screen
	function addSvg(svg: string) {
		Paper.project.clear();

		const item = Paper.project.importSVG(svg, { insert: false });

		// add item to new layer, so that the layer can be centered by itself
		let l = new Paper.Layer();
		l.addChild(item);

		Paper.project.getItems({}).forEach((e) => {
			if (e.hasChildren()) return;
			//@ts-ignore
			e.onClick = onClickItemEvent;
		});

		eventBus.dispatch("initialSvgBounds", {
			width: l.strokeBounds.width,
			height: l.strokeBounds.height,
		});

		Paper.view.update();
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

	function resetCenter() {
		// set center of view to the center of the view
		if (refWidth.current && refHeight.current)
			Paper.view.center = new Point(
				refWidth.current / 2,
				refHeight.current / 2
			);
	}

	useEffect(() => {
		//@ts-ignore
		Paper.setup(canvasRef.current);

		addSvg(`<svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" id="svg2" viewBox="0 0 611.43 700" version="1.1">
		<g id="layer1" transform="translate(-54.286 -66.648)">
		<g id="g3761">
			<path id="path2876-1" transform="matrix(1 0 0 -3.5766 0 2808.7)" fill="#bceefe" d="m665.71 570.93c0 108.09-136.87 195.71-305.71 195.71s-305.71-87.624-305.71-195.71v-0.00001h305.71z"/>
			<path id="path3688" fill="#94835c" d="m279.5 651.83c6.4004-35.825 10.316-72.284 19.127-107.49 7.7072-30.8 17.838-61.385 29.887-90.691 6.5917-16.032 16.978-30.382 25.467-45.573 7.2225 3.6112 14.445 7.2225 21.667 10.834-8.1292 16.439-19.178 31.838-24.503 49.275-13.054 42.752-21.596 87.194-31.021 131.11-3.9569 18.438-8.1243 36.83-12.187 55.245-9.4795-0.9028-18.959-1.8056-28.438-2.7084z"/>
			<path id="path3690" fill="#8dcb8d" d="m253.77 455.47c7.2244 0.0398 31.723-0.35416 46.366-5.3695 13.231-4.5317 27.445-8.7088 38.555-17.257 6.1896-4.7629 15.041-19.983 16.645-16.645 3.1692 6.5935-5.2824 31.103-3.1642 46.473 1.6746 12.151 3.0882 27.178 7.2268 36.134 4.1386 8.9565 12.684 20.775 17.605 17.605 11.745-7.5677 25.681-32.586 25.909-53.682 0.17215-15.963-5.6538-42.526 1.1754-47.884 5.8435-4.5846 22.543 17.628 36.366 19.371 15.322 1.9318 41.687 10.609 46.241 3.6506 4.9519-7.567-7.1076-33.466-18.593-47.006-12.837-15.134-30.906-24.629-50.106-27.039-15.531-1.949 5.8544-12.188 8.6503-19.116 4.4994-11.147 4.7975-23.756 6.1972-35.667 0.9119-7.7596 0.97438-15.979-9.9888-13.012-12.962 3.509-26.026 5.7969-37.782 12.923-11.783 7.1425-19.338 19.648-22.016 32.678 0.26315 10.791-13.41-3.1434-19.18-4.8602-10.481-3.118-21.56-3.1179-32.376-4.3493-11.707-1.3328-23.817-2.3389-35.303 1.3217-5.1209 1.632-15.806 0.12475-15.656 3.9141 0.3606 9.1096 12.783 22.091 22.946 30.595 8.4199 7.0456 28.682 12.865 27.1 19.305-2.1024 8.5581-21.627 14.082-30.614 23.6-10.352 10.964-18.729 23.569-23.418 37.945-0.719 2.2045-10.01 6.3322-2.7852 6.3719z"/>
			<path id="path3755" transform="matrix(1.2466 0 0 1.1098 -130.2 -79.458)" fill="#f3ff75" d="m568.57 652.36c0 32.348-23.345 58.571-52.143 58.571s-52.143-26.223-52.143-58.571 23.345-58.571 52.143-58.571 52.143 26.223 52.143 58.571z"/>
			<path id="path3688-7" fill="#95845b" d="m298.44 653.82c-5.3077-28.248-8.5676-57.044-15.862-84.759-6.4027-24.329-14.819-48.463-24.783-71.505-5.4914-12.7-14.08-23.957-21.12-35.935-5.9893 2.8474-11.979 5.6948-17.968 8.5422 6.7418 12.964 15.762 25.075 20.32 38.855 9.1446 27.647 14.818 56.664 21.5 85.173 4.8232 20.578 9.5528 41.177 14.329 61.765 7.8609-0.71184 15.722-1.4237 23.583-2.1355z"/>
			<path id="path3690-4" fill="#8ccc8c" d="m320.64 478.06c-6.1036 1.6328-26.918 6.7223-40.418 5.7203-12.198-0.90537-25.149-1.2931-36.44-6.0668-6.2912-2.6597-17.149-13.578-17.768-10.399-1.2219 6.2802 11.354 25.146 12.964 38.619 1.2728 10.651 3.4031 23.678 1.884 32.172-1.519 8.494-6.1328 20.385-10.998 18.792-11.613-3.8029-28.942-21.885-33.804-39.684-3.6791-13.468-4.63-37.232-11.594-40.254-5.9588-2.5855-15.171 19.905-26.481 24.439-12.536 5.026-32.922 18.204-38.315 13.324-5.8647-5.3062-1.3942-29.888 5.3262-43.887 7.5114-15.646 20.697-27.68 36.408-33.968 12.709-5.0869-7.6512-9.0165-11.55-14.258-6.2743-8.4355-9.3177-19.038-13.138-28.805-2.4892-6.3634-4.3615-13.304 5.5711-13.22 11.744 0.0997 23.303-0.85631 34.827 2.5708 11.55 3.4348 20.711 12.343 25.86 22.775 2.166 9.1883 10.65-5.6279 15.152-8.3577 8.1774-4.958 17.551-7.4104 26.43-10.846 9.6101-3.7191 19.633-7.2508 30.162-6.6962 4.6939 0.24722 13.401-3.3933 14.113-0.15399 1.7114 7.7872-5.9257 21.52-12.642 30.965-5.5643 7.8249-21.419 17.233-18.655 22.332 3.6732 6.7755 21.415 7.127 31.126 13.191 11.186 6.9847 21.063 15.795 28.213 26.92 1.0963 1.706 9.8705 3.1418 3.7669 4.7746z"/>
			<path id="path2876" transform="matrix(1 0 0 -.63504 0 1129.2)" fill="#f3c075" d="m665.71 570.93c0 108.09-136.87 195.71-305.71 195.71s-305.71-87.624-305.71-195.71v-0.00001h305.71z"/>
		</g>
		</g>
	</svg>`);

		new Paper.Tool().on({
			mousedrag: function (event: paper.ToolEvent) {
				var pan_offset = event.point.subtract(event.downPoint);
				Paper.view.center = Paper.view.center.subtract(pan_offset);
			},
		});

		// handle bus events
		eventBus.on("resetView", (data: null) => {
			Paper.view.zoom = 1;
			resetCenter();
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
				Paper.project.addLayer(layer);
				// must add back onClick events to items apprently
			}
		});

		return eventBus.remove(
			[
				"resetView",
				"setSelectedStrokeColour",
				"setSelectedFillColour",
				"removeSelectedStroke",
				"removeSelectedFill",
				"setCanvasLayer",
			],
			() => {}
		);
	}, []);

	useEffect(() => {
		Paper.project.layers.forEach((element) => {
			if (width && height)
				element.position = new Paper.Point(width / 2, height / 2);
		});
	}, [width, height]);

	return (
		<div ref={ref} className="h-full w-full overflow-none">
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				id="canvas"
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

					var viewPosition = Paper.view.viewToProject(mousePosition);

					var mpos = viewPosition;
					var ctr = Paper.view.center;

					var pc = mpos.subtract(ctr);
					var offset = mpos.subtract(pc.multiply(beta)).subtract(ctr);

					Paper.view.zoom = newZoom;
					Paper.view.center = Paper.view.center.add(offset);

					event.preventDefault();
					Paper.view.update();
				}}
			></canvas>
		</div>
	);
};

export default Canvas;
