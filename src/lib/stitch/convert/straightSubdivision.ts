import Paper from "paper";

/**
 * @description generates intermediate points on a start line between 2 point given a maximum length between each point
 * @param {paper.Point} start start point of the stitch block
 * @param {paper.Point} end end point of the stitch block
 * @param {number} stitchLength maximum length between stitches
 * @param {boolean} omitLast remove last point or not
 * @param {number} [percentOffset] percentage offset in relation to the stitch length to add at the start of the block
 * @returns list of points that make up the straight line defined.
 */
function straightSubdivision(
	start: paper.Point,
	end: paper.Point,
	stitchLength: number,
	omitLast: boolean = false,
	percentOffset: number = 0
): paper.Point[] {
	let buffer: paper.Point[] = [];
	let totalDistance = start.getDistance(end);

	// if total distance is less than or equal to stitch length, or the total distance is bigger than the percent offset ...
	if (
		totalDistance <= stitchLength &&
		(percentOffset % 100 === 0 ||
			totalDistance <= stitchLength * (percentOffset / 100))
	) {
		if (omitLast) return [start];
		else return [start, end];
	}

	// offset the line if percentage offset is not a full offset
	if (percentOffset % 100 !== 0) {
		buffer.push(start);
		start = getPointDistanceAway(
			start,
			end,
			stitchLength * (percentOffset / 100)
		);
		totalDistance = start.getDistance(end);
	}

	for (let i = 0; i < Math.floor(totalDistance / stitchLength) + 1; i++) {
		buffer.push(getPointDistanceAway(start, end, stitchLength * i));
	}

	// if will not omit last, and the last point in the array is not equal to the end point, add the end point
	if (
		!omitLast &&
		buffer[buffer.length - 1].x !== end.x &&
		buffer[buffer.length - 1].y !== end.y
	)
		buffer.push(end);

	return buffer;
}

/**
 * @description gets the closest point from one to a set of others, returning the index in the list, or null is none are found
 * @param {paper.Point} start point to compare against
 * @param {paper.Point[]} points  list of available point to choose from
 * @returns {number | null} closest index
 */
function getPointDistanceAway(
	start: paper.Point,
	end: paper.Point,
	distance: number
): paper.Point {
	const totalDistance = start.getDistance(end);

	if (totalDistance === 0 || distance === 0) return start;

	// https://math.stackexchange.com/a/2045181/553498
	return new Paper.Point(
		start.x + (distance / totalDistance) * (end.x - start.x),
		start.y + (distance / totalDistance) * (end.y - start.y)
	);
}

export default straightSubdivision;
