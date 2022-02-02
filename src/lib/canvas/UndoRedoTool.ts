import Paper from "paper";

class UndoRedoTool {
	static stack: paper.Layer[] = [];

	static addState(state: paper.Layer) {
		this.stack.push(state);
	}

	static Undo() {
		if (UndoRedoTool.stack.length > 0) {
			Paper.project.clear();
			//@ts-ignore
			Paper.project.addLayer(UndoRedoTool.stack.pop());
		}
	}

	static Redo() {}
}

export default UndoRedoTool;
