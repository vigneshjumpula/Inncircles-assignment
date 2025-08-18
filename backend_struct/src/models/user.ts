
import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  type_of_service: string;
  organization_name: string;
  full_name: string;
  languages: string[];
  gender: string;
  phone_number: number;
  email: string;
  choose_vehicle: string;
  profile?: string;
  kyc?: string;
  joined_date?: Date;
  employee_code?: number;
}

const userSchema = new Schema<IUser>({
  type_of_service: { type: String, required: true },
  organization_name: { type: String, required: true },
  full_name: { type: String, required: true },
  languages: { type: [String], required: true },
  gender: { type: String, required: true },
  phone_number: { type: Number, required: true },
  email: { type: String, required: true },
  choose_vehicle: { type: String, required: true },
  profile: { type: String, default: '' },
  kyc: { type: String, default: '' },
  joined_date: { type: Date, default: Date.now },
  employee_code: { type: Number },
});

export default model<IUser>('User', userSchema);
