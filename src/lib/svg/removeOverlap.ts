import Paper from "paper";
import { Color } from "paper/dist/paper-core";
import { parse } from "svgson";
import UndoRedoTool from "../canvas/UndoRedoTool";
import eventBus from "../eventBus";
const toPath = require("element-to-path");

async function removeOverlaps() {
	let array: paper.Item[] = [];

	UndoRedoTool.addStateDefault();

	// get all leaf node items, remove items which have no fill or stroke
	Paper.project.getItems({}).forEach((item) => {
		if (item.hasChildren()) return;
		if (!item.hasStroke() && !item.hasFill()) return;
		array.push(item);
	});

	let newArray: any[] = [];

	// goes through all items, from bottom to top, and subtracts all the items above it. All the items are first converted to PathItems to allow for svg boolean algebra
	for (let i = 0; i < array.length; i++) {
		if (!isValidShape(array[i])) continue;

		let parentPath = await itemToPathItem(array[i]);

		if (parentPath === undefined) continue;

		for (let j = i + 1; j < array.length; j++) {
			// checks if the shapes overlap, optimisation
			if (
				!array[i].intersects(array[j]) &&
				!array[i].isInside(array[j].bounds)
			)
				continue;
			if (!isValidShape(array[j])) continue;

			// we do not want to remove paths without fills, since they could part of the design
			if (!array[j].hasFill()) continue;

			let childElement = await itemToPathItem(array[j]);

			if (childElement === undefined) continue;

			//@ts-ignore
			parentPath = parentPath.subtract(childElement, {
				insert: false,
			});
		}

		newArray.push(parentPath);
	}

	// add all new elements to a layer and dispatch it to be added to the project
	let l = new Paper.Layer();
	newArray.forEach((element) => {
		l.addChild(element);
		element.selected = true;
	});

	eventBus.dispatch("setCanvasLayer", l);

	return true;
}

async function itemToPathItem(item: paper.Item) {
	//@ts-ignore
	let svg: SVGPathElement = item.exportSVG();

	// parse any type of svg shape to path, normalises it
	const json = await parse("<svg>" + svg.outerHTML + "</svg>");

	let path = toPath(json.children[0]);

	if (!path) return;

	let pItem = Paper.PathItem.create(path);

	// copy over all relevant attributes
	if (
		json.children[0].attributes.fill &&
		json.children[0].attributes.fill !== "none"
	)
		pItem.fillColor = new Color(json.children[0].attributes.fill);

	if (
		json.children[0].attributes.stroke &&
		json.children[0].attributes.stroke !== "none"
	)
		pItem.strokeColor = new Color(json.children[0].attributes.stroke);

	if (
		json.children[0].attributes["stroke-width"] &&
		isNumeric(json.children[0].attributes["stroke-width"])
	)
		//@ts-ignore
		pItem.strokeWidth = isNumeric(
			json.children[0].attributes["stroke-width"]
		);

	pItem.position = item.position;

	return pItem;
}

// check if a SVG element is a shape
function isValidShape(item: paper.Item) {
	//@ts-ignore
	let svg: SVGPathElement = item.exportSVG();

	if (
		![
			"rect",
			"circle",
			"ellipse",
			"line",
			"polyline",
			"polygon",
			"path",
		].includes(svg.tagName)
	)
		return false;
	return true;
}

// converts string to number
function isNumeric(str: string) {
	if (str.match(/^\d+$/)) {
		// only digits
		return parseInt(str);
	} else if (str.match(/^\d+\.\d+$/)) {
		// digits follow by '.' followed by more digits
		return parseFloat(str);
	} else {
		return false;
	}
}

export default removeOverlaps;
