/**
 * @description class that encapsulates a block of points, where a jump stitch is normally formed between blocks
 */
class Block {
	public stitches: paper.Point[];
	public colour: paper.Color | null;

	public constructor(
		points: paper.Point[] = [],
		colour: paper.Color | null = null
	) {
		this.stitches = points;
		this.colour = colour;
	}
}

export default Block;
