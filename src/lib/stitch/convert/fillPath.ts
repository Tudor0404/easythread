import Paper from "paper";

import rowGutter from "./rowGutter";
import itemToPathItem from "../../svg/itemToPathItem";
import Graph from "../Graph";
import Block from "../Block";
import straightSubdivision from "./straightSubdivision";

async function fillPath(
	path: paper.PathItem,
	stitchLength: number = 2.7
): Promise<Block | false> {
	let tempPath: string = "";
	let tempItem;
	if (path.hasChildren()) tempItem = path.children[0];
	else tempItem = path;

	const tempPathItem = await itemToPathItem(tempItem);
	if (tempPathItem === undefined || tempPathItem?.pathData === undefined)
		return false;

	tempPath = tempPathItem.pathData;

	const directionVector = getDirectionVector(tempPath);

	const rows = rowGutter(path, 1, directionVector);
	const flattenedCL = ([] as paper.CurveLocation[]).concat(...rows);

	let graph = new Graph(flattenedCL);

	// add gutter edges
	for (const row of rows) {
		for (let i = 0; i < row.length; i += 2) {
			graph.addEdge(row[i], row[i + 1], true);
		}
	}

	// add outline edges
	let clByOutline: { [id: string]: paper.CurveLocation[] } = {};

	// categorise by path id
	for (const cl of flattenedCL) {
		if (Object.keys(clByOutline).includes(cl.curve.path.id.toString())) {
			clByOutline[cl.curve.path.id.toString()].push(cl);
		} else {
			clByOutline[cl.curve.path.id.toString()] = [cl];
		}
	}

	for (const key of Object.keys(clByOutline)) {
		// sort all curve locations by the path offset
		clByOutline[key].sort((a, b) => {
			const d1 =
				a.path.getOffsetOf(a.point) ||
				a.path.getOffsetOf(a.path.getNearestPoint(a.point));
			const d2 =
				b.path.getOffsetOf(b.point) ||
				b.path.getOffsetOf(b.path.getNearestPoint(b.point));

			if (d1 > d2) {
				return 1;
			} else {
				return -1;
			}
		});

		// add all the edges between the curve locations
		for (let i = 0; i < clByOutline[key].length; i++) {
			const e1: paper.CurveLocation = clByOutline[key][i];
			const e2: paper.CurveLocation =
				clByOutline[key][(i + 1) % clByOutline[key].length];

			graph.addEdge(e1, e2);
			// add edge every other one to ensure even verteces
			if (i % 2 === 1) graph.addEdge(e1, e2);
		}
	}

	const result = graph.getSufficientEulorianPath();
	let buffer = new Block();

	if (!result) {
		return false;
	} else {
		buffer.stitches.push(result[0].point);
		for (let i = 0; i < result.length - 1; i++) {
			buffer.stitches.push(
				...straightSubdivision(
					result[i].point,
					result[i + 1].point,
					stitchLength,
					false
				).slice(1)
			);
		}
	}

	return buffer;
}

function getDirectionVector(pathData: string): paper.Point {
	//already made sure the item cannot be a CompoundPath
	//@ts-ignore
	const path: paper.Path = Paper.Path.create(pathData);

	const precision = 1;
	const halfDistance = path.length / 2;
	let totalX = 0;
	let totalY = 0;

	for (let i = 0; i < Math.floor(halfDistance / precision) + 1; i++) {
		const point = path.getNormalAt(i * precision);
		totalX += point.x;
		totalY += point.y;
	}

	return new Paper.Point(
		totalX / Math.floor(halfDistance / precision),
		totalY / Math.floor(halfDistance / precision)
	);
}

export default fillPath;
