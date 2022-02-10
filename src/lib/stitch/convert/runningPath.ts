/**
 * @description generates a set of points along a given path, with each point a stitchLength units away
 * @param {paper.Path} path path that the stitches will go across
 * @param {number} stitchLength length between points
 * @param {boolean} [omitLast] exclude the last point or not
 * @returns {paper.Point[]} points at which stitches are made at
 */
function runningPath(
	path: paper.Path,
	stitchLength: number,
	omitLast: boolean = false
): paper.Point[] {
	let buffer = [];
	const totalDistance = path.length;

	for (let i = 0; i < Math.floor(totalDistance / stitchLength); i++) {
		buffer.push(path.getPointAt(stitchLength * i));
	}

	// if will not omit last, and the last point in the array is not equal to the end point, add the end point
	if (!omitLast && buffer[buffer.length - 1] !== path.getPointAt(path.length))
		buffer.push(path.getPointAt(path.length));

	return buffer;
}

export default runningPath;
