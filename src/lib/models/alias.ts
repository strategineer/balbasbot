import * as mongoose from 'mongoose';

export interface AliasDocument extends mongoose.Document {
  _id: string;
  command: string;
}

export const AliasSchema = new mongoose.Schema({
  id: { type: String, required: true },
  command: { type: String, required: true },
});

AliasSchema.methods.toString = function (): string {
  return `${this.id} runs '${this.command}'`;
};

export const Alias = mongoose.model<AliasDocument>('Alias', AliasSchema);
