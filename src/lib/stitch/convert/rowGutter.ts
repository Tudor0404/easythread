import Paper from "paper";

function rowGutter(
	path: paper.Path,
	spacing: number = 0.5,
	normal: paper.Point
) {
	// Lines do not need to be created across the whole project, only the bounding box. The length of each line can be calculated, and how many extra line are needed below and above the bounding bow using the normal given. Lines need to overflow initially since rotating the shapes will leave empty space if that is not done
	const bounding = path.bounds;
	const hypotenuse = Math.sqrt(
		Math.pow(bounding.width, 2) + Math.pow(bounding.height, 2)
	);
	const offset = hypotenuse / 2 - bounding.width / 2;

	const lower = Math.floor(-Math.sin(normal.angleInRadians) * hypotenuse);
	const upper = Math.ceil(-lower + bounding.height);

	let lines: paper.Path[] = [];

	for (let y = lower; y < Math.ceil((upper - lower) / spacing) + 1; y++) {
		let tempLine = new Paper.Path.Line(
			new Paper.Point(
				bounding.bottomLeft.x - offset,
				y * spacing + bounding.bottomCenter.y
			),
			new Paper.Point(
				bounding.bottomRight.x + offset,
				y * spacing + bounding.bottomCenter.y
			)
		);

		tempLine.rotate(normal.angle);
		lines.push(tempLine);
	}

	let gutterLines: paper.Path[][] = [];

	lines.forEach((line) => {
		const intersectPoints = path
			.getIntersections(line)
			.map((cL) => cL.point);

		if (intersectPoints.length === 1) return;

		let linesInRow: paper.Path[] = [];

		for (let i = 0; i < intersectPoints.length; i += 2) {
			linesInRow.push(
				new Paper.Path.Line(intersectPoints[i], intersectPoints[i + 1])
			);
		}

		gutterLines.push(linesInRow);
	});

	return gutterLines;
}

export default rowGutter;
