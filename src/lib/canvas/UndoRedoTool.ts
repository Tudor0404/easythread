import Paper from "paper";
import eventBus from "../eventBus";
import options from "../../data/options.json";
import Container from "../stitch/Container";

class UndoRedoTool {
	private static undoStack: paper.Layer[] = [];
	private static redoStack: paper.Layer[] = [];

	/**
	 * @description grabs the 1st layer of the project and saves it to a stack
	 * @returns {void}
	 */
	public static addStateDefault() {
		if (Paper.project.layers.length === 0) return;

		UndoRedoTool.undoStack.push(
			Paper.project.layers[0].clone({ insert: false })
		);

		UndoRedoTool.redoStack = [];

		// since state changed, must clean redo stack

		UndoRedoTool.checkSize();

		UndoRedoTool.dispatchAvailability();
	}

	/**
	 * @description gets the previous state saved in the undo stack
	 */
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

	/**
	 * @description gets the previous state saved in the redo stack
	 */
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

	/**
	 * @description checks and reduces the size of the stacks if they are getting too big
	 */
	private static dispatchAvailability() {
		eventBus.dispatch("undoAvailable", UndoRedoTool.undoStack.length > 0);
		eventBus.dispatch("redoAvailable", UndoRedoTool.redoStack.length > 0);
	}

	/**
	 * @description creates event listeners between multiple endpoints, this allows for separate components to communicate
	 */
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
