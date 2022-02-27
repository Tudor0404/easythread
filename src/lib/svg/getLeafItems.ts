import Paper from "paper";
import copyStyling from "./copyStyling";

/**
 * @description get all items which have no children, and have at least a stroke or fill (this prevents selecting empty groups)
 * @param layer layer to get all of the items out of, if left empty, uses the project window
 * @returns {paper.Item[]} list fo leaf items
 */
function getLeafItems(layer: paper.Layer | null = null): paper.Item[] {
	try {
		if (layer === null) layer = Paper.project.layers[0];

		let items = layer
			.getItems({})
			.filter((item) => {
				// remove all items with children apart from compound paths
				if (
					(item.hasChildren() &&
						item.constructor.name !== "CompoundPath") ||
					(!item.hasStroke() && !item.hasFill())
				)
					return false;
				return true;
			})
			.map((item: paper.Item) => {
				// reapply styling if it has no styling
				copyStyling(item);
				return item;
			});

		// remove items that have their parents still in the array (paths of compound paths)
		items = items.filter((item) => {
			if (items.includes(item.parent)) return false;
			return true;
		});

		// remove very small shapes
		items = items.filter((e) => {
			if (e.hasChildren()) return true;

			//@ts-ignore
			const item: paper.Path = e;
			if (item.closed && !item.hasStroke() && Math.abs(item.area) < 5)
				return false;
			return true;
		});

		return items;
	} catch {
		return [];
	}
}

export default getLeafItems;
