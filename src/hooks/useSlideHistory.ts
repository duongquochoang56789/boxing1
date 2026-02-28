import { useRef, useCallback } from "react";

interface HistoryEntry {
  slideId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

const MAX_HISTORY = 50;

export const useSlideHistory = () => {
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);

  const push = useCallback((entry: HistoryEntry) => {
    undoStack.current.push(entry);
    if (undoStack.current.length > MAX_HISTORY) {
      undoStack.current.shift();
    }
    redoStack.current = []; // Clear redo on new action
  }, []);

  const undo = useCallback((): HistoryEntry | null => {
    const entry = undoStack.current.pop();
    if (!entry) return null;
    redoStack.current.push(entry);
    return entry;
  }, []);

  const redo = useCallback((): HistoryEntry | null => {
    const entry = redoStack.current.pop();
    if (!entry) return null;
    undoStack.current.push(entry);
    return entry;
  }, []);

  const canUndo = useCallback(() => undoStack.current.length > 0, []);
  const canRedo = useCallback(() => redoStack.current.length > 0, []);

  return { push, undo, redo, canUndo, canRedo };
};
