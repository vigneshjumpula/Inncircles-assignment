export interface Helper {
  _id: string;
  id: string;
  type_of_service: string;
  organization_name: string;
  full_name: string;
  languages: string[] | string;
  gender: string;
  phone_number: number;
  email: string;
  choose_vehicle: string;
  profile?: string | File;
  kyc: string | File;
  document: string | File;
  joined_date: Date | string;
  employee_code: number;
  households: number;
  [key: string]: any;
}
