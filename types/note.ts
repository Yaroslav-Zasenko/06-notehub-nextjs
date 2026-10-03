export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

// Додаємо інтерфейс для відповіді зі списком і загальною кількістю
export interface NotesResponse {
  notes: Note[];
  total: number;
}
