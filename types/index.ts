export interface ServiceType {
  id: string;
  name: string;
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
  createdAt?: string;
}

export interface RequestedProposal {
  _id?: string | number;
  id?: string | number;
  clientName: string;
  clientEmail: string;
  clientWhatsAppNumber: string;
  voucherCode?: string | null;
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
}

export interface CommentType {
  name: string;
  email: string;
  website?: string; // optional
  comment: string;
}

export interface BlogType {
  _id?: string;
  title?: string;
  thumbnail?: string;
  shortDes?: string;
  content?: string;
  tags?: string[];
  category?: string;
  authorId?: string;
  comments?: CommentType[];
  createdAt?: string;
}
