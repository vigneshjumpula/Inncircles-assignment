
import { Schema, Document, model } from 'mongoose';
import { ServiceType, OrganizationName, Gender, VehicleType } from '../models/enum';

export interface IUser extends Document {
  type_of_service: ServiceType;
  organization_name: OrganizationName;
  full_name: string;
  languages: string[];
  gender: Gender;
  phone_number: number;
  email: string;
  choose_vehicle: VehicleType;
  profile?: string;
  kyc?: string;
  document?: string;
  joined_date?: Date;
  employee_code?: number;
}

const userSchema = new Schema<IUser>({
  type_of_service: { 
    type: String, 
    required: true,
    enum: Object.values(ServiceType)
  },
  organization_name: { 
    type: String, 
    required: true,
    enum: Object.values(OrganizationName)
  },
  full_name: { type: String, required: true },
  languages: { type: [String], required: true },
  gender: { 
    type: String, 
    required: true,
    enum: Object.values(Gender)
  },
  phone_number: { type: Number, required: true },
  email: { type: String, required: true },
  choose_vehicle: { 
    type: String, 
    required: true,
    enum: Object.values(VehicleType)
  },
  profile: { type: String, default: '' },
  kyc: { type: String, default: '' },
  document: { type: String, default: '' },
  joined_date: { type: Date, default: Date.now },
  employee_code: { type: Number },
});

export default model<IUser>('User', userSchema);
