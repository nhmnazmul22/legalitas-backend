import { configureStore } from "@reduxjs/toolkit";
import ProposalReducer from "@/store/proposalSlice";
import BlogReducer from "@/store/blogSlice";
export const store = configureStore({
  reducer: {
    proposal: ProposalReducer,
    blog: BlogReducer,
  },
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
