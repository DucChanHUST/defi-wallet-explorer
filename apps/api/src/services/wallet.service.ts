import * as walletRepository from "../repositories/wallet.repository";

export const getWallet = async (address: string) => {
  return walletRepository.findWalletByAddress(address);
};

export const getRelatedWallets = async (address: string) => {
  return walletRepository.findRelatedWallets(address);
};
