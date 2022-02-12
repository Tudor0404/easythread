import Paper from "paper";
import copyStyling from "./copyStyling";

/**
 * @description get all items which have no children, and have at least a stroke or fill (this prevents selecting empty groups)
 * @param layer layer to get all of the items out of, if left empty, uses the project window
 * @returns {paper.Item[]} list fo leaf items
 */
function getLeafItems(layer: paper.Layer | null = null): paper.Item[] {
	if (layer === null) layer = Paper.project.layers[0];
	return layer
		.getItems({})
		.filter((item) => {
			if (item.hasChildren() || (!item.hasStroke() && !item.hasFill()))
				return false;
			return true;
		})
		.map((item: paper.Item) => {
			copyStyling(item);
			return item;
		});
}

export default getLeafItems;
