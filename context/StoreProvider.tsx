"use client";

import { store } from "@/store";
import React from "react";
import { Provider } from "react-redux";

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
