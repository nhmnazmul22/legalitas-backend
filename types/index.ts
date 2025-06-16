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

type BonusItem = {
  bonusTitle: string;
  bonusSubTitle: string;
  icon: string;
};

type ServiceBasicInfo = {
  serviceName: string;
  shortDes: string;
  isBestSeller: boolean;
  thumbnail: string;
  description: string;
  lotsOfBonus: BonusItem[];
};

type IntroductionType = {
  content: string[];
  isBoxStyle: boolean;
};

type ProcessStep = {
  subsection: string;
  content: string[];
};

type ProcessStep2 = {
  content: string[];
};

type PricingFeature = {
  name: string;
  plans: {
    "plans-1": boolean;
    "plans-2": boolean;
    "plans-3"?: boolean;
  };
};
type PricingType = {
  plans: string[];
  features: PricingFeature[];
  prices: {
    "plans-1": string;
    "plans-2": string;
    "plans-3"?: string;
  };
  footerImg?: string;
};
type PricingType2 = {
  priceTitle: string;
  price: string;
  subTitle: string;
  isJobCompletion: boolean;
};
type FAQ = {
  question: string;
  ans: string;
};
type QuizItem = {
  id: number;
  question: string;
  options: string[];
};

type VoucherDetailsType = {
  thumbnail: string;
  services: string[];
  price: string;
  isLimitedTime: boolean;
  voucherImg: string;
  features_Price: {
    category: string;
    name: string;
    price: string;
    features: string[];
  }[];
  isJobCompletion: boolean;
};

type Condition3Props = {
  title: string;
  content: {
    title: string;
    item: string[];
  }[];
};

type ServiceData = {
  serviceBasicInfo: ServiceBasicInfo;
  introduction: IntroductionType;
  process: ProcessStep[];
  requiredDocuments: string[];
  choosingBusinessField: string[];
  pricing: PricingType;
  virtualOffice: boolean;
  faqs: FAQ[];
  quiz: QuizItem[];
  voucherDetails: VoucherDetailsType;
};