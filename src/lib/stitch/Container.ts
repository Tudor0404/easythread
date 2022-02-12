import Block from "./Block";
import { embroidery } from "../../types/embroidery.d";
import getLeafItems from "../svg/getLeafItems";
import Paper from "paper";
import runningPath from "./convert/runningPath";
import satinPath from "./convert/satinPath";
import itemToPathItem from "../svg/itemToPathItem";

class Container {
	public sequence: Block[] = [];

	public constructor(layer: paper.Layer) {
		this.convertToBlocks(layer);
	}

	public switchBlocks() {}

	public convertToBlocks(layer: paper.Layer) {
		getLeafItems(layer).forEach(async (item: paper.Item) => {
			if (item.hasFill()) {
			}
			if (item.hasStroke()) {
				if (item.strokeWidth > 4) {
					const pathItem = await itemToPathItem(item);
					if (pathItem === undefined) return;

					this.sequence.push(
						new Block(
							satinPath(
								new Paper.Path(pathItem.pathData),
								item.strokeWidth
							)
						)
					);
				} else {
					const pathItem = await itemToPathItem(item);
					if (pathItem === undefined) return;

					this.sequence.push(
						new Block(
							runningPath(new Paper.Path(pathItem.pathData), 2.7)
						)
					);
				}
			}
		});
	}

	public convertToSVG() {}

	public convertToEmbroidery(type: embroidery) {
		// TODO: this shit
		if (this.sequence.length === 0) return;
		switch (type) {
			case embroidery.exp:
				break;

			default:
				break;
		}
	}
}

export default Container;
