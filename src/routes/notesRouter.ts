import { Router } from "express";
import {
  getNotes,
  createNote,
  getNotesStats,
  getNoteById,
  updateNote,
  deleteNote,
} from "../services/notesService";

const router = Router();

router.get("/", getNotes);
router.post("/", createNote);
router.get("/stats", getNotesStats);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
