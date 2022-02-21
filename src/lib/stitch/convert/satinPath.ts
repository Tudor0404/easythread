import straightSubdivision from "./straightSubdivision";
import Paper from "paper";

/**
 * @description generates a set of points that
 * @param {paper.Point} path path that the normals will be calculated at
 * @param {number} width width of the satin (bottom to top)
 * @param {number} stitchLength maximum length of a stitch in a satin stitch, a higher number is normally used because of the straightness
 * @param {number} spaceBetweenNormals distance at which the normals are calculated at
 * @returns {paper.Point[]} points at which stitches are made at
 */
function satinPath(
	path: paper.Path,
	width: number,
	stitchLength: number = 10,
	spaceBetweenNormals: number = 1
): paper.Point[] {
	let preBuffer: [paper.Point, paper.Point, number][] = [];
	let buffer: paper.Point[] = [];

	for (
		let i = 0;
		i < Math.floor(path.length / spaceBetweenNormals) + 1;
		i++
	) {
		let vector = path.getNormalAt(spaceBetweenNormals * i);
		// add bottom then top of the normal to make the up and down pattern
		preBuffer.push([
			path
				.getPointAt(spaceBetweenNormals * i)
				.add(vector.multiply(width / 2).multiply(-1)),
			path
				.getPointAt(spaceBetweenNormals * i)
				.add(vector.multiply(width / 2)),
			spaceBetweenNormals * i,
		]);
	}

	let lastOffset = 0;

	for (let i = 0; i < preBuffer.length; i++) {
		const start = preBuffer[i][0];
		const end = preBuffer[i][1];

		// if (isInRanges(preBuffer[i][2], ranges)) {
		// 	let c = new Paper.Shape.Circle(start, 1);
		// 	c.fillColor = new Paper.Color("red");
		// }

		// add offset only if the distance is larger than the stitch length, increment offset to change it every normal
		if (start.getDistance(end, false) > Math.pow(stitchLength, 2)) {
			lastOffset = (lastOffset + 20) % 100;
		} else {
			lastOffset = 0;
		}

		straightSubdivision(
			start,
			end,
			stitchLength,
			false,
			lastOffset
		).forEach((p) => buffer.push(p));
	}

	if (buffer.length > 2) {
		buffer.unshift(buffer[0], buffer[1], buffer[0], buffer[1]); // tie-in
	}

	if (buffer.length > 2) {
		buffer.push(
			buffer[buffer.length - 2],
			buffer[buffer.length - 1],
			buffer[buffer.length - 2],
			buffer[buffer.length - 1]
		); // tie-off
	}

	return buffer;
}

//#region delete this in project hand in

// todo: consider types of joins
// fixme: when doing the overlap prevention, it takes the normals in conseration, which results in the prevention being offset. Can't do reverse because same issue will come up. Can do some trig uckery to fix. Or create a bounding box of the overlapping shape and detect all points in it. Maybe even do colour analysis by making it transparent and finding all the areas which it is overlapping, then matching the points in it.

/**
 * @description checks for places at which a curve self touches, and returns ranges at which satin stitches should not occur.
 * @param path path to check against
 * @param width total width of the path
 * @returns {[number, number][]} ranges at which satin should not occur
 */
function getExclusionRanges(
	path: paper.Path,
	width: number
): [number, number][] {
	const pathClone = path.clone({ insert: false });
	let trailingPath: paper.Path;
	let headerPath: paper.Path;
	const accuracy = 5; // check every ___ mm. Lower number reduces chances of path intersections not being found, but increases computation time
	let intersectPoints: paper.Point[] = [];

	// fix: pathClone.divideAt() divides original path too, although cloning it, maybe shallow copy?
	for (let i = 1; i < Math.floor(pathClone.length / accuracy); i++) {
		let newSegment = pathClone.divideAt(accuracy * i);
		trailingPath = new Paper.Path(
			pathClone.segments.slice(
				0,
				pathClone.segments.findIndex((seg) => seg === newSegment) + 1
			)
		);
		headerPath = new Paper.Path(
			pathClone.segments.slice(
				pathClone.segments.findIndex((seg) => seg === newSegment) + 1,
				pathClone.segments.length
			)
		);

		// for all the points, only add points where there are no already existing intersections less than 0.2 units away.
		trailingPath.getIntersections(headerPath).forEach((e) => {
			let skipFlag = false;
			for (let i = 0; i < intersectPoints.length; i++) {
				if (intersectPoints[i].getDistance(e.point) < 0.2) {
					skipFlag = true;
					break;
				}
			}
			if (!skipFlag) intersectPoints.push(e.point);
		});
	}

	return intersectPoints.map((e) => {
		return [
			path.getNearestLocation(e).offset - width / 2,
			path.getNearestLocation(e).offset + width / 2,
		];
	});
}

function isInRanges(distance: number, ranges: [number, number][]): boolean {
	for (let i = 0; i < ranges.length; i++) {
		const range = ranges[i];
		if (distance >= range[0] && distance <= range[1]) {
			return true;
		}
	}
	return false;
}

//#endregion

export default satinPath;
