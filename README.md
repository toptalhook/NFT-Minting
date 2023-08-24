# Contract Playground

This is a Hardhat project with several simple contracts and their test in TypeScript. It uses [OpenZeppelin](https://www.openzeppelin.com/) contracts as the base contract most of the time.

Compiled contracts are fed into [TypeChain](https://github.com/dethcrypto/TypeChain) to generate types, which are then used within TypeScript.

## Usage

- `yarn compile` to compile the contracts.
- `yarn test` to test the contracts.
- `yarn lint` to lint everything.
- `yarn node:start` to start a Hardhat node on `localhost`.
- `yarn node:run <path>` to run a script at the given path on `localhost`.
- `yarn deploy` to deploy contract to Mumbai testnet.
- `yarn verify` to verify contract which is deployed to Mumbai testnet. Before it, you should update deployed contract address with recent one.

## Formatting & Linting

- TypeScript codes are formatted & linted with [GTS](https://github.com/google/gts).
- Contracts are formatted with [Solidity + Hardhat](https://hardhat.org/hardhat-vscode/docs/formatting).
- Contracts are linted with [solhint](https://protofire.github.io/solhint).
