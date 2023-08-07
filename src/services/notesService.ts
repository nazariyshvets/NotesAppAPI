import { Request, Response } from "express";
import {
  Note,
  noteSchema,
  categories,
  notes,
  setNotes,
} from "../repositories/notesRepository";
import { isUniqueId } from "../helpers/noteHelpers";

function getNotes(req: Request, res: Response) {
  res.json(notes);
}

async function createNote(req: Request, res: Response) {
  try {
    const validatedNote: Note = await noteSchema.validate(req.body);

    if (!isUniqueId(validatedNote.id, notes)) {
      throw new Error("The given id is already used");
    }

    setNotes([...notes, validatedNote]);
    res.json({ message: "POST request successful" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

function getNotesStats(req: Request, res: Response) {
  const stats = categories.map((category) => {
    const { activeNum, archivedNum } = notes.reduce(
      (prevResult, note) => ({
        activeNum:
          prevResult.activeNum +
          (note.isActive && note.category === category ? 1 : 0),
        archivedNum:
          prevResult.archivedNum +
          (!note.isActive && note.category === category ? 1 : 0),
      }),
      { activeNum: 0, archivedNum: 0 }
    );

    return { category, activeNum, archivedNum };
  });

  res.json(stats);
}

function getNoteById(req: Request, res: Response) {
  const noteId = req.params.id;
  const note = notes.find((note) => note.id === noteId);

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: "Note not found" });
  }
}

async function updateNote(req: Request, res: Response) {
  const noteId = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    try {
      const validatedNote: Note = await noteSchema.validate(req.body);
      const newNotes = [...notes];
      newNotes[noteIndex] = validatedNote;
      setNotes([...newNotes]);
      res.json({ message: "PATCH request successful" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } else {
    res.status(404).json({ error: "Note not found" });
  }
}

function deleteNote(req: Request, res: Response) {
  const noteId = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    const newNotes = notes.filter((note) => note.id !== noteId);
    setNotes(newNotes);
    res.json({ message: "DELETE request successful" });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
}

export {
  getNotes,
  createNote,
  getNotesStats,
  getNoteById,
  updateNote,
  deleteNote,
};
