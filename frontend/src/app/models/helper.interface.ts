import { ServiceType, OrganizationName, Gender, VehicleType } from '../enums/user.enums';

export interface Helper {
  _id: string;
  id: string;
  type_of_service: ServiceType;
  organization_name: OrganizationName;
  full_name: string;
  languages: string[];
  gender: Gender;
  phone_number: number;
  email: string;
  choose_vehicle: VehicleType;
  profile?: string | File;
  kyc: string | File;
  document: string | File;
  joined_date: Date | string;
  employee_code: number;
  households: number;
  [key: string]: any;
}
