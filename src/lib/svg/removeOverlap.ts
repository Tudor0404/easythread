import Paper from "paper";

import UndoRedoTool from "../canvas/UndoRedoTool";
import eventBus from "../eventBus";
import getLeafItems from "./getLeafItems";
import itemToPathItem from "./itemToPathItem";

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
		let parent = await itemToPathItem(array[i]);

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

			let child = await itemToPathItem(array[j]);

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

export default removeOverlaps;
