import * as mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  _id: string;
  username: string;
  events: Map<string, number>;
}

export const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  events: {
    type: Map,
    of: Number,
    required: true,
    default: new Map<string, number>(),
  },
});

export const User = mongoose.model<UserDocument>('User', UserSchema);
