import { RequestedProposal } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProposalType = {
  proposal: RequestedProposal;
};

const initialState: ProposalType = {
  proposal: {
    clientName: "",
    clientEmail: "",
    clientWhatsAppNumber: "",
    status: "",
    createdAt: "",
    proposalDetails: {
      _id: "",
      category: "",
      name: "",
      price: "",
      features: [],
    },
  },
};

const proposalSlice = createSlice({
  name: "addProposalInfo",
  initialState,
  reducers: {
    setProposal: (state, action: PayloadAction<RequestedProposal>) => {
      state.proposal = action.payload;
    },
  },
});

export const { setProposal } = proposalSlice.actions;

export default proposalSlice.reducer;
