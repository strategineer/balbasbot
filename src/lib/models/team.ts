import * as mongoose from 'mongoose';
import moment = require('moment');

export interface TeamDocument extends mongoose.Document {
  _id: string;
  wins: number;
  draws: number;
  losses: number;
  createdAt: Date;
  retiredOn: Date;
}

export const TeamSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    wins: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    retiredOn: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

TeamSchema.methods.toString = function (): string {
  let str = '';
  str += `${this.id}: ${this.wins}-${this.draws}-${
    this.losses
  } created on ${moment(this.createdAt)}`;
  if (this.retiredOn) {
    str += ` retired on ${moment(this.retiredOn)}`;
  }
  return str;
};

TeamSchema.query.active = function () {
  return this.where({ retiredOn: null });
};

export const Team = mongoose.model<TeamDocument>('Team', TeamSchema);
