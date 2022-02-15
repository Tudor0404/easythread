import Paper from "paper";

function fillPath(
	path: paper.Path,
	stitchLength: number = 2.7,
	createPerimeter: boolean = false
) {}

function getDirection(path: paper.Path): paper.Point {
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
