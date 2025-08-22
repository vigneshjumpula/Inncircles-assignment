export enum ServiceType {
  COOKING = 'cooking',
  CLEANING = 'cleaning',
  GARDENING = 'gardening',
  SECURITY = 'security',
}


export enum OrganizationName {
  ORGANIZATION1 = 'organization1',
  ORGANIZATION2 = 'organization2',
  ORGANIZATION3 = 'organization3',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum VehicleType {
  BIKE = 'bike',
  CAR = 'car',
  BUS = 'bus',
  METRO = 'metro',
}

export const getServiceTypes = (): string[] => Object.values(ServiceType);
export const getOrganizationNames = (): string[] => Object.values(OrganizationName);
export const getGenders = (): string[] => Object.values(Gender);
export const getVehicleTypes = (): string[] => Object.values(VehicleType);
