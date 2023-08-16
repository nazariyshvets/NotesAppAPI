import { Request, Response } from "express";
import { Note, noteSchema, categories } from "../repositories/notesRepository";
import { isUniqueId } from "../helpers/noteHelpers";
import pool from "../database/db";

async function getNotes(req: Request, res: Response) {
  try {
    const query = "SELECT * FROM notes";
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching notes", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createNote(req: Request, res: Response) {
  try {
    const validatedNote: Note = await noteSchema.validate(req.body);
    const selectQuery = "SELECT * FROM notes";
    const { rows } = await pool.query(selectQuery);

    if (!isUniqueId(validatedNote.id, rows)) {
      throw new Error("The given id is already used");
    }

    const { id, name, created, category, content, isActive } = validatedNote;
    const insertQuery = `
      INSERT INTO notes (id, name, created, category, content, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)`;

    await pool.query(insertQuery, [
      id,
      name,
      created,
      category,
      content,
      isActive.toString(),
    ]);
    res.json({ message: "POST request successful" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

async function getNotesStats(req: Request, res: Response) {
  try {
    const selectQuery = "SELECT * FROM notes";
    const { rows } = await pool.query(selectQuery);

    const stats = categories.map((category) => {
      const { activeNum, archivedNum } = rows.reduce(
        (prevResult, note) => ({
          activeNum:
            prevResult.activeNum +
            (note.is_active && note.category === category ? 1 : 0),
          archivedNum:
            prevResult.archivedNum +
            (!note.is_active && note.category === category ? 1 : 0),
        }),
        { activeNum: 0, archivedNum: 0 }
      );

      return { category, activeNum, archivedNum };
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching notes", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getNoteById(req: Request, res: Response) {
  try {
    const noteId = req.params.id;
    const selectQuery = "SELECT * FROM notes WHERE id = $1";
    const { rows } = await pool.query(selectQuery, [noteId]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    const note = rows[0];
    res.json(note);
  } catch (error) {
    console.error("Error fetching note", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateNote(req: Request, res: Response) {
  const noteId = req.params.id;

  try {
    const validatedNote: Note = await noteSchema.validate(req.body);

    const updateQuery = `
      UPDATE notes
      SET name = $1, created = $2, category = $3, content = $4, is_active = $5
      WHERE id = $6`;

    const values = [
      validatedNote.name,
      validatedNote.created,
      validatedNote.category,
      validatedNote.content,
      validatedNote.isActive,
      noteId,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 1) {
      res.json({ message: "PATCH request successful" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

async function deleteNote(req: Request, res: Response) {
  const noteId = req.params.id;

  try {
    const deleteQuery = "DELETE FROM notes WHERE id = $1";
    const result = await pool.query(deleteQuery, [noteId]);

    if (result.rowCount === 1) {
      res.json({ message: "DELETE request successful" });
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
