import { configureStore } from "@reduxjs/toolkit";
import ProposalReducer from "@/store/proposalSlice";
import BlogReducer from "@/store/blogSlice";
import PaginationReducer from "@/store/paginationSlice";
import AdminReducer from "@/store/AdminSlice";
import BankReducer from "@/store/BankSlice";
import UserSlice from "@/store/UsersSlice";
import BankInfoReducer from "@/store/BankInfoSlice";
import InvoiceReducer from "@/store/InvoiceSlice";
import ProposalInfoReducer from "@/store/ProposalSliceById";
import FileReducer from "@/store/FileSlice";

export const store = configureStore({
  reducer: {
    proposal: ProposalReducer,
    blog: BlogReducer,
    pagination: PaginationReducer,
    admin: AdminReducer,
    bank: BankReducer,
    users: UserSlice,
    bankInfo: BankInfoReducer,
    invoices: InvoiceReducer,
    proposalInfo: ProposalInfoReducer,
    files: FileReducer,
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
