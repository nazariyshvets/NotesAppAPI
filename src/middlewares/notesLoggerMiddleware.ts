import { Request, Response, NextFunction } from "express";
import { noteToString } from "../helpers/noteHelpers";
import pool from "../database/db";

async function notesLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();

  if (req.method !== "GET") {
    try {
      const query = "SELECT * FROM notes";
      const { rows } = await pool.query(query);
      const notesString = rows.map((note) => noteToString(note)).join("");
      console.log(`Notes: ${notesString}`);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default notesLoggerMiddleware;
