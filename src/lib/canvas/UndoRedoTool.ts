import Paper from "paper";
import eventBus from "../eventBus";

class UndoRedoTool {
	static undoStack: paper.Layer[] = [];
	static redoStack: paper.Layer[] = [];

	static addState(state: paper.Layer) {
		UndoRedoTool.undoStack.push(state.clone({ insert: false }));
	}

	static addStateDefault() {
		UndoRedoTool.undoStack.push(
			Paper.project.layers[0].clone({ insert: false })
		);

		// since state changed, must clean redo stack
		UndoRedoTool.redoStack = [];
	}

	static undo() {
		if (UndoRedoTool.undoStack.length > 0) {
			UndoRedoTool.redoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.undoStack.pop());
		}
	}

	static redo() {
		if (UndoRedoTool.redoStack.length > 0) {
			UndoRedoTool.undoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.redoStack.pop());
		}
	}
}

export default UndoRedoTool;
