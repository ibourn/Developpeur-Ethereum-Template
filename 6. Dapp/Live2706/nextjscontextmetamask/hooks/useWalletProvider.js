"use client";
import { useContext } from "react";
import walletContext from "@/context/walletProvider";

export default function useWalletProvider() {
  const context = useContext(walletContext);
  if (!context) {
    throw new Error("useWalletProvider must be used within a WalletProvider");
  }
  return context;
}
