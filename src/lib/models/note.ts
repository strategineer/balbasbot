import * as mongoose from 'mongoose';

export interface INote extends mongoose.Document {
  _id: string;
  text: string;
}

export const NoteScema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const Note = mongoose.model<INote>('Note', NoteScema);
export default Note;
