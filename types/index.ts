export interface ServiceType {
  id: string;
  name: string;
}

export interface UserType {
  _id?: string | number;
  fullName?: string;
  email?: string;
  whatsappNumber?: string;
  service?: string;
  proposalId?: string;
  username?: string;
  notes?: string;
  status?: string;
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

export interface RuleType {
  _id?: string;
  no: number | string;
  ruleCode: string;
  rule: string;
  description: string;
}

export interface AdminType {
  authorName?: string;
  bio?: string;
  email?: string;
  currentPassword?: string;
  password?: string;
  phone?: string;
  like?: string;
  profileImg?: string;
  socialLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
  };
}

export interface BankInfo {
  _id?: string | number;
  bankName?: string;
  accountNo?: string;
  accountHolder?: string;
  address?: string;
}

export interface InvoiceType {
  _id?: string | number;
  service?: string;
  invNo?: string;
  amount?: string;
  dueDate?: string;
  description?: string;
  status?: string;
  bankDetails?: BankInfo;
  clientDetails?: UserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProposalType {
  _id?: string | number;
  category?: string;
  name?: string;
  price?: string;
  features?: string[];
}

export interface ProgressStepsType {
  id: string | number;
  title: string;
  progress: number;
}

export interface ProgressType {
  _id?: string;
  serviceType: string;
  currentStep: {
    _id?: string;
    title: string;
    status: string;
  };
  initialNotes?: string;
  progressPercent: string;
  notificationMethods?: string;
  progressSteps?: {
    _id?: string;
    title: string;
    status: string;
  }[];
  status: string;
  clientDetails?: UserType;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileType {
  _id: string | number;
  fileName: string;
  fileLink: string;
  size: string;
  status: string;
  clientDetails: UserType;
  createdAt?: string;
  updatedAt?: string;
}
