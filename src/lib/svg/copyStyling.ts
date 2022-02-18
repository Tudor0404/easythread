/**
 * @description copies the styling of one item to another, or from its parent. Returns the item
 * @param reciever item that will recieve the styling
 * @param giver item that will give the styling, if left out, will get the first parent that has valid styling
 * @returns {paper.Item}
 */
function copyStyling(reciever: paper.Item, giver: paper.Item | null = null) {
	if (reciever.hasFill() || reciever.hasStroke()) {
		return reciever;
	} else if (giver === null && hasParent(reciever)) {
		giver = reciever.parent;
		while (!(giver.hasFill() || giver.hasStroke())) {
			if (hasParent(giver)) giver = giver.parent;
			else return;
		}
		copyStyles(reciever, giver);
	} else if (giver !== null) {
		copyStyles(reciever, giver);
	}

	return reciever;
}

function copyStyles(reciever: paper.Item, giver: paper.Item) {
	reciever.strokeCap = giver.strokeCap;
	reciever.strokeColor = giver.strokeColor;
	reciever.strokeJoin = giver.strokeJoin;
	reciever.strokeScaling = giver.strokeScaling;
	reciever.strokeWidth = giver.strokeWidth;
	reciever.fillColor = giver.fillColor;
	reciever.fillRule = giver.fillRule;
}

function hasParent(item: paper.Item) {
	return item.parent !== null;
}

export default copyStyling;
