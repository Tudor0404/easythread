import Paper from "paper";
import { Color } from "paper/dist/paper-core";
import { parse } from "svgson";
import UndoRedoTool from "../canvas/UndoRedoTool";
import eventBus from "../eventBus";
import getLeafItems from "./getLeafItems";
const toPath = require("element-to-path");

/**
 * @description removes overlapping sections which are not displayed, this prevents stitches being too thick
 * @returns {Promise<paper.Layer>}
 */
async function removeOverlaps(): Promise<paper.Layer> {
	UndoRedoTool.addStateDefault();

	let array: (paper.Item | paper.PathItem)[] = getLeafItems();
	let newArray: paper.PathItem[] = [];

	// goes through all items, from bottom to top, and subtracts all the items above it. All the items are first converted to PathItems to allow for svg boolean algebra
	for (let i = 0; i < array.length; i++) {
		let parent = await normaliseToPathItem(array[i]);

		if (parent === undefined) continue;

		for (let j = i + 1; j < array.length; j++) {
			// we do not want to remove paths without fills, since they could part of the design
			if (!array[j].hasFill()) continue;

			// if paths do not intersect and are not inside eachother, continue
			if (
				!(
					array[j].isInside(array[i].bounds) ||
					array[j].intersects(array[i])
				)
			)
				continue;

			let child = await normaliseToPathItem(array[j]);

			if (child === undefined) continue;

			parent = parent.subtract(child, { insert: false });
		}

		newArray.push(parent);
	}

	// add all new elements to a layer and dispatch it to be added to the project
	let l = new Paper.Layer();

	l.addChildren(newArray);

	eventBus.dispatch("setCanvasLayer", l);

	return l;
}

/**
 * @description converts any type of item that can be described as a Paper.PathItem, into one or one of its children classes
 * @param item item to convert
 * @returns {Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined>} converted item
 */
async function normaliseToPathItem(
	item: paper.Item | paper.PathItem | paper.Path | paper.CompoundPath
): Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined> {
	if (
		item instanceof Paper.Path ||
		item instanceof Paper.PathItem ||
		item instanceof Paper.CompoundPath
	) {
		return item;
	} else {
		if (!isValidShape(item)) return undefined;
		return await itemToPathItem(item);
	}
}

/**
 * @description converts regular items, which may be described as shapes, into SVG command defined paths
 * @param {paper.Item} item item to convert
 * @returns {paper.PathItem} converted items
 */
async function itemToPathItem(
	item: paper.Item
): Promise<paper.PathItem | undefined> {
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

	// need to check if it numeric, because if it set to nothing, it will be set to 'none'
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

/**
 * @description checks if the Item given can be visually described in SVG (this excludes groups and the such)
 * @param item item to check
 * @returns {boolean}
 */
function isValidShape(item: paper.Item): boolean {
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

/**
 * @description converts a string into an integer or float
 * @param str string to parse
 * @returns {boolean | number}
 */
function isNumeric(str: string): boolean | number {
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
