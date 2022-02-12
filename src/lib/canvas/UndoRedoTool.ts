import Paper from "paper";
import eventBus from "../eventBus";
import options from "../../data/options.json";

class UndoRedoTool {
	private static undoStack: paper.Layer[] = [];
	private static redoStack: paper.Layer[] = [];

	public static addStateDefault() {
		UndoRedoTool.undoStack.push(
			Paper.project.layers[0].clone({ insert: false })
		);

		// since state changed, must clean redo stack
		UndoRedoTool.redoStack = [];

		UndoRedoTool.checkSize();

		UndoRedoTool.dispatchAvailability();
	}

	public static undo() {
		if (UndoRedoTool.undoStack.length > 0) {
			UndoRedoTool.redoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.undoStack.pop());
		}

		UndoRedoTool.checkSize();

		UndoRedoTool.dispatchAvailability();
	}

	public static redo() {
		if (UndoRedoTool.redoStack.length > 0) {
			UndoRedoTool.undoStack.push(
				Paper.project.layers[0].clone({ insert: false })
			);
			eventBus.dispatch("setCanvasLayer", UndoRedoTool.redoStack.pop());
		}

		UndoRedoTool.checkSize();
		UndoRedoTool.dispatchAvailability();
	}

	private static dispatchAvailability() {
		eventBus.dispatch("undoAvailable", UndoRedoTool.undoStack.length > 0);
		eventBus.dispatch("redoAvailable", UndoRedoTool.redoStack.length > 0);
	}

	private static checkSize() {
		if (UndoRedoTool.undoStack.length > options.maxUndo)
			UndoRedoTool.undoStack.slice(
				UndoRedoTool.undoStack.length - options.maxUndo
			);
		if (UndoRedoTool.redoStack.length > options.maxRedo)
			UndoRedoTool.redoStack.slice(
				UndoRedoTool.redoStack.length - options.maxRedo
			);
	}
}

export default UndoRedoTool;
