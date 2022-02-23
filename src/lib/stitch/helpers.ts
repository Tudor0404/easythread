/**
 * @description gets the closest point from one to a set of others, returning the index in the list, or null is none are found
 * @param {paper.Point} start point to compare against
 * @param {paper.Point[]} points  list of available point to choose from
 * @returns {number | null} closest index
 */
function getClosestPoint(
	start: paper.Point,
	points: paper.Point[]
): number | null {
	if (points.length === 0) {
		return null;
	}

	let smallestDistance = Number.MAX_VALUE;
	let lastIndex = -1;

	for (let i = 0; i < points.length; i++) {
		const val = start.getDistance(points[i], false);
		if (smallestDistance > val) {
			lastIndex = i;
			smallestDistance = val;
		}
	}

	return lastIndex;
}

export { getClosestPoint };
