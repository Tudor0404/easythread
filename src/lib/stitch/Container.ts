import Block from "./Block";

class Container {
	public sequence: Block[] = [];

	public switchBlocks() {}

	public addBlocks(block: Block) {
		try {
			this.sequence.push(block);
			return true;
		} catch {
			return false;
		}
	}

	public removeBlock(index: number) {
		try {
			delete this.sequence[index];
			return true;
		} catch {
			return false;
		}
	}

	public convertToEmbroidery() {}

	public convertToSVG() {}
}

export default Container;
