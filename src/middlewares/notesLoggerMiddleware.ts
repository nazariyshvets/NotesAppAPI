import { Request, Response, NextFunction } from "express";
import { notes } from "../repositories/notesRepository";
import { noteToString } from "../helpers/noteHelpers";

function notesLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();

  if (req.method !== "GET") {
    const notesString = notes.map((note) => noteToString(note)).join("");
    console.log(`Notes: ${notesString}`);
  }
}

export default notesLoggerMiddleware;
