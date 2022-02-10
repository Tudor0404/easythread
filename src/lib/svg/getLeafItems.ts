import Paper from "paper";

/**
 * @description get all items which have no children, and have at least a stroke or fill (this prevents selecting empty groups)
 * @param layer layer to get all of the items out of, if left empty, uses the project window
 * @returns {paper.Item[]} list fo leaf items
 */
function getLeafItems(layer: paper.Layer | null = null): paper.Item[] {
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
