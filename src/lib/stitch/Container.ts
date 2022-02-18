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
import fillPath from "./convert/fillPath";
import eventBus from "../eventBus";

// NOTE: 1 unit on the canvas is 1mm, but since most embroider file types use an arbitrary unit of max 127 and min -127, the units will be divided by 10 to give an accuracy of 1/10mm for the embroidery file types, with a maximum of 12.7mm distance between jumps and stitches.

class Container {
	public sequence: Block[] = [];

	public constructor(layer: paper.Layer) {
		this.convertToBlocks(layer);
	}

	//public switchBlocks() {}

	public async convertToBlocks(layer: paper.Layer) {
		this.sequence = [];

		const leafItems: paper.Item[] = getLeafItems(layer);
		const stitchLength =
			parseFloat(window.localStorage.getItem("stitchLength") || "2.7") ||
			2.7;
		const spaceBetweenNormals =
			parseFloat(
				window.localStorage.getItem("spaceBetweenNormals") || "1"
			) || 1;
		const satinStitchLength =
			parseFloat(
				window.localStorage.getItem("satinStitchLength") || "10"
			) || 10;

		for (const item of leafItems) {
			if (item.hasFill()) {
				const pathItem = await itemToPathItem(item);
				if (pathItem === undefined) continue;
				const result = await fillPath(
					pathItem,
					stitchLength,
					this.sequence.length > 0
						? this.sequence[this.sequence.length - 1].stitches[
								this.sequence[this.sequence.length - 1].stitches
									.length - 1
						  ]
						: null
				);
				if (result) {
					this.sequence.push(result);
				}
			}
			if (item.hasStroke()) {
				if (item.hasChildren()) {
					let pathDatas: string[] = [];

					for (const i of item.children) {
						let result = (await itemToPathItem(i))?.pathData;
						if (result === undefined) continue;
						pathDatas.push(result);
					}

					pathDatas.forEach((path) => {
						this.sequence.push(
							this.strokeToBlock(
								path,
								item.strokeWidth,
								stitchLength,
								spaceBetweenNormals,
								satinStitchLength,
								item.strokeColor || new Paper.Color("black")
							)
						);
					});
				} else {
					const pathData = (await itemToPathItem(item))?.pathData;
					if (pathData === undefined) return;

					this.sequence.push(
						this.strokeToBlock(
							pathData,
							item.strokeWidth,
							stitchLength,
							spaceBetweenNormals,
							satinStitchLength,
							item.strokeColor || new Paper.Color("black")
						)
					);
				}
			}
		}

		this.convertToEmbroidery(embroideryTypes.exp);
		eventBus.dispatch("setCanvasLayer", this.convertToSVG());
	}

	private strokeToBlock(
		path: string,
		width: number,
		stitchLength: number,
		spaceBetweenNormals: number,
		satinStitchLength: number,
		colour: paper.Color
	): Block {
		if (width > 4)
			return new Block(
				satinPath(
					new Paper.Path(path),
					width,
					satinStitchLength,
					spaceBetweenNormals
				),
				colour
			);
		else
			return new Block(
				runningPath(new Paper.Path(path), stitchLength),
				colour
			);
	}

	public convertToSVG(): paper.Layer | undefined {
		if (this.sequence.length === 0) return;
		let commands: [string, "solid" | "dashed", paper.Color][] = [];

		for (let i = 0; i < this.sequence.length; i++) {
			const block = this.sequence[i];
			let command = `M ${block.stitches[0].x},${block.stitches[0].y}`;

			// create a jump stitch path from last point
			if (i > 0) {
				commands.push([
					`M ${this.sequence[i - 1].stitches[0].x},${
						this.sequence[i - 1].stitches[0].y
					} L ${block.stitches[0].x},${block.stitches[0].y}`,
					"dashed",
					block.colour || new Paper.Color("black"),
				]);
			}

			// creates straight line to next absolute stitch position
			for (let j = 1; j < block.stitches.length; j++) {
				const S = block.stitches[j];
				command += ` L ${S.x},${S.y}`;
			}

			commands.push([
				command,
				"solid",
				block.colour || new Paper.Color("black"),
			]);
		}

		let layer = new Paper.Layer({ insert: false });

		commands.forEach((command) => {
			let path = Paper.PathItem.create(command[0]);
			path.strokeColor = command[2];
			path.strokeCap = "round";
			path.strokeJoin = "round";
			path.strokeWidth = 0.37;
			if (command[1] === "dashed") {
				path.dashArray = [2, 2];
				path.opacity = 0.7;
			}
			layer.addChild(path);
		});

		eventBus.dispatch("setCanvasLayer", layer);
		return layer;
	}

	public convertToEmbroidery(type: embroideryTypes) {
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
			if (
				prevColour?.red !== block.colour?.red ||
				prevColour?.green !== block.colour?.green ||
				prevColour?.blue !== block.colour?.blue
			) {
				console.log(
					"switching colours",
					prevColour?.toString(),
					block.colour?.toString()
				);
				preBytes.push(["stop", 0, 0]);
				prevColour = block.colour;
			}

			// jump to new block if points not the same
			if (cP !== block.stitches[0]) {
				// prevent jumping too far (max 12.7mm)
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

		// convert commands to bytes https://edutechwiki.unige.ch/en/Embroidery_format_EXP
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
