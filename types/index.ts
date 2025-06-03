export interface ServiceType {
  id: string;
  title: string;
  value: string;
}

export interface UserType {
  _id?: string | number;
  fullName: string;
  email: string;
  whatsappNumber: string;
  service: string;
  username: string;
  notes?: string;
  status: string;
  address?: string;
}
