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

export interface RequestedProposal {
  _id?:string | number;
  id?: string | number;
  clientName: string;
  clientEmail: string;
  clientWhatsAppNumber: string;
  voucherCode: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string; 
  proposalDetails: {
    _id: string;
    category: string;
    name: string;
    price: string;
    features: string[];
  };
};
