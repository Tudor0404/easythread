import Paper from "paper";

import Block from "./Block";
import { embroideryTypes } from "../../types/embroideryTypes.d";
import getLeafItems from "../svg/getLeafItems";
import runningPath from "./convert/runningPath";
import satinPath from "./convert/satinPath";
import itemToPathItem from "../svg/itemToPathItem";
import straightSubdivision from "./convert/straightSubdivision";
import { intToU8Int } from "./helpers";
import FileSaver from "file-saver";
import { Color } from "paper/dist/paper-core";

// NOTE: 1 unit on the canvas is 1mm, but since most embroider file types use an arbitrary unit of max 127 and min -127, the units will be divided by 10 to give an accuracy of 1/10mm for the embroidery file types, with a maximum of 12.7mm distance between jumps and stitches.

class Container {
	public sequence: Block[] = [];

	public constructor(layer: paper.Layer) {
		this.convertToBlocks(layer);
	}

	public switchBlocks() {}

	public async convertToBlocks(layer: paper.Layer) {
		const leafItems = getLeafItems(layer);

		for (const item of leafItems) {
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
							),
							item.strokeColor
						)
					);
				} else {
					const pathItem = await itemToPathItem(item);
					if (pathItem === undefined) return;

					this.sequence.push(
						new Block(
							runningPath(new Paper.Path(pathItem.pathData), 2.7),
							item.strokeColor
						)
					);
				}
			}
		}

		this.sequence.forEach((block) => {
			block.stitches.forEach((stitch) => {
				const circle = new Paper.Shape.Circle(stitch, 0.5);
				circle.fillColor = new Color("red");
			});
		});

		this.convertToEmbroidery(embroideryTypes.exp);
	}

	public convertToSVG() {
		if (this.sequence.length === 0) return;
	}

	public convertToEmbroidery(type: embroideryTypes) {
		// TODO: this shit
		if (this.sequence.length === 0) return;
		switch (type) {
			case embroideryTypes.exp:
				this.convertToExp();
				break;

			default:
				break;
		}
	}

	private convertToExp() {
		let preBytes: ["stitch" | "jump" | "end" | "stop", number, number][] =
			[];
		let cP = this.sequence[0].stitches[0];
		let prevColour = this.sequence[0].colour;

		for (let i = 0; i < this.sequence.length; i++) {
			const block = this.sequence[i];

			// colour change if colour not the same
			if (prevColour !== block.colour) {
				preBytes.push(["stop", 0, 0]);
			}

			// jump to new block if points not the same
			if (cP !== block.stitches[0]) {
				const jumpPoints = straightSubdivision(
					cP,
					block.stitches[0],
					12.7,
					false
				);
				for (let j = 1; j < jumpPoints.length; j++) {
					// ignore first point since starting from there
					const S = jumpPoints[j];

					let dX = S.x - cP.x;
					let dY = -(S.y - cP.y);

					preBytes.push(["jump", intToU8Int(dX), intToU8Int(dY)]);
					cP = S;
				}
			}

			for (let s = 0; s < block.stitches.length; s++) {
				const S = block.stitches[s];
				let dX = S.x - cP.x;
				let dY = -(S.y - cP.y);

				preBytes.push(["stitch", intToU8Int(dX), intToU8Int(dY)]);
				cP = S;
			}
		}

		preBytes.push(["end", 0, 0]);

		// compute total byte size of the file. 2 bytes per control command, 2 per coordinates
		let length = 0;
		preBytes.forEach((command) => {
			if (command[0] === "end" || command[0] === "stitch") length += 2;
			else if (command[0] === "stop" || command[0] === "jump")
				length += 4;
		});

		let bytes = new Int8Array(length);
		let counter = 0;

		preBytes.forEach((command) => {
			switch (command[0]) {
				case "stitch":
					bytes.set([command[1], command[2]], counter);
					counter += 2;
					break;
				case "end":
					bytes.set([-128, -128], counter);
					counter += 2;
					break;
				case "stop":
					bytes.set([-128, 1, 0, 0], counter);
					counter += 4;
					break;
				case "jump":
					bytes.set([-128, 2, command[1], command[2]], counter);
					counter += 4;
					break;

				default:
					break;
			}
		});

		FileSaver(new Blob([bytes]), "test.exp");
	}
}

export default Container;
