import Block from "./Block";
import { embroidery } from "../../types/embroidery.d";
import getLeafItems from "../svg/getLeafItems";

class Container {
	public sequence: Block[] = [];

	public constructor(layer: paper.Layer) {
		this.convertToBlocks(layer);
	}

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

	public convertToBlocks(layer: paper.Layer) {
		getLeafItems().forEach((item: paper.Item) => {
			//console.log(item.fillColor);
		});
	}

	public convertToSVG() {}

	public convertToEmbroidery(type: embroidery) {}
}

export default Container;
