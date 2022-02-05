import Paper from "paper";
import DMCColours from "../../data/DMCColours.json";
import { Color } from "paper/dist/paper-core";
import { DMCColour } from "../../types/DMCColour";

function normaliseColour(
	elem?: paper.Item,
	stroke: boolean = true,
	fill: boolean = true
): void {
	if (elem) {
		if (fill && elem.fillColor) {
			elem.fillColor = new Paper.Color(
				getClosestColour(elem.fillColor)["#RGB"]
			);
		}
		if (stroke && elem.strokeColor)
			elem.strokeColor = new Paper.Color(
				getClosestColour(elem.strokeColor)["#RGB"]
			);
	} else {
		Paper.project.getItems({}).forEach((item) => {
			if (fill && item.fillColor)
				item.fillColor = new Paper.Color(
					getClosestColour(item.fillColor)["#RGB"]
				);
			if (stroke && item.strokeColor)
				item.strokeColor = new Paper.Color(
					getClosestColour(item.strokeColor)["#RGB"]
				);
		});
	}
}

function getClosestColour(c: paper.Color) {
	let smallestValue: number = 9999;
	let closestColour: any = null;

	DMCColours.forEach((e) => {
		let value = getValueHSB(e, c);

		if (value < smallestValue) {
			smallestValue = value;
			closestColour = e;
		}
	});

	return closestColour;
}

function getValueHSB(e: DMCColour, c: paper.Color) {
	// if the brightness is very low, hue does not matter, vice versa. This multiple will reflect this

	const brightnessMultiple =
		c.brightness < 0.05 ? 100 : -2.5 * c.brightness + 4;

	const c1 = new Color(e["#RGB"]);
	const dHue = c.hue - c1.hue;
	const dSaturation = c.saturation - c1.saturation;
	const dBrightness = c.brightness - c1.brightness;

	// get distance between colours
	// since saturation and brightness go from 0 to 1, I needed to normalise them to 0 to 360, the range that the Hue takes. Since humans precieve brightness better than colour, I gave brightness a slightly higher bias than saturation. I added a higher bias to hue than the rest since changing the hue is quite noticable
	let value = Math.sqrt(
		Math.pow(dHue * 3.5, 2) +
			Math.pow(dSaturation * 360 * 1.3, 2) +
			Math.pow(dBrightness * 360 * brightnessMultiple, 2)
	);

	return value;
}

function getValueRGB(e: DMCColour, c: paper.Color) {
	const c1 = new Color(e["#RGB"]);
	const dR = c.red - c1.red;
	const dG = c.green - c1.green;
	const dB = c.blue - c1.blue;

	// get distance between colours using the red, green, blue colour space
	let value = Math.sqrt(Math.pow(dR, 2) + Math.pow(dG, 2) + Math.pow(dB, 2));

	return value;
}

export default normaliseColour;
