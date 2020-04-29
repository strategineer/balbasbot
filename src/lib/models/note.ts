import * as mongoose from 'mongoose';

export interface NoteDocument extends mongoose.Document {
  _id: string;
  text: string;
}

export const NoteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

export const Note = mongoose.model<NoteDocument>('Note', NoteSchema);
