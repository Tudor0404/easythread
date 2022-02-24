/**
 * @description generates a set of points along a given path, with each point a stitchLength units away
 * @param {paper.Path} path path that the stitches will go across
 * @param {number} stitchLength length between points
 * @param {boolean} [omitLast] exclude the last point or not
 * @returns {paper.Point[]} points at which stitches are made at
 */
function runningPath(path: paper.Path, stitchLength: number): paper.Point[] {
	let buffer = [];
	const totalDistance = path.length;
	let anchorDistances = [];

	// get anchor points
	for (let i = 0; i < path.segments.length - 1; i++) {
		anchorDistances.push(path.getOffsetOf(path.segments[i].point));
	}

	for (let i = 0; i < Math.floor(totalDistance / stitchLength) + 1; i++) {
		const curDistance = stitchLength * i;
		//used a while loop just in case there are loads of anchors in a short space
		while (anchorDistances.length > 0 && curDistance > anchorDistances[0]) {
			// already checked if array is not empty with the length condition, idky typsecript did not catch it
			//@ts-ignore
			buffer.push(path.getPointAt(anchorDistances.shift()));
		}

		buffer.push(path.getPointAt(curDistance));
	}

	if (buffer.length > 2) {
		buffer.unshift(buffer[0], buffer[1], buffer[0], buffer[1]); // tie-in
	}

	// if the last point in the array is not equal to the end point, add the end point
	if (buffer[buffer.length - 1] !== path.getPointAt(path.length)) {
		buffer.push(path.getPointAt(path.length));
	}

	if (buffer.length > 2) {
		buffer.push(
			buffer[buffer.length - 2],
			buffer[buffer.length - 1],
			buffer[buffer.length - 2],
			buffer[buffer.length - 1]
		); // tie-out
	}

	return buffer;
}

export default runningPath;
