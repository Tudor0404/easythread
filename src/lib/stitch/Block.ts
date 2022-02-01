import type Point from "../../types/point";

class Block {
	public stitches: Point[];
	public colour: paper.Color | null;

	public constructor(
		points: Point[] = [],
		colour: paper.Color | null = null
	) {
		this.stitches = points;
		this.colour = colour;
	}
}

export default Block;
