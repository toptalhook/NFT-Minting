import {config as dotEnvConfig} from 'dotenv';
dotEnvConfig();

import type {HardhatUserConfig} from 'hardhat/types';

import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-solhint';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-ethers';
// import 'hardhat-contract-sizer';
// import "hardhat-change-network";

const {
  mnemonic,
  goerliApiKey,
  bscscanApiKey,
  fantomApiKey,
  arbitrumGoerliApiKey,
  polygonMumbaiApiKey,
} = require("./secrets.json");

const HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  // redirect typechain output for the frontend
  typechain: {
    outDir: "./types/typechain",
  },
  networks: {
    hardhat: {
      // gas: "auto",
      // gasPrice: "auto",
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      // gas: "auto",
      // gasPrice: 20000000000,
    },

    // live net
    mainnet: {
      // ethereum
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
      chainId: 1,
      accounts: { mnemonic: mnemonic },
    },
    bsc: {
      url: "https://bsc-dataseed1.binance.org",
      chainId: 56,
      accounts: { mnemonic: mnemonic },
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: { mnemonic: mnemonic },
    },
    polygon: {
      url: "https://rpc-mainnet.maticvigil.com",
      chainId: 137,
      accounts: { mnemonic: mnemonic },
    },
    arbitrumOne: {
      // arbitrum
      url: `https://arb1.arbitrum.io/rpc`,
      chainId: 42161,
      accounts: { mnemonic: mnemonic },
    },
    optimisticEthereum: {
      // optimism
      url: `https://mainnet.optimism.io`,
      chainId: 10,
      accounts: { mnemonic: mnemonic },
    },
    opera: {
      // fantom
      url: `https://rpcapi.fantom.network`,
      chainId: 250,
      accounts: { mnemonic: mnemonic },
    },
    //

    // test net
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
      chainId: 5,
      accounts: { mnemonic: mnemonic },
    },
    bscTestnet: {
      // bsc testnet
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      // url: `https://data-seed-prebsc-2-s1.binance.org:8545/`,
      // url: `https://data-seed-prebsc-1-s2.binance.org:8545/`,
      // url: `https://data-seed-prebsc-2-s2.binance.org:8545/`,
      // url: `https://data-seed-prebsc-1-s3.binance.org:8545/`,
      // url: `https://data-seed-prebsc-2-s3.binance.org:8545/`,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic },
    },
    avalancheFujiTestnet: {
      // fuji
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      chainId: 43113,
      accounts: { mnemonic: mnemonic },
    },
    polygonMumbai: {
      // mumbai
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: { mnemonic: mnemonic },
    },
    arbitrumGoerli: {
      // arbitrum goerli
      // url: `https://goerli-rollup.arbitrum.io/rpc/`,
      url: `https://arbitrum-goerli.public.blastapi.io`,
      // url: `https://endpoints.omniatech.io/v1/arbitrum/goerli/public`,
      chainId: 421613,
      accounts: { mnemonic: mnemonic },
    },
    optimisticGoerli: {
      // optimism goerli
      url: `https://goerli.optimism.io/`,
      chainId: 420,
      accounts: { mnemonic: mnemonic },
    },
    ftmTestnet: {
      // fantom testnet
      url: `https://rpc.testnet.fantom.network/`,
      // url: `https://fantom-testnet.public.blastapi.io`,
      // url: `https://endpoints.omniatech.io/v1/fantom/testnet/public`,
      // url: `https://rpc.ankr.com/fantom_testnet`,
      chainId: 4002,
      accounts: { mnemonic: mnemonic },
    },
    //
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/

    apiKey: {
      goerli: goerliApiKey,
      bscTestnet: bscscanApiKey,
      ftmTestnet: fantomApiKey,
      arbitrumGoerli: arbitrumGoerliApiKey,
      polygonMumbai: polygonMumbaiApiKey,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000000000000,
  },
};

module.exports = HardhatUserConfig;
