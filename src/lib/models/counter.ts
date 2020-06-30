import * as mongoose from 'mongoose';

export interface CounterDocument extends mongoose.Document {
  _id: string;
  displayName: string;
  order: number;
  initialValue: number;
  value: number;
  isCountingDown: boolean;
}

export const CounterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  displayName: { type: String, required: true },
  value: { type: Number, required: true },
  order: { type: Number, default: -1 },
  initialValue: { type: Number, default: 0 },
  isCountingDown: { type: Boolean, default: false },
});

CounterSchema.methods.active = function (): boolean {
  return this.order >= 0;
};

CounterSchema.methods.toString = function (): string {
  let str = `${this.id} displayed as ${this.displayName} counts `;
  str += this.isCountingDown ? 'down' : 'up';
  str += ` from ${this.initialValue} initially, currently at ${this.value} ordered at ${this.order}`;
  return str;
};

export const Counter = mongoose.model<CounterDocument>(
  'Counter',
  CounterSchema
);
