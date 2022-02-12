import Paper from "paper";
import { parse } from "svgson";

import copyStyling from "./copyStyling";
const toPath = require("element-to-path");

/**
 * @description converts any item into a pathItem if it can be
 * @param item item to convert
 * @returns {Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined>}
 */
async function itemToPathItem(
	item: paper.Item
): Promise<paper.Path | paper.PathItem | paper.CompoundPath | undefined> {
	if (!isValidShape) return undefined;

	// copies styling to add it back after conversion
	const temp = copyStyling(item, item);

	//@ts-ignore
	let svg: SVGPathElement = item.exportSVG();

	// parse any type of svg shape to path, normalises it
	const json = await parse("<svg>" + svg.outerHTML + "</svg>");

	let path = toPath(json.children[0]);

	if (!path) return undefined;

	let pItem = Paper.PathItem.create(path);

	pItem.position = item.position;

	copyStyling(pItem, temp);

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

export default itemToPathItem;
