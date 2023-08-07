import { Note } from "../repositories/notesRepository";

function noteToString(note: Note) {
  return `
    id: ${note.id};
    name: ${note.name};
    created: ${note.created};
    category: ${note.category};
    content: ${note.content};
    isActive: ${note.isActive};
  `;
}

function isUniqueId(id: string, notes: Note[]) {
  return !notes.some((note) => note.id === id);
}

export { noteToString, isUniqueId };
