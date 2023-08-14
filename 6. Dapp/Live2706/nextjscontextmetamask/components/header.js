"use client";
import { useWalletProvider } from "../hooks/useWalletProvider";
import { ethhers } from "ethers";
import { Flex, Text, Button } from "@chakra-ui/react";

const Header = () => {
  const { account, connect } = useWalletProvider();

  const connectWallet = () => {
    connect();
  };

  return (
    <Flex p="2rem" justify="space-between" align="center">
      <Text>Logo</Text>
      {account !== null ? (
        <Text>
          Account connect : <Text as="span" fontWeight="bold"></Text>
        </Text>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </Flex>
  );
};

export default Header;
