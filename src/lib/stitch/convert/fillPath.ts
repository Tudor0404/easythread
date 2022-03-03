import Paper from "paper";

import rowGutter from "./rowGutter";
import itemToPathItem from "../../svg/itemToPathItem";
import Graph from "../Graph";
import straightSubdivision from "./straightSubdivision";
import { getClosestPoint } from "../helpers";

//https://github.com/inkstitch/inkstitch/blob/f2208a88fe4bb4bae20a1f821dd175880c2905d5/lib/stitches/auto_fill.py#L110

// this comment helped me come up with this algorithm, however, their implementation is vastly different because of the platform and language difference

/**
 * @description generates a path of points to fill a shape without leaving any empty spaces
 * @param path path
 * @param stitchLength maximum length of the stitches
 * @param carryOnPoint point from which to start closest to
 * @param fillGutterSpacing space between gutters
 * @returns {Promise<paper.Point[][] | false>}
 */
async function fillPath(
	path: paper.PathItem,
	stitchLength: number = 2.7,
	fillGutterSpacing: number = 1
): Promise<paper.Point[][] | false> {
	let tempPath: string = "";
	let tempItem;
	if (path.hasChildren()) tempItem = path.children[0];
	else tempItem = path;

	const tempPathItem = await itemToPathItem(tempItem);
	if (tempPathItem === undefined || tempPathItem?.pathData === undefined)
		return false;

	tempPath = tempPathItem.pathData;

	const directionVector = getDirectionVector(tempPath);

	const rows = rowGutter(path, fillGutterSpacing, directionVector);
	const flattenedCL = ([] as paper.CurveLocation[]).concat(...rows);

	let graph = new Graph(flattenedCL);

	// add gutter edges
	for (const row of rows) {
		for (let i = 0; i < row.length; i += 2) {
			graph.addEdge(row[i], row[i + 1]);
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

	// sort all curve locations by the path offset
	for (const key of Object.keys(clByOutline)) {
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
			// add edge every other one to ensure all even vertices
			if (i % 2 === 1) graph.addEdge(e1, e2);
		}
	}

	let pointBlocks: paper.Point[][] = [];

	// get connected subgraphs
	let visitedIndexed: number[] = new Array(graph.adjacencyList.length);
	visitedIndexed.fill(0);
	let counter = 1;
	while (visitedIndexed.includes(0)) {
		const startIndex = visitedIndexed.indexOf(0);
		if (startIndex === -1) break;

		let curVisited: boolean[] = new Array(graph.adjacencyList.length);
		curVisited.fill(false);

		graph.recursionCheck(startIndex, curVisited);

		for (let i = 0; i < curVisited.length; i++) {
			if (curVisited[i]) {
				visitedIndexed[i] = counter;
			}
		}

		counter++;
	}

	for (let i = 1; i < counter; i++) {
		let availableVertices: number[] = [];

		for (let j = 0; j < visitedIndexed.length; j++) {
			if (visitedIndexed[j] === i) availableVertices.push(j);
		}

		let startPoint = 0;

		// get point closest to last for smaller jump distances
		if (i > 1) {
			const potentialClosestPoint = getClosestPoint(
				pointBlocks[pointBlocks.length - 1][
					pointBlocks[pointBlocks.length - 1].length - 1
				],
				graph.referenceTable
					.filter((e, c) => availableVertices.includes(c))
					.map((e) => e.point)
			);

			if (potentialClosestPoint !== null)
				startPoint = potentialClosestPoint;
		}

		// generate path then create sub divisons to prevent stitch lengths being too far apart
		const result = graph.getEulerianPath(availableVertices[startPoint]);
		let buffer: paper.Point[] = [];

		if (result) {
			for (let i = 0; i < result.length - 1; i++) {
				const divisons = straightSubdivision(
					result[i].point,
					result[i + 1].point,
					stitchLength,
					true
				);
				buffer.push(...divisons);
			}
			buffer.push(result[result.length - 1].point);
			pointBlocks.push(buffer);
		}
	}

	return pointBlocks;
}

/**
 * @description calculates the average normal across half of the shape
 * @param pathData path
 * @returns {paper.Point} the unit vector of the normal
 */
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
