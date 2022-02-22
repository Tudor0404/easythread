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
