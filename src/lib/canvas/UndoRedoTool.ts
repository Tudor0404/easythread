import Paper from "paper";
import eventBus from "../eventBus";
import options from "../../data/options.json";

class UndoRedoTool {
	private static undoStack: paper.Layer[] = [];
	private static redoStack: paper.Layer[] = [];

	public static addState(state: paper.Layer) {
		UndoRedoTool.undoStack.push(state.clone({ insert: false }));
	}

	public static addStateDefault() {
		UndoRedoTool.undoStack.push(
			Paper.project.layers[0].clone({ insert: false })
		);

		// since state changed, must clean redo stack
		UndoRedoTool.redoStack = [];

		UndoRedoTool.dispatchAvailability();
	}

	public static undo() {
		if (UndoRedoTool.undoStack.length > 0) {
			UndoRedoTool.redoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.undoStack.pop());
		}

		UndoRedoTool.dispatchAvailability();
	}

	public static redo() {
		if (UndoRedoTool.redoStack.length > 0) {
			UndoRedoTool.undoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.redoStack.pop());
		}

		UndoRedoTool.dispatchAvailability();
	}

	private static dispatchAvailability() {
		eventBus.dispatch("undoAvailable", UndoRedoTool.undoStack.length > 0);
		eventBus.dispatch("redoAvailable", UndoRedoTool.redoStack.length > 0);
	}

	private static checkSize() {
		if (UndoRedoTool.undoStack.length > options.maxUndo)
			UndoRedoTool.undoStack.slice(0, options.maxUndo);
	}
}

export default UndoRedoTool;
