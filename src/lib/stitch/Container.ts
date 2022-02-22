import Paper from "paper";

import Block from "./Block";
import { embroideryTypes } from "../../types/embroideryTypes.d";
import getLeafItems from "../svg/getLeafItems";
import runningPath from "./convert/runningPath";
import satinPath from "./convert/satinPath";
import itemToPathItem from "../svg/itemToPathItem";
import straightSubdivision from "./convert/straightSubdivision";
import FileSaver from "file-saver";
import fillPath from "./convert/fillPath";
import eventBus from "../eventBus";

// NOTE: 1 unit on the canvas is 1mm, but since most embroider file types use an arbitrary unit of max 127 and min -127, the units will be divided by 10 to give an accuracy of 1/10mm for the embroidery file types, with a maximum of 12.7mm distance between jumps and stitches.

class Container {
	public sequence: Block[] = [];

	public async convertToBlocks(layer: paper.Layer) {
		// TODO: reduce jump stitches between blocks
		// TODO: reduce jump stitches to closed running paths by start offset from the start
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
		const fillGutterSpacing =
			parseFloat(
				window.localStorage.getItem("fillGutterSpacing") || "1"
			) || 1;

		console.log(fillGutterSpacing);

		for (const item of leafItems) {
			let strokeFlag = false;
			if (item.hasFill()) {
				const pathItem = await itemToPathItem(item);
				if (pathItem === undefined) continue;
				try {
					let result = await fillPath(
						pathItem,
						stitchLength,
						this.sequence.length > 0
							? this.sequence[this.sequence.length - 1].stitches[
									this.sequence[this.sequence.length - 1]
										.stitches.length - 1
							  ]
							: null,
						fillGutterSpacing
					);
					if (result) {
						for (const section of result) {
							this.sequence.push(
								new Block(section, item.fillColor)
							);
						}
					}
				} catch (err) {
					// shape probabily too small, just make the perimeter
					strokeFlag = true;
					console.log("error: " + err);
				}
			}
			if (item.hasStroke() || strokeFlag) {
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

		this.sequenceSanitise();

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
			let command = `M ${block.stitches[0].x.toFixed(
				1
			)},${block.stitches[0].y.toFixed(1)}`;

			// create a jump stitch path from last point
			if (i > 0) {
				commands.push([
					`M ${this.sequence[i - 1].stitches[0].x.toFixed(
						1
					)},${this.sequence[i - 1].stitches[0].y.toFixed(
						1
					)} L ${block.stitches[0].x.toFixed(
						1
					)},${block.stitches[0].y.toFixed(1)}`,
					"dashed",
					block.colour || new Paper.Color("black"),
				]);
			}

			// creates straight line to next absolute stitch position
			for (let j = 1; j < block.stitches.length; j++) {
				const S = block.stitches[j];
				command += ` L ${S.x.toFixed(1)},${S.y.toFixed(1)}`;
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
			path.strokeWidth = 0.27;
			if (command[1] === "dashed") {
				path.dashArray = [2, 2];
				path.opacity = 1;
			}
			layer.addChild(path);
		});

		eventBus.dispatch("setCanvasLayer", layer);
		return layer;
	}

	public convertToEmbroidery(type: embroideryTypes, filename: string) {
		if (this.sequence.length === 0) return;
		switch (type) {
			case embroideryTypes.exp:
				this.convertToExp(filename.replace(" ", "_"));
				break;

			default:
				break;
		}
	}

	private convertToExp(filename: string) {
		let preBytes: ["stitch" | "jump" | "end" | "stop", number, number][] =
			[];
		let cP: paper.Point = this.sequence[0].stitches[0];

		for (let i = 0; i < this.sequence.length; i++) {
			const block = this.sequence[i];

			// change colour if the colours coming up are not the same
			if (i > 0 && this.sequence[i - 1].colour !== block.colour) {
				preBytes.push(["stop", 0, 0]);
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

				// ignore first point since starting from there
				for (let j = 1; j < jumpPoints.length; j++) {
					const nP = jumpPoints[j];
					let dX = Math.trunc((nP.x - cP.x) * 10);
					let dY = -Math.trunc((nP.y - cP.y) * 10);
					preBytes.push(["jump", dX, dY]);
					// adjust the new point with the difference in mind, this prevents offset
					cP = new Paper.Point(cP.x + dX / 10, cP.y - dY / 10);
				}
			}

			for (let s = 0; s < block.stitches.length; s++) {
				const nP = block.stitches[s];
				let dX = Math.trunc((nP.x - cP.x) * 10);
				let dY = -Math.trunc((nP.y - cP.y) * 10);
				preBytes.push(["stitch", dX, dY]);
				// adjust the new point with the difference in mind, this prevents offset
				cP = new Paper.Point(cP.x + dX / 10, cP.y - dY / 10);
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

		FileSaver(new Blob([bytes]), filename + ".exp");
	}

	private sequenceSanitise() {
		// sanitizes the sequence (removes blocks with <3 stitches, removes null points)
		this.sequence = this.sequence
			.filter((block) => block.stitches.length > 2)
			.map((block) => {
				return new Block(
					block.stitches.filter((stitch) => stitch !== null),
					block.colour
				);
			});
	}
}

export default Container;
