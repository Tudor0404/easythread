import Paper from "paper";

/**
 * @description slices through a path at given intervals ata given angle to generate points at which thread should go across a shape
 * @param {paper.Path} pathpath to check intersects at
 * @param {number} spacing spacing between gutters
 * @param {paper.Point} normal unit vector normal
 * @returns
 */
function rowGutter(
	path: paper.PathItem,
	spacing: number = 0.5,
	normal: paper.Point
) {
	// Lines do not need to be created across the whole project, only the bounding box. The length of each line can be calculated, and how many extra line are needed below and above the bounding bow using the normal given. Lines need to overflow initially since rotating the shapes will leave empty space if that is not done
	const bounding = path.bounds;
	const hypotenuse = Math.sqrt(
		Math.pow(bounding.width, 2) + Math.pow(bounding.height, 2)
	);
	const offset = hypotenuse / 2;

	const lower = -Math.abs(
		Math.ceil(Math.sin(normal.angleInRadians) * hypotenuse)
	);
	const upper = Math.ceil(-lower + bounding.height);

	let lines: paper.Path[] = [];

	for (let y = 0; y < Math.ceil((upper - lower) / spacing) + 1; y++) {
		const pStart = new Paper.Point(
			bounding.bottomLeft.x - offset,
			bounding.bottomCenter.y - y * spacing - lower
		);
		const pEnd = new Paper.Point(
			bounding.bottomRight.x + offset,
			bounding.bottomCenter.y - y * spacing - lower
		);
		let tempLine = new Paper.Path.Line(pStart, pEnd);

		tempLine.rotate(normal.angle, bounding.center);
		lines.push(tempLine);
	}

	let gutterLines: paper.CurveLocation[][] = [];

	lines.forEach((line) => {
		let intersectPoints: paper.CurveLocation[] =
			path.getIntersections(line);

		const initialPoint = line.segments[0].point;

		// sort intersection points in order by how far away they are from the inital start point of the line
		intersectPoints.sort((a, b) => {
			if (
				initialPoint.getDistance(a.point, false) >
				initialPoint.getDistance(b.point, false)
			)
				return 1;
			else if (
				initialPoint.getDistance(a.point, false) <
				initialPoint.getDistance(b.point, false)
			)
				return -1;
			return 0;
		});

		if (intersectPoints.length <= 1) return;

		if (intersectPoints.length % 2 === 1) {
			delete intersectPoints[intersectPoints.length - 1];
		}

		gutterLines.push(intersectPoints);
	});

	return gutterLines;
}

export default rowGutter;
