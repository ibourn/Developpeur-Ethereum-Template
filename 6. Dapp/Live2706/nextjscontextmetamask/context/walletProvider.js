"use client";
import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { startOptimizedAppearAnimation } from "framer-motion";

const walletContext = createContext();

export const WalletProvider = ({ children }) => {
  //States
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  let currentAccount = null;

  //events
  useEffect(() => {
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);
    //faire return pour nettoyer les events
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  //connexion function
  const connect = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      startApp(provider);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId.toString() === "0x5") {
        ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              console.log("Please connect to MetaMask.");
            } else {
              console.error(err);
            }
          });
      } else {
        console.log("Please connect to the Goerli!");
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const startApp = (provider) => {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }
    // setProvider(provider);
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      //use changed account thne disconnect
      console.log("Please connect to MetaMask.");
      setAccount(null);
      setProvider(null);
      setChainId(null);
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setAccount(accounts[0]);
      setProvider(new ethers.providers.Web3Provider(ethereum));
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  return (
    <walletContext.Provider value={{ account, provider, chainId, connect }}>
      {children}
    </walletContext.Provider>
  );
};

export default walletContext;
