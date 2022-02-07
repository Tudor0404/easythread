import Paper from "paper";

// get all items which have no children, and have at least a stroke or fill (this prevents selecting empty groups)
function getLeafItems(layer: paper.Layer | null = null) {
	if (layer === null)
		return Paper.project.getItems({}).filter((item) => {
			if (item.hasChildren() || (!item.hasStroke() && !item.hasFill()))
				return false;
			return true;
		});
	return layer.getItems({}).filter((item) => {
		if (item.hasChildren() || (!item.hasStroke() && !item.hasFill()))
			return false;
		return true;
	});
}

export default getLeafItems;
