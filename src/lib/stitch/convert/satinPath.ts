import straightSubdivision from "./straightSubdivision";
const { LinkedList, Queue, Stack } = require("dsa.js");

// TODO: consider types of joins, prevent overlap if path goes back on top of itself

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
	let preBuffer: paper.Point[] = [];
	let buffer: paper.Point[] = [];

	for (let i = 0; i < Math.floor(path.length / spaceBetweenNormals); i++) {
		let vector = path.getNormalAt(spaceBetweenNormals * i);
		// add bottom then top of the normal to make the up and down pattern
		preBuffer.push(
			path
				.getPointAt(spaceBetweenNormals * i)
				.add(vector.multiply(width / 2).multiply(-1))
		);
		preBuffer.push(
			path
				.getPointAt(spaceBetweenNormals * i)
				.add(vector.multiply(width / 2))
		);
	}

	let lastOffset = 0;

	for (let i = 0; i < preBuffer.length - 1; i += 2) {
		let start = preBuffer[i];
		let end = preBuffer[i + 1];

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

	return buffer;
}

export default satinPath;
